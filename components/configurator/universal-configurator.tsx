"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Maximize2,
  RotateCcw,
  Check,
  Palette,
  Shirt,
  Scissors,
  Package,
  Heart,
  Star,
  Ruler,
} from "lucide-react"
import { ModelViewer } from "@/components/3d-model-viewer"
import { motion, AnimatePresence } from "framer-motion"
import { getCustomizationOptions } from "@/lib/firebase/unified-product-service"
import { MeasurementStep } from "./steps/measurement-step"
import { CheckoutModal } from "./checkout-modal"

interface UniversalConfiguratorProps {
  productId: string
  productName: string
  basePrice: number
  productType?: string
}

interface CustomizationOption {
  id: string
  name: string
  type: "color" | "texture" | "component"
  category: string
  values: {
    id: string
    name: string
    value: string
    price: number
    thumbnail?: string
    color?: string
    layerControls?: {
      show: string[]
      hide: string[]
    }
  }[]
}

interface ConfiguratorState {
  [key: string]: {
    optionId: string
    valueId: string
    price: number
    value: string
    color?: string
    layerControls?: {
      show: string[]
      hide: string[]
    }
  }
}

interface MeasurementData {
  sizeType: "standard" | "custom"
  standardSize?: string
  fitType?: string
  customMeasurements?: {
    neck: number
    chest: number
    stomach: number
    hip: number
    length: number
    shoulder: number
    sleeve: number
  }
}

export function UniversalConfigurator({
  productId,
  productName,
  basePrice,
  productType = "garment",
}: UniversalConfiguratorProps) {
  const [customizationOptions, setCustomizationOptions] = useState<CustomizationOption[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [configuratorState, setConfiguratorState] = useState<ConfiguratorState>({})
  const [measurementData, setMeasurementData] = useState<MeasurementData>({
    sizeType: "standard",
    standardSize: "m",
    fitType: "regular",
    customMeasurements: {
      neck: 0,
      chest: 0,
      stomach: 0,
      hip: 0,
      length: 0,
      shoulder: 0,
      sleeve: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)

  // Load customization options
  useEffect(() => {
    const loadCustomizationOptions = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log(`Loading customization options for product: ${productId}`)
        const options = await getCustomizationOptions(productId)

        console.log(`Loaded ${options.length} customization options:`, options)
        setCustomizationOptions(options)

        if (options.length === 0) {
          setError(`No customization options found for product ${productId}`)
        }
      } catch (err) {
        console.error("Error loading customization options:", err)
        setError("Failed to load customization options")
      } finally {
        setLoading(false)
      }
    }

    if (productId) {
      loadCustomizationOptions()
    }
  }, [productId])

  // Total steps = customization options + measurement step
  const totalSteps = customizationOptions.length + 1
  const currentStepData = customizationOptions[currentStep]
  const isMeasurementStep = currentStep === customizationOptions.length

  // Calculate total price including measurement surcharge
  const calculatePrice = () => {
    let total = basePrice
    Object.values(configuratorState).forEach((selection) => {
      total += selection.price
    })
    // Add custom measurement surcharge
    if (measurementData.sizeType === "custom") {
      total += 25 // $25 surcharge for custom measurements
    }
    return total
  }

  // Calculate completion percentage
  const calculateCompletion = () => {
    const completedCustomizations = Object.keys(configuratorState).length
    const measurementCompleted =
      measurementData.sizeType === "standard"
        ? measurementData.standardSize && measurementData.fitType
        : Object.values(measurementData.customMeasurements || {}).some((val) => val > 0)

    const totalCompleted = completedCustomizations + (measurementCompleted ? 1 : 0)
    return totalSteps > 0 ? Math.round((totalCompleted / totalSteps) * 100) : 0
  }

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const selectOption = (
    optionId: string,
    valueId: string,
    price: number,
    value: string,
    color?: string,
    layerControls?: any,
  ) => {
    console.log(`Selecting option: ${optionId}, value: ${value}, color: ${color}`)
    setConfiguratorState((prev) => ({
      ...prev,
      [optionId]: {
        optionId,
        valueId,
        price,
        value,
        color,
        layerControls,
      },
    }))
  }

  const updateMeasurementData = (updates: Partial<MeasurementData>) => {
    setMeasurementData((prev) => ({ ...prev, ...updates }))
  }

  const isStepCompleted = (stepIndex: number) => {
    if (stepIndex < customizationOptions.length) {
      const option = customizationOptions[stepIndex]
      return option && configuratorState[option.id]
    } else {
      // Measurement step
      return measurementData.sizeType === "standard"
        ? measurementData.standardSize && measurementData.fitType
        : Object.values(measurementData.customMeasurements || {}).some((val) => val > 0)
    }
  }

  const getModelUrl = () => {
    switch (productType) {
      case "pants":
        return "sample-pants"
      case "jacket":
        return "sample-jacket"
      case "dress":
        return "sample-dress"
      default:
        return "sample-shirt"
    }
  }

  // Generate customizations for 3D model
  const generateCustomizations = () => {
    const customizations: Record<string, any> = {}

    Object.values(configuratorState).forEach((selection) => {
      const option = customizationOptions.find((opt) => opt.id === selection.optionId)
      const value = option?.values.find((val) => val.id === selection.valueId)

      if (value && option) {
        // Handle ALL colors - both from value.color and selection.color
        const colorValue = selection.color || value.color
        if (colorValue) {
          customizations.color = colorValue
          customizations.fabricColor = colorValue

          // Also set specific color properties based on option name
          const optionNameLower = option.name.toLowerCase().replace(/\s+/g, "")

          if (optionNameLower.includes("fabric") || optionNameLower.includes("main")) {
            customizations.fabricColor = colorValue
            customizations.mainColor = colorValue
          } else if (optionNameLower.includes("collar")) {
            customizations.collarColor = colorValue
          } else if (optionNameLower.includes("cuff")) {
            customizations.cuffColor = colorValue
          } else if (optionNameLower.includes("button")) {
            customizations.buttonColor = colorValue
          } else if (optionNameLower.includes("pocket")) {
            customizations.pocketColor = colorValue
          } else if (optionNameLower.includes("sleeve")) {
            customizations.sleeveColor = colorValue
          } else if (optionNameLower.includes("lining")) {
            customizations.liningColor = colorValue
          } else if (optionNameLower.includes("trim")) {
            customizations.trimColor = colorValue
          } else if (optionNameLower.includes("accent")) {
            customizations.accentColor = colorValue
          }
        }

        // Handle fabric types
        if (option.type === "texture") {
          customizations.fabrictype = value.value
        }

        // Handle ALL style customizations by mapping option names to customization keys
        const optionNameLower = option.name.toLowerCase().replace(/\s+/g, "")

        // Map specific option names to customization keys
        if (optionNameLower.includes("collar")) {
          customizations.collarstyle = value.value
        } else if (optionNameLower.includes("cuff")) {
          customizations.cuffstyle = value.value
        } else if (optionNameLower.includes("pocket")) {
          customizations.pocketstyle = value.value
        } else if (optionNameLower.includes("button") && optionNameLower.includes("style")) {
          customizations.buttonstyle = value.value
        } else if (optionNameLower.includes("button") && optionNameLower.includes("configuration")) {
          customizations.buttoncount = value.value
        } else if (optionNameLower.includes("fit")) {
          customizations.fitstyle = value.value
        } else if (optionNameLower.includes("monogram")) {
          customizations.monogram = value.value
        } else if (optionNameLower.includes("waistband")) {
          customizations.waistbandstyle = value.value
        } else if (optionNameLower.includes("hem")) {
          customizations.hemstyle = value.value
        } else if (optionNameLower.includes("belt")) {
          customizations.beltloops = value.value
        } else if (optionNameLower.includes("lapel")) {
          customizations.lapelstyle = value.value
        } else if (optionNameLower.includes("vent")) {
          customizations.ventstyle = value.value
        } else if (optionNameLower.includes("lining")) {
          customizations.liningstyle = value.value
        } else if (optionNameLower.includes("sleeve") && optionNameLower.includes("button")) {
          customizations.sleevebuttonstyle = value.value
        }
      }
    })

    console.log("Generated customizations for 3D model:", customizations)
    return customizations
  }

  // Generate layer controls for 3D model
  const generateLayerControls = () => {
    const layerControls: Record<string, string[]> = {}

    Object.values(configuratorState).forEach((selection) => {
      const option = customizationOptions.find((opt) => opt.id === selection.optionId)
      const value = option?.values.find((val) => val.id === selection.valueId)

      if (value?.layerControls) {
        if (value.layerControls.show) {
          layerControls.show = [...(layerControls.show || []), ...value.layerControls.show]
        }
        if (value.layerControls.hide) {
          layerControls.hide = [...(layerControls.hide || []), ...value.layerControls.hide]
        }
      }
    })

    return layerControls
  }

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fabric":
        return <Palette className="w-4 h-4" />
      case "style":
        return <Shirt className="w-4 h-4" />
      case "fit":
        return <Scissors className="w-4 h-4" />
      case "personalization":
        return <Star className="w-4 h-4" />
      case "interior":
        return <Package className="w-4 h-4" />
      case "details":
        return <Heart className="w-4 h-4" />
      case "measurements":
        return <Ruler className="w-4 h-4" />
      default:
        return <Shirt className="w-4 h-4" />
    }
  }

  // Generate order summary for checkout
  const generateOrderSummary = () => {
    const customizations = Object.values(configuratorState).map((selection) => {
      const option = customizationOptions.find((opt) => opt.id === selection.optionId)
      return {
        category: option?.name || "Unknown",
        value: selection.value,
        price: selection.price,
      }
    })

    return {
      productName,
      basePrice,
      customizations,
      measurementData,
      totalPrice: calculatePrice(),
    }
  }

  const handleAddToCart = () => {
    setShowCheckoutModal(true)
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading customization options...</p>
          <p className="text-sm text-gray-500 mt-2">Product: {productName}</p>
        </div>
      </div>
    )
  }

  if (error || customizationOptions.length === 0) {
    return (
      <div className="w-full h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Customization Not Available</h2>
          <p className="text-gray-600 mb-4">{error || "No customization options are configured for this product."}</p>
          <p className="text-sm text-gray-500 mb-4">Product ID: {productId}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full h-screen bg-gray-50 flex">
        {/* LEFT SIDEBAR - FIXED */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              {isMeasurementStep ? <Ruler className="w-4 h-4" /> : getCategoryIcon(currentStepData?.category || "")}
              <h1 className="text-xl font-semibold text-gray-900">
                {isMeasurementStep ? "Measurements" : currentStepData?.name || "Customize"}
              </h1>
            </div>
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-sm">
                Step {currentStep + 1} of {totalSteps}
              </Badge>
              <div className="text-lg font-bold text-gray-900">${calculatePrice().toFixed(2)}</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-600">{calculateCompletion()}%</span>
              </div>
              <Progress value={calculateCompletion()} className="h-2" />
            </div>

            {/* Step Navigation */}
            <div className="flex gap-2 flex-wrap">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all
                    ${
                      currentStep === index
                        ? "border-blue-500 bg-blue-500 text-white"
                        : isStepCompleted(index)
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 text-gray-500 hover:border-gray-400"
                    }
                  `}
                  title={index < customizationOptions.length ? customizationOptions[index].name : "Measurements"}
                >
                  {isStepCompleted(index) && currentStep !== index ? <Check className="w-4 h-4" /> : index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                {isMeasurementStep ? (
                  <MeasurementStep
                    sizeType={measurementData.sizeType}
                    standardSize={measurementData.standardSize || "m"}
                    fitType={measurementData.fitType || "regular"}
                    customMeasurements={
                      measurementData.customMeasurements || {
                        neck: 0,
                        chest: 0,
                        stomach: 0,
                        hip: 0,
                        length: 0,
                        shoulder: 0,
                        sleeve: 0,
                      }
                    }
                    onUpdate={updateMeasurementData}
                  />
                ) : (
                  currentStepData && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        {getCategoryIcon(currentStepData.category)}
                        <h3 className="font-semibold text-gray-900">{currentStepData.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {currentStepData.values.length} options
                        </Badge>
                      </div>

                      {currentStepData.type === "color" && (
                        <div className="grid grid-cols-2 gap-3">
                          {currentStepData.values.map((value) => (
                            <div
                              key={value.id}
                              onClick={() =>
                                selectOption(
                                  currentStepData.id,
                                  value.id,
                                  value.price,
                                  value.value,
                                  value.color || value.value,
                                  value.layerControls,
                                )
                              }
                              className={`
                                p-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105
                                ${
                                  configuratorState[currentStepData.id]?.valueId === value.id
                                    ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                }
                              `}
                            >
                              <div className="text-center">
                                <div
                                  className="w-10 h-10 rounded-full mx-auto mb-2 border-2 border-white shadow-sm"
                                  style={{ backgroundColor: value.color || value.value }}
                                />
                                <div className="text-xs font-medium text-gray-900">{value.name}</div>
                                {value.price > 0 && (
                                  <div className="text-xs text-green-600 font-semibold">+${value.price}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {(currentStepData.type === "texture" || currentStepData.type === "component") && (
                        <div className="space-y-3">
                          {currentStepData.values.map((value) => (
                            <div
                              key={value.id}
                              onClick={() =>
                                selectOption(
                                  currentStepData.id,
                                  value.id,
                                  value.price,
                                  value.value,
                                  value.color,
                                  value.layerControls,
                                )
                              }
                              className={`
                                p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${
                                  configuratorState[currentStepData.id]?.valueId === value.id
                                    ? "border-blue-500 bg-blue-50 shadow-sm"
                                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                                }
                              `}
                            >
                              <div className="flex items-center gap-3">
                                {value.thumbnail && (
                                  <img
                                    src={value.thumbnail || "/placeholder.svg"}
                                    alt={value.name}
                                    className="w-12 h-12 rounded-lg object-cover border"
                                  />
                                )}
                                {value.color && !value.thumbnail && (
                                  <div
                                    className="w-12 h-12 rounded-lg border-2 border-white shadow-sm"
                                    style={{ backgroundColor: value.color }}
                                  />
                                )}
                                <div className="flex-1">
                                  <div className="font-medium text-sm text-gray-900">{value.name}</div>
                                  {value.price > 0 && (
                                    <div className="text-green-600 font-semibold text-sm">+${value.price}</div>
                                  )}
                                  {value.price === 0 && <div className="text-gray-500 text-xs">Included</div>}
                                </div>
                                {configuratorState[currentStepData.id]?.valueId === value.id && (
                                  <Check className="w-5 h-5 text-blue-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-gray-600">
                {Object.keys(configuratorState).length + (isStepCompleted(customizationOptions.length) ? 1 : 0)} of{" "}
                {totalSteps} completed
              </div>
              <div className="text-lg font-bold text-gray-900">${calculatePrice().toFixed(2)}</div>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 0} size="sm">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              {currentStep < totalSteps - 1 ? (
                <Button onClick={nextStep} size="sm">
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700" size="sm" onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT AREA - 3D MODEL + CONTROLS */}
        <div className="flex-1 relative h-screen">
          {/* Top Controls */}
          <div className="absolute top-0 right-0 z-10 p-6 flex items-center gap-2">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="text-2xl font-bold text-gray-900">${calculatePrice().toFixed(2)}</div>
            </div>
            <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
              <ShoppingCart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
              <Maximize2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/90 backdrop-blur-sm">
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>

          {/* Product Info Overlay */}
          <div className="absolute top-6 left-6 z-10">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-lg">
              <h2 className="font-semibold text-gray-900">{productName}</h2>
              <p className="text-sm text-gray-600">{Object.keys(configuratorState).length} customizations applied</p>
              {isMeasurementStep && (
                <p className="text-sm text-blue-600">
                  {measurementData.sizeType === "standard" ? "Standard sizing" : "Custom measurements"}
                </p>
              )}
            </div>
          </div>

          {/* 3D Model Viewer - FULL HEIGHT */}
          <div className="absolute inset-0 w-full h-full">
            <ModelViewer
              modelUrl={getModelUrl()}
              customizations={generateCustomizations()}
              layerControls={generateLayerControls()}
            />
          </div>

          {/* Bottom Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-600 shadow-lg">
              Drag to rotate • Scroll to zoom • Double-click to reset view
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        orderSummary={generateOrderSummary()}
      />
    </>
  )
}

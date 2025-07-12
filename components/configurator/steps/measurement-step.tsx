"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MeasurementStepProps {
  sizeType: "standard" | "custom"
  standardSize: string
  fitType: string
  customMeasurements: {
    neck: number
    chest: number
    stomach: number
    hip: number
    length: number
    shoulder: number
    sleeve: number
  }
  onUpdate: (updates: any) => void
}

const STANDARD_SIZES = [
  { id: "xs", name: "XS", chest: "34-36", neck: "14-14.5" },
  { id: "s", name: "S", chest: "36-38", neck: "15-15.5" },
  { id: "m", name: "M", chest: "38-40", neck: "15.5-16" },
  { id: "l", name: "L", chest: "40-42", neck: "16-16.5" },
  { id: "xl", name: "XL", chest: "42-44", neck: "17-17.5" },
  { id: "xxl", name: "XXL", chest: "44-46", neck: "18-18.5" },
]

const FIT_TYPES = [
  { id: "slim", name: "Slim Fit", description: "Tailored, close to body" },
  { id: "regular", name: "Regular Fit", description: "Classic, comfortable fit" },
  { id: "relaxed", name: "Relaxed Fit", description: "Loose, comfortable" },
]

export function MeasurementStep({
  sizeType,
  standardSize,
  fitType,
  customMeasurements,
  onUpdate,
}: MeasurementStepProps) {
  const updateCustomMeasurement = (field: string, value: number) => {
    onUpdate({
      customMeasurements: {
        ...customMeasurements,
        [field]: value,
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Size Type Selection */}
      <Tabs value={sizeType} onValueChange={(value) => onUpdate({ sizeType: value })}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="standard">Standard Sizes</TabsTrigger>
          <TabsTrigger value="custom">Custom Measurements</TabsTrigger>
        </TabsList>

        <TabsContent value="standard" className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>Standard Sizing:</strong> Choose from our pre-defined sizes based on chest and neck measurements.
            </p>
          </div>

          {/* Standard Size Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Your Size</h3>
            <RadioGroup
              value={standardSize}
              onValueChange={(value) => onUpdate({ standardSize: value })}
              className="grid grid-cols-2 md:grid-cols-3 gap-4"
            >
              {STANDARD_SIZES.map((size) => (
                <div key={size.id}>
                  <RadioGroupItem value={size.id} id={size.id} className="sr-only" />
                  <Label
                    htmlFor={size.id}
                    className={`
                      block cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-gray-50
                      ${standardSize === size.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                    `}
                  >
                    <div className="text-center">
                      <h4 className="text-xl font-bold text-gray-900">{size.name}</h4>
                      <p className="text-sm text-gray-600">Chest: {size.chest}"</p>
                      <p className="text-sm text-gray-600">Neck: {size.neck}"</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Fit Type Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Choose Fit Type</h3>
            <RadioGroup value={fitType} onValueChange={(value) => onUpdate({ fitType: value })} className="space-y-3">
              {FIT_TYPES.map((fit) => (
                <div key={fit.id}>
                  <RadioGroupItem value={fit.id} id={fit.id} className="sr-only" />
                  <Label
                    htmlFor={fit.id}
                    className={`
                      block cursor-pointer rounded-lg border-2 p-4 transition-all hover:bg-gray-50
                      ${fitType === fit.id ? "border-blue-500 bg-blue-50" : "border-gray-200"}
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium text-gray-900">{fit.name}</h4>
                        <p className="text-sm text-gray-600">{fit.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Custom Measurements:</strong> Enter your exact measurements for a perfect fit. Custom measurements
              add $25 to the total price.
            </p>
          </div>

          {/* Custom Measurements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { key: "neck", label: "Neck", unit: "inches" },
              { key: "chest", label: "Chest", unit: "inches" },
              { key: "stomach", label: "Stomach", unit: "inches" },
              { key: "hip", label: "Hip", unit: "inches" },
              { key: "length", label: "Length", unit: "inches" },
              { key: "shoulder", label: "Shoulder", unit: "inches" },
              { key: "sleeve", label: "Sleeve", unit: "inches" },
            ].map((measurement) => (
              <div key={measurement.key} className="space-y-2">
                <Label htmlFor={measurement.key} className="font-medium">
                  {measurement.label} ({measurement.unit})
                </Label>
                <Input
                  id={measurement.key}
                  type="number"
                  step="0.25"
                  min="0"
                  value={customMeasurements[measurement.key as keyof typeof customMeasurements] || ""}
                  onChange={(e) => updateCustomMeasurement(measurement.key, Number.parseFloat(e.target.value) || 0)}
                  placeholder="0.0"
                />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

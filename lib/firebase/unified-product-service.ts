import { SAMPLE_PRODUCTS, SAMPLE_CUSTOMIZATION_OPTIONS } from "@/data/sample-products"
import { getClothingTypes, type ClothingType } from "./clothing-type-service"
import type { Product } from "./product-service"

// Unified service that combines mock products with admin-created clothing types
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Get mock products (always available)
    const mockProducts = SAMPLE_PRODUCTS

    // Get admin-created clothing types (if Firebase is connected)
    let adminProducts: Product[] = []
    try {
      const clothingTypes = await getClothingTypes()

      // Convert clothing types to products
      adminProducts = clothingTypes
        .filter((ct) => ct.isActive)
        .map((clothingType) => ({
          id: clothingType.id,
          name: clothingType.name,
          description: clothingType.description,
          price: clothingType.basePrice,
          category: clothingType.category,
          imageUrl: clothingType.thumbnailUrl || "/placeholder.svg?height=400&width=300",
          available: clothingType.isActive,
          customizable: true,
          modelId: clothingType.id,
          fabricOptions: extractFabricOptions(clothingType),
          styleOptions: extractStyleOptions(clothingType),
          measurementFields: ["chest", "waist", "shoulder", "sleeve"], // Default fields
          createdAt: clothingType.createdAt,
          updatedAt: clothingType.updatedAt,
        }))
    } catch (error) {
      console.log("Firebase not connected, using mock products only")
    }

    // Combine both mock and admin products
    return [...mockProducts, ...adminProducts]
  } catch (error) {
    console.error("Error getting all products:", error)
    // Fallback to mock products only
    return SAMPLE_PRODUCTS
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    // Check if it's a mock product first
    const mockProduct = SAMPLE_PRODUCTS.find((p) => p.id === id)
    if (mockProduct) {
      return mockProduct
    }

    // Check admin-created clothing types (if Firebase is connected)
    try {
      const clothingTypes = await getClothingTypes()
      const clothingType = clothingTypes.find((ct) => ct.id === id)

      if (clothingType) {
        return {
          id: clothingType.id,
          name: clothingType.name,
          description: clothingType.description,
          price: clothingType.basePrice,
          category: clothingType.category,
          imageUrl: clothingType.thumbnailUrl || "/placeholder.svg?height=400&width=300",
          available: clothingType.isActive,
          customizable: true,
          modelId: clothingType.id,
          fabricOptions: extractFabricOptions(clothingType),
          styleOptions: extractStyleOptions(clothingType),
          measurementFields: ["chest", "waist", "shoulder", "sleeve"],
          createdAt: clothingType.createdAt,
          updatedAt: clothingType.updatedAt,
        }
      }
    } catch (error) {
      console.log("Firebase not connected for product lookup")
    }

    return null
  } catch (error) {
    console.error(`Error getting product ${id}:`, error)
    return null
  }
}

export async function getCustomizationOptions(productId: string) {
  try {
    // Check if it's a mock product first - THIS IS THE KEY FIX
    const mockOptions = SAMPLE_CUSTOMIZATION_OPTIONS[productId]
    if (mockOptions) {
      console.log(`Found ${mockOptions.length} mock customization options for ${productId}`)
      return mockOptions
    }

    // Get from admin-created clothing type (if Firebase is connected)
    try {
      const clothingTypes = await getClothingTypes()
      const clothingType = clothingTypes.find((ct) => ct.id === productId)

      if (clothingType) {
        return convertClothingTypeToOptions(clothingType)
      }
    } catch (error) {
      console.log("Firebase not connected for customization options")
    }

    console.log(`No customization options found for product ${productId}`)
    return []
  } catch (error) {
    console.error(`Error getting customization options for ${productId}:`, error)
    return []
  }
}

// Helper functions
function extractFabricOptions(clothingType: ClothingType): string[] {
  const fabricStep = clothingType.customizationSteps.find((step) => step.type === "fabric")
  return fabricStep?.options.map((opt) => opt.id) || ["cotton", "linen"]
}

function extractStyleOptions(clothingType: ClothingType): string[] {
  const styleStep = clothingType.customizationSteps.find((step) => step.type === "style")
  return styleStep?.options.map((opt) => opt.id) || ["classic", "modern"]
}

function convertClothingTypeToOptions(clothingType: ClothingType) {
  return clothingType.customizationSteps.map((step) => ({
    id: `${clothingType.id}-${step.type}`,
    name: step.title,
    type: step.type as "color" | "texture" | "component",
    category: step.type === "fabric" ? "fabric" : "style",
    values: step.options.map((option) => ({
      id: option.id,
      name: option.name,
      value: option.color || option.materialMapping || option.id,
      price: option.price,
      thumbnail: option.image,
      ...(option.color && { color: option.color }),
      ...(option.materialMapping && {
        layerControls: {
          show: [option.materialMapping],
          hide: [],
        },
      }),
    })),
  }))
}

// Status check function
export function getSystemStatus() {
  const mockCustomizationCount = Object.keys(SAMPLE_CUSTOMIZATION_OPTIONS).length
  const totalMockOptions = Object.values(SAMPLE_CUSTOMIZATION_OPTIONS).reduce(
    (total, options) => total + options.length,
    0,
  )

  return {
    mockProducts: SAMPLE_PRODUCTS.length,
    mockProductsActive: SAMPLE_PRODUCTS.filter((p) => p.available).length,
    mockCustomizations: mockCustomizationCount,
    totalMockOptions: totalMockOptions,
    mockCategories: [...new Set(SAMPLE_PRODUCTS.map((p) => p.category))],
    customizationStatus: {
      "shirt-001": SAMPLE_CUSTOMIZATION_OPTIONS["shirt-001"]?.length || 0,
      "pants-001": SAMPLE_CUSTOMIZATION_OPTIONS["pants-001"]?.length || 0,
      "jacket-001": SAMPLE_CUSTOMIZATION_OPTIONS["jacket-001"]?.length || 0,
    },
  }
}

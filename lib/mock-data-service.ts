import { SAMPLE_PRODUCTS } from "@/data/sample-products"
import { defaultFabrics } from "@/data/default-options"
import type { Product } from "@/lib/firebase/product-service"

// Mock data for different collections
export const MOCK_DATA = {
  products: SAMPLE_PRODUCTS,
  fabrics: defaultFabrics,
  styles: [
    {
      id: "classic-collar",
      name: "Classic Collar",
      description: "Traditional point collar",
      category: "collar",
      priceAdjustment: 0,
      thumbnailUrl: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "button-down-collar",
      name: "Button Down Collar",
      description: "Casual button-down style",
      category: "collar",
      priceAdjustment: 5,
      thumbnailUrl: "/placeholder.svg?height=100&width=200",
    },
    {
      id: "spread-collar",
      name: "Spread Collar",
      description: "Wide spread collar for formal wear",
      category: "collar",
      priceAdjustment: 10,
      thumbnailUrl: "/placeholder.svg?height=100&width=200",
    },
  ],
  models: [
    {
      id: "shirt-model-001",
      name: "Premium Shirt 3D Model",
      category: "shirt",
      description: "Complete 3D model with all customizable components",
      modelUrl: "/assets/3d/duck.glb",
      thumbnailUrl: "/placeholder.svg?height=200&width=200",
      basePrice: 89.99,
      customizationOptions: [
        "shirt-fabric-color",
        "shirt-fabric-type",
        "shirt-collar-style",
        "shirt-button-style",
        "shirt-cuff-style",
        "shirt-back-style",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "pants-model-001",
      name: "Premium Chinos 3D Model",
      category: "pants",
      description: "Complete 3D model with all customizable components",
      modelUrl: "/assets/3d/duck.glb",
      thumbnailUrl: "/placeholder.svg?height=200&width=200",
      basePrice: 79.99,
      customizationOptions: ["pants-fabric-color", "pants-fabric-type", "pants-pocket-style", "pants-cuff-style"],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "jacket-model-001",
      name: "Premium Blazer 3D Model",
      category: "jacket",
      description: "Complete 3D model with all customizable components",
      modelUrl: "/assets/3d/duck.glb",
      thumbnailUrl: "/placeholder.svg?height=200&width=200",
      basePrice: 199.99,
      customizationOptions: [
        "jacket-fabric-color",
        "jacket-fabric-type",
        "jacket-lapel-style",
        "jacket-button-style",
        "jacket-pocket-style",
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  orders: [
    {
      id: "order-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      status: "processing",
      total: 189.99,
      items: [
        {
          productId: "shirt-001",
          productName: "Premium Custom Shirt",
          quantity: 1,
          price: 89.99,
          customizations: {
            fabric: "cotton-white",
            collar: "classic-collar",
            cuffs: "barrel-cuffs",
          },
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
  customers: [
    {
      id: "customer-001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1-555-0123",
      totalOrders: 3,
      totalSpent: 567.97,
      createdAt: new Date(),
      lastOrderDate: new Date(),
    },
    {
      id: "customer-002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1-555-0456",
      totalOrders: 1,
      totalSpent: 199.99,
      createdAt: new Date(),
      lastOrderDate: new Date(),
    },
  ],
}

// Mock service functions that simulate Firebase operations
export class MockDataService {
  static async getProducts(category?: string): Promise<Product[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let products = [...MOCK_DATA.products]
    if (category) {
      products = products.filter(p => p.category === category)
    }
    return products
  }

  static async getProductById(id: string): Promise<Product | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return MOCK_DATA.products.find(p => p.id === id) || null
  }

  static async getFabrics(category?: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let fabrics = [...MOCK_DATA.fabrics]
    if (category) {
      fabrics = fabrics.filter(f => f.category === category)
    }
    return fabrics
  }

  static async getOrders() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return [...MOCK_DATA.orders]
  }

  static async getCustomers() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return [...MOCK_DATA.customers]
  }

  static async getStyles(category?: string) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    let styles = [...MOCK_DATA.styles]
    if (category) {
      styles = styles.filter(s => s.category === category)
    }
    return styles
  }

  static async getModels() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return [...MOCK_DATA.models]
  }
}

export default MockDataService

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SAMPLE_PRODUCTS, SAMPLE_CUSTOMIZATION_OPTIONS } from "@/data/sample-products"
import { MOCK_DATA, MockDataService } from "@/lib/mock-data-service"
import { getSystemStatus } from "@/lib/firebase/unified-product-service"
import { CheckCircle, Package, Palette, Shirt, ShoppingBag, Info } from "lucide-react"
import Link from "next/link"

export default function DemoPage() {
  const [systemStatus, setSystemStatus] = useState<any>(null)
  const [mockProducts, setMockProducts] = useState<any[]>([])
  const [mockFabrics, setMockFabrics] = useState<any[]>([])

  useEffect(() => {
    // Get system status
    const status = getSystemStatus()
    setSystemStatus(status)

    // Load mock data
    const loadMockData = async () => {
      try {
        const products = await MockDataService.getProducts()
        const fabrics = await MockDataService.getFabrics()
        setMockProducts(products)
        setMockFabrics(fabrics)
      } catch (error) {
        console.error("Error loading mock data:", error)
      }
    }

    loadMockData()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Demo Mode - Sample Data</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            This application is running in demo mode with sample data. Firebase is not connected, so all data shown here is from mock/sample datasets.
          </p>
        </div>

        {/* Status Alert */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle className="text-blue-800">Demo Mode Active</AlertTitle>
          <AlertDescription className="text-blue-700">
            Firebase is not configured. The app is using sample data for demonstration purposes. 
            All customization options and products shown are sample data.
          </AlertDescription>
        </Alert>

        <div className="grid gap-8">
          {/* System Status Card */}
          {systemStatus && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  System Status
                </CardTitle>
                <CardDescription>
                  Overview of available sample data in demo mode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{systemStatus.mockProducts}</div>
                    <div className="text-sm text-gray-600">Sample Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{systemStatus.mockProductsActive}</div>
                    <div className="text-sm text-gray-600">Available Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{systemStatus.mockCustomizations}</div>
                    <div className="text-sm text-gray-600">Product Types</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{systemStatus.totalMockOptions}</div>
                    <div className="text-sm text-gray-600">Customization Options</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Available Categories:</h4>
                  <div className="flex flex-wrap gap-2">
                    {systemStatus.mockCategories.map((category: string) => (
                      <Badge key={category} variant="outline" className="capitalize">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-3">Customization Options per Product:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(systemStatus.customizationStatus).map(([productId, count]) => (
                      <div key={productId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{productId}</span>
                        <Badge variant="secondary">{count as number} options</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sample Products Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shirt className="h-5 w-5" />
                Sample Products ({SAMPLE_PRODUCTS.length})
              </CardTitle>
              <CardDescription>
                These are the demo products available for customization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {SAMPLE_PRODUCTS.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="capitalize">{product.category}</Badge>
                        <Badge variant="secondary">${product.price}</Badge>
                        {product.customizable && <Badge className="bg-green-100 text-green-700">Customizable</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/product/${product.id}`}>
                          View Product
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mock Data Overview */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Sample Fabrics ({mockFabrics.length})
                </CardTitle>
                <CardDescription>
                  Available fabric options in demo mode
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2 max-h-64 overflow-y-auto">
                  {mockFabrics.slice(0, 10).map((fabric) => (
                    <div key={fabric.id} className="flex justify-between items-center p-2 border rounded">
                      <span className="text-sm font-medium">{fabric.name}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{fabric.category}</Badge>
                        <span className="text-xs text-gray-500">${fabric.pricePerYard}/yard</span>
                      </div>
                    </div>
                  ))}
                  {mockFabrics.length > 10 && (
                    <div className="text-center text-sm text-gray-500 py-2">
                      ... and {mockFabrics.length - 10} more fabrics
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Mock Collections
                </CardTitle>
                <CardDescription>
                  Overview of all sample data collections
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Products</span>
                    <Badge variant="secondary">{MOCK_DATA.products.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Fabrics</span>
                    <Badge variant="secondary">{MOCK_DATA.fabrics.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Styles</span>
                    <Badge variant="secondary">{MOCK_DATA.styles.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">3D Models</span>
                    <Badge variant="secondary">{MOCK_DATA.models.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sample Orders</span>
                    <Badge variant="secondary">{MOCK_DATA.orders.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Sample Customers</span>
                    <Badge variant="secondary">{MOCK_DATA.customers.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Try the Demo
              </CardTitle>
              <CardDescription>
                Explore the application features with sample data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button asChild>
                  <Link href="/">
                    View Product Catalog
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/product/shirt-001">
                    Customize Shirt
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/product/pants-001">
                    Customize Pants
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/product/jacket-001">
                    Customize Jacket
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/admin/debug">
                    Firebase Debug
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

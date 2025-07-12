"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Lock, ShoppingCart, User, MapPin, Phone, Mail, Calendar, Shield } from "lucide-react"

interface OrderSummary {
  productName: string
  basePrice: number
  customizations: Array<{
    category: string
    value: string
    price: number
  }>
  measurementData: {
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
  totalPrice: number
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  orderSummary: OrderSummary
}

export function CheckoutModal({ isOpen, onClose, orderSummary }: CheckoutModalProps) {
  const [currentTab, setCurrentTab] = useState("summary")
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentInfoChange = (field: string, value: string) => {
    setPaymentInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Here you would integrate with your payment processor
    console.log("Order placed:", {
      orderSummary,
      customerInfo,
      paymentInfo: { ...paymentInfo, cardNumber: "****" + paymentInfo.cardNumber.slice(-4) },
    })

    alert("Order placed successfully! You will receive a confirmation email shortly.")
    setIsProcessing(false)
    onClose()
  }

  const isFormValid = () => {
    const customerValid =
      customerInfo.firstName &&
      customerInfo.lastName &&
      customerInfo.email &&
      customerInfo.address &&
      customerInfo.city &&
      customerInfo.zipCode
    const paymentValid =
      paymentInfo.cardNumber.length >= 16 && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.nameOnCard
    return customerValid && paymentValid
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Complete Your Order
          </DialogTitle>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Order Summary</TabsTrigger>
            <TabsTrigger value="customer">Customer Info</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  {orderSummary.productName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Base Price */}
                <div className="flex justify-between items-center">
                  <span className="font-medium">Base Price</span>
                  <span>${orderSummary.basePrice.toFixed(2)}</span>
                </div>

                <Separator />

                {/* Customizations */}
                <div>
                  <h4 className="font-medium mb-3">Customizations</h4>
                  <div className="space-y-2">
                    {orderSummary.customizations.map((custom, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div>
                          <span className="text-gray-600">{custom.category}:</span>
                          <span className="ml-2 font-medium">{custom.value}</span>
                        </div>
                        {custom.price > 0 && <span className="text-green-600">+${custom.price.toFixed(2)}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Measurements */}
                <div>
                  <h4 className="font-medium mb-3">Measurements</h4>
                  {orderSummary.measurementData.sizeType === "standard" ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Standard Size</Badge>
                        <span className="font-medium">{orderSummary.measurementData.standardSize?.toUpperCase()}</span>
                      </div>
                      <div className="text-sm text-gray-600">Fit: {orderSummary.measurementData.fitType}</div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Custom Measurements</Badge>
                        <span className="text-green-600 text-sm">+$25.00</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(orderSummary.measurementData.customMeasurements || {}).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 capitalize">{key}:</span>
                            <span>{value}"</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Total */}
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total</span>
                  <span className="text-green-600">${orderSummary.totalPrice.toFixed(2)}</span>
                </div>

                <div className="text-sm text-gray-600">
                  <p>• Estimated delivery: 2-3 weeks</p>
                  <p>• Free shipping on orders over $200</p>
                  <p>• 30-day return policy</p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={() => setCurrentTab("customer")}>Continue to Customer Info</Button>
            </div>
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={customerInfo.firstName}
                      onChange={(e) => handleCustomerInfoChange("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={customerInfo.lastName}
                      onChange={(e) => handleCustomerInfoChange("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={customerInfo.email}
                        onChange={(e) => handleCustomerInfoChange("email", e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        className="pl-10"
                        value={customerInfo.phone}
                        onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      className="pl-10"
                      value={customerInfo.address}
                      onChange={(e) => handleCustomerInfoChange("address", e.target.value)}
                      placeholder="123 Main Street"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={customerInfo.city}
                      onChange={(e) => handleCustomerInfoChange("city", e.target.value)}
                      placeholder="New York"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={customerInfo.state}
                      onChange={(e) => handleCustomerInfoChange("state", e.target.value)}
                      placeholder="NY"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={customerInfo.zipCode}
                      onChange={(e) => handleCustomerInfoChange("zipCode", e.target.value)}
                      placeholder="10001"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("summary")}>
                Back to Summary
              </Button>
              <Button onClick={() => setCurrentTab("payment")}>Continue to Payment</Button>
            </div>
          </TabsContent>

          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">Your payment information is secure and encrypted</span>
                </div>

                <div>
                  <Label htmlFor="nameOnCard">Name on Card *</Label>
                  <Input
                    id="nameOnCard"
                    value={paymentInfo.nameOnCard}
                    onChange={(e) => handlePaymentInfoChange("nameOnCard", e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="cardNumber">Card Number *</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="cardNumber"
                      className="pl-10"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => handlePaymentInfoChange("cardNumber", e.target.value.replace(/\s/g, ""))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={16}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="expiryDate"
                        className="pl-10"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => handlePaymentInfoChange("expiryDate", e.target.value)}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="cvv"
                        className="pl-10"
                        value={paymentInfo.cvv}
                        onChange={(e) => handlePaymentInfoChange("cvv", e.target.value)}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary in Payment Tab */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Order Total</h4>
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>{orderSummary.productName}</span>
                    <span>${orderSummary.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentTab("customer")}>
                Back to Customer Info
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={!isFormValid() || isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Place Order - ${orderSummary.totalPrice.toFixed(2)}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

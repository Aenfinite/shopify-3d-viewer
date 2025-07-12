"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase/firebase-config"
import { collection, getDocs, limit, query } from "firebase/firestore"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export function FirebaseStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkConnection() {
      try {
        // Check if Firebase is initialized
        if (!db) {
          setStatus("error")
          setError("Firebase is not configured or initialized. Using sample data only.")
          return
        }

        // Try to fetch a single document from any collection
        const testQuery = query(collection(db, "fabrics"), limit(1))
        await getDocs(testQuery)
        setStatus("connected")
      } catch (err) {
        console.error("Firebase connection error:", err)
        setStatus("error")
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    checkConnection()
  }, [])

  if (status === "loading") {
    return (
      <Alert className="bg-yellow-50 border-yellow-200">
        <AlertTitle className="flex items-center gap-2">
          <span className="animate-spin">⟳</span> Checking Firebase Connection
        </AlertTitle>
        <AlertDescription>Verifying connection to Firebase...</AlertDescription>
      </Alert>
    )
  }

  if (status === "error") {
    return (
      <Alert className="bg-red-50 border-red-200">
        <AlertTitle className="flex items-center gap-2 text-red-600">
          <XCircle className="h-4 w-4" /> Firebase Connection Error
        </AlertTitle>      <AlertDescription>
        {error || "Could not connect to Firebase. The app is running in demo mode with sample data."}
        <br />
        <small className="text-gray-500 mt-2 block">
          To use Firebase, configure your environment variables in .env.local
        </small>
      </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="bg-green-50 border-green-200">
      <AlertTitle className="flex items-center gap-2 text-green-600">
        <CheckCircle className="h-4 w-4" /> Firebase Connected
      </AlertTitle>
      <AlertDescription>
        Successfully connected to Firebase project: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      </AlertDescription>
    </Alert>
  )
}

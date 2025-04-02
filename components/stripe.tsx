"use client"

import type React from "react"
import { Elements } from "@stripe/react-stripe-js"
import type { Stripe as StripeType } from "@stripe/stripe-js"

// Mock Stripe for demo purposes
const stripePromise = Promise.resolve({} as StripeType)

export function Stripe({ children }: { children: React.ReactNode }) {
  return <Elements stripe={stripePromise}>{children}</Elements>
}


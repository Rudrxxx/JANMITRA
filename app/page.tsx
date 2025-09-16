"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { InteractiveMap } from "@/components/interactive-map"
import { ReportModal } from "@/components/report-modal"
import { LiveFeed } from "@/components/live-feed"
import Image from "next/image"

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<"pending" | "granted" | "denied">("pending")

  useEffect(() => {
    const requestLocation = async () => {
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000, // 5 minutes
            })
          })

          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLocationPermission("granted")
          console.log("[v0] User location obtained:", { lat: latitude, lng: longitude })
        } catch (error) {
          console.log("[v0] Location permission denied or error:", error)
          setLocationPermission("denied")
          // Fallback to default location (Pune)
          setUserLocation({ lat: 18.5204, lng: 73.8567 })
        }
      } else {
        console.log("[v0] Geolocation not supported")
        setLocationPermission("denied")
        setUserLocation({ lat: 18.5204, lng: 73.8567 })
      }
    }

    requestLocation()
  }, [])

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })
    setIsModalOpen(true)
  }

  const handleReportSubmit = (reportData: any) => {
    console.log("Report submitted:", reportData)
    setIsModalOpen(false)
    setSelectedLocation(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative bg-primary p-6">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/hero-background.jpg"
            alt="Urban infrastructure background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Navbar */}
        <nav className="relative flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white/10 backdrop-blur-sm border-4 border-white">
              <Image src="/images/app-icon.jpg" alt="JanMITRA app icon" fill className="object-cover rounded-full" />
            </div>
            <div className="chunky-font text-4xl text-white">JanMITRA</div>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 neobrutalist-shadow font-bold text-lg px-8 py-3 border-4 border-foreground"
          >
            Report an Issue 🚨
          </Button>
        </nav>

        {/* Main Hero Content */}
        <div className="relative max-w-7xl mx-auto mt-12 text-center">
          <h1 className="chunky-font text-6xl md:text-8xl text-white mb-6 text-balance">
            Your City. Your Voice. Spill the Tea. 🗣️
          </h1>
          <p className="text-xl md:text-2xl text-white mb-12 max-w-4xl mx-auto text-pretty">
            Spot a problem? Snap it, map it, and get it fixed. Let's make 'em listen.
          </p>

          {locationPermission === "pending" && (
            <div className="bg-yellow-500 text-black p-4 rounded border-4 border-black neobrutalist-shadow max-w-md mx-auto">
              <p className="font-bold">📍 Requesting your location to center the map...</p>
            </div>
          )}
          {locationPermission === "denied" && (
            <div className="bg-orange-500 text-black p-4 rounded border-4 border-black neobrutalist-shadow max-w-md mx-auto">
              <p className="font-bold">⚠️ Location access denied. Using default location (Pune).</p>
            </div>
          )}
          {locationPermission === "granted" && (
            <div className="bg-green-500 text-black p-4 rounded border-4 border-black neobrutalist-shadow max-w-md mx-auto">
              <p className="font-bold">✅ Map centered on your location!</p>
            </div>
          )}
        </div>
      </header>

      {/* Interactive Map Section */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="chunky-font text-4xl text-center mb-8 text-foreground">Click the Map to Report 📍</h2>
          <div className="neobrutalist-border neobrutalist-shadow-purple">
            <InteractiveMap onMapClick={handleMapClick} userLocation={userLocation} />
          </div>
        </div>
      </section>

      {/* Live Feed Section */}
      <section className="py-12 px-6 bg-muted">
        <div className="max-w-7xl mx-auto">
          <h2 className="chunky-font text-4xl text-center mb-8 text-muted-foreground">The Wall of Shame & Fame</h2>
          <h3 className="text-2xl text-center mb-8 text-muted-foreground">Freshly Spotted 👀</h3>
          <LiveFeed />
        </div>
      </section>

      {/* Report Modal */}
      <ReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReportSubmit}
        selectedLocation={selectedLocation}
      />
    </div>
  )
}

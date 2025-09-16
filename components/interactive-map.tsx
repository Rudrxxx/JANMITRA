"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"

interface InteractiveMapProps {
  onMapClick: (lat: number, lng: number) => void
  userLocation?: { lat: number; lng: number } | null
}

// Mock data for existing reports
const mockReports = [
  { id: 1, lat: 18.5204, lng: 73.8567, type: "Pothole 🕳️", status: "REPORTED" },
  { id: 2, lat: 18.5304, lng: 73.8467, type: "Garbage Dump 🗑️", status: "IN PROGRESS" },
  { id: 3, lat: 18.5104, lng: 73.8667, type: "Broken Streetlight 💡", status: "FIXED!" },
]

export function InteractiveMap({ onMapClick, userLocation }: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 18.5204, lng: 73.8567 })

  useEffect(() => {
    if (userLocation) {
      setMapCenter(userLocation)
    }
  }, [userLocation])

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setClickPosition({ x, y })

    const lat = mapCenter.lat + (y - rect.height / 2) * 0.001
    const lng = mapCenter.lng + (x - rect.width / 2) * 0.001

    onMapClick(lat, lng)
  }

  return (
    <div
      className="relative w-full h-96 md:h-[500px] bg-gray-800 overflow-hidden cursor-crosshair"
      onClick={handleMapClick}
    >
      {/* Mock Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900">
        {/* Grid lines to simulate map */}
        <div className="absolute inset-0 opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute w-full h-px bg-white" style={{ top: `${i * 5}%` }} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute h-full w-px bg-white" style={{ left: `${i * 5}%` }} />
          ))}
        </div>

        {/* Mock roads */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-600 transform -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-2 h-full bg-gray-600 transform -translate-x-1/2"></div>
      </div>

      {userLocation && (
        <div
          className="absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: `${50 + (userLocation.lng - mapCenter.lng) * 1000}%`,
            top: `${50 + (userLocation.lat - mapCenter.lat) * 1000}%`,
          }}
        >
          <div className="w-full h-full bg-blue-500 border-4 border-white rounded-full flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      {/* Existing Report Markers */}
      {mockReports.map((report) => (
        <div
          key={report.id}
          className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${50 + (report.lng - mapCenter.lng) * 1000}%`,
            top: `${50 + (report.lat - mapCenter.lat) * 1000}%`,
          }}
        >
          <div
            className={`w-full h-full rounded-full border-4 border-white flex items-center justify-center text-xs font-bold ${
              report.status === "REPORTED"
                ? "bg-yellow-500 text-black"
                : report.status === "IN PROGRESS"
                  ? "bg-blue-500 text-white"
                  : "bg-green-500 text-white"
            }`}
            style={{
              textShadow:
                "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {report.type.split(" ")[1]}
          </div>
        </div>
      ))}

      {/* Click indicator */}
      {clickPosition && (
        <div
          className="absolute w-4 h-4 bg-secondary border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: clickPosition.x,
            top: clickPosition.y,
          }}
        />
      )}

      {/* Map Instructions */}
      <div className="absolute bottom-4 left-4 bg-black/80 text-white p-3 rounded border-2 border-secondary">
        <p className="text-sm font-bold">Click anywhere to report an issue! 🎯</p>
        {userLocation && <p className="text-xs text-blue-300 mt-1">📍 Centered on your location</p>}
      </div>
    </div>
  )
}

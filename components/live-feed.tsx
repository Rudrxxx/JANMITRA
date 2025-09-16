"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for the live feed
const mockIssues = [
  {
    id: 1,
    image: "/pothole-on-road.jpg",
    type: "Pothole 🕳️",
    location: "Near DY Patil University",
    status: "REPORTED",
    timestamp: "2 hours ago",
  },
  {
    id: 2,
    image: null, // Set to null to trigger icon display
    type: "Garbage Dump 🗑️",
    location: "Hinjewadi Phase 1",
    status: "IN PROGRESS",
    timestamp: "4 hours ago",
  },
  {
    id: 3,
    image: "/broken-streetlight-night.png",
    type: "Broken Streetlight 💡",
    location: "Baner Main Road",
    status: "FIXED!",
    timestamp: "1 day ago",
  },
  {
    id: 4,
    image: null, // Set to null to trigger icon display
    type: "Other 🫠",
    location: "Wakad Circle",
    status: "REPORTED",
    timestamp: "3 hours ago",
  },
  {
    id: 5,
    image: "/overflowing-drain.jpg",
    type: "Other 🫠",
    location: "Aundh IT Park",
    status: "IN PROGRESS",
    timestamp: "6 hours ago",
  },
  {
    id: 6,
    image: "/fixed-pothole-with-fresh-asphalt.jpg",
    type: "Pothole 🕳️",
    location: "Magarpatta City",
    status: "FIXED!",
    timestamp: "2 days ago",
  },
]

export function LiveFeed() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "REPORTED":
        return <Badge className="bg-yellow-500 text-black font-bold border-2 border-black">REPORTED 🟡</Badge>
      case "IN PROGRESS":
        return <Badge className="bg-blue-500 text-white font-bold border-2 border-black">IN PROGRESS 🔵</Badge>
      case "FIXED!":
        return <Badge className="bg-green-500 text-black font-bold border-2 border-black">FIXED! ✅</Badge>
      default:
        return <Badge className="bg-gray-500 text-white font-bold border-2 border-black">{status}</Badge>
    }
  }

  const getIssueIcon = (type: string) => {
    if (type.includes("Pothole")) return "🕳️"
    if (type.includes("Garbage")) return "🗑️"
    if (type.includes("Streetlight")) return "💡"
    return "🫠"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockIssues.map((issue) => (
        <Card
          key={issue.id}
          className="bg-card border-4 border-primary neobrutalist-shadow-purple hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
        >
          <CardContent className="p-0">
            <div className="aspect-video relative overflow-hidden">
              {issue.image ? (
                <Image
                  src={issue.image || "/placeholder.svg"}
                  alt={`${issue.type} at ${issue.location}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-6xl opacity-80">{getIssueIcon(issue.type)}</div>
                </div>
              )}
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-card-foreground">{issue.type}</h3>
                {getStatusBadge(issue.status)}
              </div>
              <p className="text-card-foreground font-medium">📍 {issue.location}</p>
              <p className="text-sm text-muted-foreground">⏰ {issue.timestamp}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

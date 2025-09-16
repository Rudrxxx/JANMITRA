"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, ImageIcon, X } from "lucide-react"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  selectedLocation: { lat: number; lng: number } | null
}

const mockLeaders = [
  { id: 1, name: "Rajesh Kumar (MLA - Pune Central)", type: "MLA" },
  { id: 2, name: "Priya Sharma (MP - Pune)", type: "MP" },
  { id: 3, name: "Amit Patel (MLA - Kothrud)", type: "MLA" },
  { id: 4, name: "Sunita Desai (Corporator - Ward 15)", type: "Corporator" },
]

export function ReportModal({ isOpen, onClose, onSubmit, selectedLocation }: ReportModalProps) {
  const [formData, setFormData] = useState({
    image: null as File | null,
    issueType: "",
    description: "",
    taggedLeaders: [] as string[],
  })

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [leaderSearch, setLeaderSearch] = useState("")
  const [showLeaderDropdown, setShowLeaderDropdown] = useState(false)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      coordinates: selectedLocation,
      timestamp: new Date().toISOString(),
    })
    setFormData({ image: null, issueType: "", description: "", taggedLeaders: [] })
    setLeaderSearch("")
    setImagePreviewUrl(null)
    onClose() // Also close the modal on submit
  }

  const handleCameraCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const previewUrl = URL.createObjectURL(file)
      setImagePreviewUrl(previewUrl)
    }
  }

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }))
      const previewUrl = URL.createObjectURL(file)
      setImagePreviewUrl(previewUrl)
    }
  }

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }))
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(null)
    }
    if (cameraInputRef.current) cameraInputRef.current.value = ""
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const filteredLeaders = mockLeaders.filter(
    (leader) =>
      leader.name.toLowerCase().includes(leaderSearch.toLowerCase()) && !formData.taggedLeaders.includes(leader.name),
  )

  const addLeader = (leaderName: string) => {
    setFormData((prev) => ({
      ...prev,
      taggedLeaders: [...prev.taggedLeaders, leaderName],
    }))
    setLeaderSearch("")
    setShowLeaderDropdown(false)
  }

  const removeLeader = (leaderName: string) => {
    setFormData((prev) => ({
      ...prev,
      taggedLeaders: prev.taggedLeaders.filter((name) => name !== leaderName),
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-card border-4 border-secondary neobrutalist-shadow max-h-[90vh] overflow-y-auto">
        <CardHeader className="text-center">
          <CardTitle className="chunky-font text-3xl text-card-foreground">Drop the Deets 👇</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-lg font-bold text-white">Upload Evidence 📸</Label>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 border-4 border-foreground neobrutalist-shadow font-bold flex items-center gap-2"
                >
                  <Camera size={20} />
                  Take a Pic 📸
                </Button>
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 border-4 border-foreground neobrutalist-shadow font-bold flex items-center gap-2"
                >
                  <ImageIcon size={20} />
                  Gallery 🖼️
                </Button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />

              {formData.image && imagePreviewUrl && (
                <div className="mt-4 space-y-2">
                  <div className="relative aspect-video w-full border-4 border-secondary neobrutalist-shadow overflow-hidden">
                    <Image
                      src={imagePreviewUrl || "/placeholder.svg"}
                      alt="Selected image preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <Button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 p-1 h-auto w-auto border-2 border-white"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                  <p className="text-sm text-green-600 font-bold">✅ Image selected: {formData.image.name}</p>
                </div>
              )}
            </div>

            <div>
              <Label className="text-lg font-bold text-white">📍 Location Locked (Lat/Long)</Label>
              <Input
                value={
                  selectedLocation
                    ? `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`
                    : "Click on map to set location"
                }
                readOnly
                // FIX: Changed text-foreground to text-black for visibility on light background
                className="border-4 border-muted bg-gray-100 text-black font-mono text-sm"
              />
            </div>

            {/* Issue Type */}
            <div>
              <Label className="text-lg font-bold text-white">Issue Type</Label>
              <Select
                value={formData.issueType}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, issueType: value }))}
              >
                {/* FIX: Changed text-foreground to text-black for visibility on light background */}
                <SelectTrigger className="border-4 border-muted bg-input text-black">
                  <SelectValue placeholder="What's broken?" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-4 border-muted">
                  <SelectItem value="pothole">Pothole 🕳️</SelectItem>
                  <SelectItem value="garbage">Garbage Dump 🗑️</SelectItem>
                  <SelectItem value="streetlight">Broken Streetlight 💡</SelectItem>
                  <SelectItem value="other">Other 🫠</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div>
              <Label className="text-lg font-bold text-white">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="What's the tea? Describe the issue..."
                // FIX: Changed text-foreground to text-black for visibility on light background
                className="border-4 border-muted bg-input text-black min-h-[100px]"
              />
            </div>

            <div>
              <Label className="text-lg font-bold text-white">Tag Your Local Leaders 📣</Label>
              <div className="relative">
                <Input
                  value={leaderSearch}
                  onChange={(e) => {
                    setLeaderSearch(e.target.value)
                    setShowLeaderDropdown(true)
                  }}
                  onFocus={() => setShowLeaderDropdown(true)}
                  placeholder="Search for MLA, MP, Corporator..."
                  // FIX: Changed text-foreground to text-black for visibility on light background
                  className="border-4 border-muted bg-input text-black"
                />

                {/* Leader dropdown */}
                {showLeaderDropdown && filteredLeaders.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border-4 border-muted neobrutalist-shadow z-10 max-h-40 overflow-y-auto">
                    {filteredLeaders.map((leader) => (
                      <button
                        key={leader.id}
                        type="button"
                        onClick={() => addLeader(leader.name)}
                        className="w-full text-left p-3 hover:bg-secondary hover:text-secondary-foreground border-b border-muted last:border-b-0"
                      >
                        <div className="font-bold text-black">{leader.name}</div>
                        <div className="text-sm text-muted-foreground">{leader.type}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Tagged leaders display */}
              {formData.taggedLeaders.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-sm font-bold text-white">Tagged Leaders:</p>
                  {formData.taggedLeaders.map((leader, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-secondary/20 p-2 rounded border-2 border-secondary"
                    >
                      <span className="text-sm font-bold">{leader}</span>
                      <Button
                        type="button"
                        onClick={() => removeLeader(leader)}
                        className="bg-red-500 text-white hover:bg-red-600 text-xs px-2 py-1 h-auto"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-4 border-muted text-muted-foreground hover:bg-muted bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/90 neobrutalist-shadow font-bold text-lg border-4 border-foreground chunky-font"
              >
                YEET REPORT
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

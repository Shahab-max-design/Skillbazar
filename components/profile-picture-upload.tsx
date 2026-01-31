"use client"

import { useState, useRef } from "react"
import { Camera, Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useToast } from "@/hooks/use-toast"

interface ProfilePictureUploadProps {
    currentImage?: string
    onUploadComplete: (url: string) => void
}

// Cloudinary Configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

export function ProfilePictureUpload({ currentImage, onUploadComplete }: ProfilePictureUploadProps) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { toast } = useToast()

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validation
        const validTypes = ["image/png", "image/jpeg", "image/jpg"]
        if (!validTypes.includes(file.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image (PNG, JPG, or JPEG)",
                variant: "destructive"
            })
            return
        }

        // Preview
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        // Auto-upload
        await uploadToCloudinary(file)
    }

    const uploadToCloudinary = async (file: File) => {
        setIsUploading(true)
        console.log("Starting upload to Cloudinary...", { cloudName: CLOUD_NAME, preset: UPLOAD_PRESET })

        // Check if Cloudinary is configured
        if (!CLOUD_NAME || !UPLOAD_PRESET || CLOUD_NAME === "your_cloud_name") {
            console.warn("Cloudinary not configured properly. Falling back to local Data URL.")
            // Fallback: Convert to Data URL
            const reader = new FileReader()
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string
                onUploadComplete(dataUrl)
                setPreviewUrl(dataUrl)
                toast({
                    title: "Success",
                    description: "Profile picture updated (Local Storage - Cloudinary Config Missing)",
                })
                setIsUploading(false)
            }
            reader.readAsDataURL(file)
            return
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", UPLOAD_PRESET)

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            if (!response.ok) {
                const errorData = await response.json()
                console.error("Cloudinary Error:", errorData)
                throw new Error(errorData.error?.message || "Cloudinary upload failed")
            }

            const data = await response.json()
            console.log("Upload success:", data)
            const cloudinaryUrl = data.secure_url

            onUploadComplete(cloudinaryUrl)

            toast({
                title: "Success",
                description: "Profile picture uploaded to Cloudinary successfully",
            })
        } catch (error: any) {
            console.error("Upload error:", error)

            // On API failure, also fallback to Data URL so the user isn't stuck
            console.log("Attempting fallback to local Data URL after API failure...")
            const reader = new FileReader()
            reader.onload = (e) => {
                const dataUrl = e.target?.result as string
                onUploadComplete(dataUrl)
                toast({
                    title: "Success",
                    description: "Profile picture saved locally (API failed)",
                })
            }
            reader.readAsDataURL(file)
        } finally {
            setIsUploading(false)
        }
    }

    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/10 bg-muted flex items-center justify-center relative transition-all group-hover:border-primary/30">
                    {previewUrl ? (
                        <Image
                            src={previewUrl}
                            alt="Profile Preview"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <Camera className="w-12 h-12 text-muted-foreground" />
                    )}

                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Upload className="w-8 h-8 text-white" />
                    </div>

                    {isUploading && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 transition-all">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                </div>

                <button
                    className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-110 transition-transform active:scale-95"
                    aria-label="Upload Photo"
                    disabled={isUploading}
                >
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/jpg"
                onChange={handleFileChange}
            />

            <p className="text-xs text-muted-foreground text-center">
                JPG, PNG or JPEG. Max size 2MB.
            </p>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import { Download, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function PwaInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handler = (e: any) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault()
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e)
            setIsVisible(true)
        }

        window.addEventListener("beforeinstallprompt", handler)

        return () => {
            window.removeEventListener("beforeinstallprompt", handler)
        }
    }, [])

    const handleInstallClick = async () => {
        if (!deferredPrompt) return

        // Show the install prompt
        deferredPrompt.prompt()

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice
        console.log(`User response to the install prompt: ${outcome}`)

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null)
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300 sm:left-auto sm:right-4 sm:max-w-md">
            <div className="flex items-center justify-between rounded-xl bg-blue-600 p-4 text-white shadow-2xl">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                        <Download className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Install SkillBazar App</h3>
                        <p className="text-xs text-blue-100">Get a faster experience and offline access</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsVisible(false)}
                        className="h-8 w-8 rounded-full p-0 text-white hover:bg-white/10"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleInstallClick}
                        className="bg-white text-blue-600 hover:bg-white/90 font-medium px-4 h-8"
                    >
                        Install
                    </Button>
                </div>
            </div>
        </div>
    )
}

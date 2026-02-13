"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus, AlertCircle } from "lucide-react"

interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    message?: string
}

export function AuthModal({
    isOpen,
    onClose,
    message = "Please login or create an account to send a service request.",
}: AuthModalProps) {
    const router = useRouter()

    const handleLogin = () => {
        onClose()
        router.push("/auth/signin")
    }

    const handleSignup = () => {
        onClose()
        router.push("/auth/signup")
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <AlertCircle className="w-6 h-6" />
                        <DialogTitle className="text-xl">Authentication Required</DialogTitle>
                    </div>
                    <DialogDescription className="text-base text-foreground">
                        {message}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 flex flex-col gap-3">
                    <Button onClick={handleLogin} className="w-full h-11 text-base font-semibold" gap-2>
                        <LogIn className="w-5 h-5" />
                        Sign In
                    </Button>
                    <Button onClick={handleSignup} variant="outline" className="w-full h-11 text-base font-semibold" gap-2>
                        <UserPlus className="w-5 h-5" />
                        Create Account
                    </Button>
                </div>

                <DialogFooter className="sm:justify-center">
                    <p className="text-sm text-muted-foreground">
                        Join our community of verified professionals.
                    </p>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

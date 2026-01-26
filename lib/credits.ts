import { TechnicianSubscription } from "./data"

export interface CreditTransaction {
    id: string
    date: string
    amount: number
    type: "deduction" | "refund" | "purchase" | "bonus"
    reason: string
    jobId?: string
}

const STORAGE_KEY_TRANSACTIONS = "credit_transactions"
const JOB_COST = 2

export const getCreditHistory = (): CreditTransaction[] => {
    if (typeof window === "undefined") return []
    const history = localStorage.getItem(STORAGE_KEY_TRANSACTIONS)
    return history ? JSON.parse(history) : []
}

export const addTransaction = (transaction: Omit<CreditTransaction, "id" | "date">) => {
    if (typeof window === "undefined") return

    const history = getCreditHistory()
    const newTransaction: CreditTransaction = {
        ...transaction,
        id: Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
    }

    const updatedHistory = [newTransaction, ...history]
    localStorage.setItem(STORAGE_KEY_TRANSACTIONS, JSON.stringify(updatedHistory))
    return newTransaction
}

export const deductCreditsForJob = (jobId: string, currentCredits: number): { success: boolean, newBalance: number, error?: string } => {
    if (currentCredits < JOB_COST) {
        return { success: false, newBalance: currentCredits, error: `Insufficient credits. Need ${JOB_COST} credits to accept a job.` }
    }

    const newBalance = currentCredits - JOB_COST
    addTransaction({
        amount: -JOB_COST,
        type: "deduction",
        reason: "Job Accepted",
        jobId
    })

    return { success: true, newBalance }
}

export const refundCreditsForJob = (jobId: string, currentCredits: number): { success: boolean, newBalance: number } => {
    const newBalance = currentCredits + JOB_COST
    addTransaction({
        amount: JOB_COST, // Positive amount for refund
        type: "refund",
        reason: "Job Cancelled/Refunded",
        jobId
    })

    return { success: true, newBalance }
}

export const getJobCost = () => JOB_COST

export const canAcceptJob = (credits: number | "unlimited"): boolean => {
    if (credits === "unlimited") return true
    return credits >= JOB_COST
}

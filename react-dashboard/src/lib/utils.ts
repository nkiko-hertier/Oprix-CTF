import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimeAgoOrRemaining(timestamp: string): string {
  const now = new Date()
  const target = new Date(timestamp)
  const diffMs = target.getTime() - now.getTime() // future = positive, past = negative
  const diffSeconds = Math.floor(diffMs / 1000)
  const absSeconds = Math.abs(diffSeconds)

  // Less than a minute
  if (absSeconds < 60) return diffMs > 0 ? "just now" : "ended"

  const minutes = Math.floor(absSeconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  const suffix = diffMs > 0 ? "in" : "ago"

  if (years >= 1) return diffMs > 0 ? `in ${years} year${years > 1 ? "s" : ""}` : `${years} year${years > 1 ? "s" : ""} ${suffix}`
  if (months >= 1) return diffMs > 0 ? `in ${months} month${months > 1 ? "s" : ""}` : `${months} month${months > 1 ? "s" : ""} ${suffix}`
  if (days >= 1) return diffMs > 0 ? `in ${days} day${days > 1 ? "s" : ""}` : `${days} day${days > 1 ? "s" : ""} ${suffix}`
  if (hours >= 1) return diffMs > 0 ? `in ${hours} hour${hours > 1 ? "s" : ""}` : `${hours} hour${hours > 1 ? "s" : ""} ${suffix}`
  if (minutes >= 1) return diffMs > 0 ? `in ${minutes} minute${minutes > 1 ? "s" : ""}` : `${minutes} minute${minutes > 1 ? "s" : ""} ${suffix}`

  return "just now"
}


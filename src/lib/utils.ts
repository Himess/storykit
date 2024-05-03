import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { PILType, POLICY_TYPE } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function shortenAddress(address: string, length = 4): string {
  if (!address) {
    return ""
  }
  if (address.length < 2 * length + 2) {
    // Check if the address is too short to be shortened.
    return address
  }

  const start = address.substring(0, length + 2)
  const end = address.substring(address.length - length)
  return `${start}...${end}`
}

export function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return "" // or if (/\s+/.test(match)) for white spaces
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

export function getPolicyTypeByPILData(pilData: PILType) {
  const { derivativesAttribution, derivativesAllowed, commercialUse, commercialRevenueShare } = pilData

  if (derivativesAllowed && commercialUse) {
    if (derivativesAttribution) return POLICY_TYPE.FREE_ATTRIBUTION
    if (!derivativesAttribution && commercialRevenueShare !== 0) return POLICY_TYPE.PAID_NO_ATTRIBUTION
    if (!derivativesAttribution && commercialRevenueShare === 0) return POLICY_TYPE.OPEN_DOMAIN
  }

  if (!derivativesAllowed) {
    return POLICY_TYPE.NO_DERIVATIVE
  }

  // default
  return POLICY_TYPE.OPEN_DOMAIN
}
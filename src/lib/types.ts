import type { Timestamp } from "firebase/firestore"

export type Place = {
  id: string
  index: number
  name: string
  description: string
  pictures: string[]
  prize: string
  special_code: string
  season_id: string
  first_sightseeing_id: string | null
  is_redeemed: boolean
  valid: boolean
}

export type Sightseeing = {
  id: string
  user_id: string
  place_id: string
  creation: Timestamp
}

export type User = {
  id: string
  name: string
  creation: Timestamp
  device_fingerprint?: string
  ip_address?: string
  last_seen?: Timestamp
}

export type Season = {
  id: string
  start_date: Timestamp
  end_date: Timestamp
  name?: string
}

export type SeasonStatus = "not-started" | "active" | "expired"

export type PrizeStatus = "no-prize" | "pending" | "claimed"

import { IconType } from 'react-icons/lib'

export type UserRole = 'SKR' | 'PDR' | 'ADMIN' | undefined

export type TNavbarRoute = {
  icon?: IconType
  label: string
  path: string
}

export type ComboboxItem = {
  value: string
  label: string
}

export interface JobSkill {
  skills: {
    id: string
    name: string
  }[]
}

export interface Job {
  id: string
  created_at: string
  name: string
  description: string
  price: string
  province: string
  city_muni: string
  barangay: string
  job_skills: JobSkill[]
}

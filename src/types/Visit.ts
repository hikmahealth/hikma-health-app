import { LanguageString } from "./LanguageString";

export interface Visit {
  id: string
  patient_id: string
  clinic_id: string
  provider_id: string
  check_in_timestamp?: string
  provider_name?: LanguageString
}
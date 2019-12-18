import { LanguageString } from "./LanguageString";

export interface Patient {
  id: string
  given_name: LanguageString
  surname: LanguageString
  date_of_birth: string
  country: LanguageString
  hometown: LanguageString
  sex: string
  phone: string
}

export interface NewPatient {
  id: string
  given_name: string
  surname: string
  date_of_birth: string
  country: string
  hometown: string
  sex: string
  phone: string
}
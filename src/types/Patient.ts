import { StringContent } from "./StringContent";

export interface Patient {
  id: string
  given_name: StringContent
  surname: StringContent
  date_of_birth: string
  country: StringContent
  hometown: StringContent
  sex: string
  phone: string
}
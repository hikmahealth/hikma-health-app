import { LanguageString } from "./LanguageString";

export interface User {
  id: string
  name: LanguageString
  role: string
  email: string
}

export interface NewUser {
  id: string
  name: string
  role: string
  email: string
}
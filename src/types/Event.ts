export interface Event {
  id: string
  patient_id: string
  visit_id?: string
  event_type: string
  event_timestamp?: string
  event_metadata: string
  edited_at?: string
}
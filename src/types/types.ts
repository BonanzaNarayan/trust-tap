export interface Response {
  id: string
  clientName: string
  text: string
  rating: number
  url: string
  company?: string
  videoUrl?: string
  createdAt: Date
}

export interface FormData {
  title: string
  // Add other form fields as needed
}
export interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  rating: number;
  text: string;
  url: string;
  videoUrl?: string;
  createdAt: Date;
  userId: string;
  formId: string;
}

export interface TestimonialForm {
  id: string;
  userId: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface TestimonialStats {
  total: number;
  averageRating: number;
  recentCount: number;
}
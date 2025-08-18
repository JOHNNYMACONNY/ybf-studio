export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  features: string[];
  turnaround: string;
  popular?: boolean;
  category: 'mixing' | 'mastering' | 'bundle';
}

export interface BeatLicense {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  restrictions: string[];
}

export interface ServiceRequest {
  id: string;
  packageId: string;
  customerName: string;
  customerEmail: string;
  projectDescription: string;
  referenceTracks?: string[];
  specialRequirements?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  verified: boolean;
} 
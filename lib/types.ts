export type CarStatus = "available" | "sold" | "reserved";
export type CarCondition = "new" | "used";
export type FuelType = "Essence" | "Diesel" | "Hybride" | "Electrique";
export type TransmissionType = "Manuelle" | "Automatique";

export interface Car {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: FuelType;
  transmission: TransmissionType;
  color?: string | null;
  engine?: string | null;
  power?: number | null;
  doors: number;
  condition: CarCondition;
  status: CarStatus;
  description?: string | null;
  features: string[];
  images: string[];
  cover_image?: string | null;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  car_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  type: "buy" | "sell" | "exchange" | "info";
  status: "new" | "contacted" | "closed";
  source: string;
  created_at: string;
}

export interface Message {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  subject?: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Settings {
  key: string;
  value: Record<string, unknown>;
}

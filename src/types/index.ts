export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  distance: number;
  estimatedTime: number;
  optimizationScore: number;
  created_at: string;
}

export interface Vehicle {
  id: string;
  type: string;
  status: string;
  currentLocation: string;
  emissions: number;
  created_at: string;
}

export interface EmergencyService {
  id: string;
  type: string;
  priority: number;
  status: string;
  location: string;
  created_at: string;
}

export interface SustainabilityMetric {
  id: string;
  date: string;
  co2Saved: number;
  energyEfficiency: number;
  greenScore: number;
  created_at: string;
}
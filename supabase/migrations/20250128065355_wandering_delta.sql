/*
  # Initial Schema for Smart Transportation Platform

  1. New Tables
    - routes
      - id (uuid, primary key)
      - name (text)
      - start_point (text)
      - end_point (text)
      - distance (numeric)
      - estimated_time (integer)
      - optimization_score (numeric)
      - created_at (timestamptz)
    
    - vehicles
      - id (uuid, primary key)
      - type (text)
      - status (text)
      - current_location (text)
      - emissions (numeric)
      - created_at (timestamptz)
    
    - emergency_services
      - id (uuid, primary key)
      - type (text)
      - priority (integer)
      - status (text)
      - location (text)
      - created_at (timestamptz)
    
    - sustainability_metrics
      - id (uuid, primary key)
      - date (date)
      - co2_saved (numeric)
      - energy_efficiency (numeric)
      - green_score (numeric)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Routes Table
CREATE TABLE routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_point text NOT NULL,
  end_point text NOT NULL,
  distance numeric NOT NULL,
  estimated_time integer NOT NULL,
  optimization_score numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read routes"
  ON routes
  FOR SELECT
  TO authenticated
  USING (true);

-- Vehicles Table
CREATE TABLE vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  status text NOT NULL,
  current_location text NOT NULL,
  emissions numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read vehicles"
  ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

-- Emergency Services Table
CREATE TABLE emergency_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  priority integer NOT NULL,
  status text NOT NULL,
  location text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emergency_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read emergency services"
  ON emergency_services
  FOR SELECT
  TO authenticated
  USING (true);

-- Sustainability Metrics Table
CREATE TABLE sustainability_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  co2_saved numeric NOT NULL,
  energy_efficiency numeric NOT NULL,
  green_score numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE sustainability_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read sustainability metrics"
  ON sustainability_metrics
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample data
INSERT INTO routes (name, start_point, end_point, distance, estimated_time, optimization_score)
VALUES 
  ('Downtown Express', 'Central Station', 'Business District', 5.2, 15, 85),
  ('Airport Link', 'City Center', 'International Airport', 12.8, 35, 92),
  ('Harbor Route', 'South Port', 'North Marina', 8.4, 25, 78);

INSERT INTO vehicles (type, status, current_location, emissions)
VALUES
  ('Electric Bus', 'Active', 'Central Station', 0),
  ('Hybrid Van', 'Maintenance', 'Service Center', 12.5),
  ('Electric Taxi', 'Active', 'Airport', 0);

INSERT INTO emergency_services (type, priority, status, location)
VALUES
  ('Ambulance', 1, 'Responding', 'Downtown'),
  ('Fire Truck', 2, 'Available', 'North Station'),
  ('Police', 1, 'En Route', 'South District');

INSERT INTO sustainability_metrics (date, co2_saved, energy_efficiency, green_score)
VALUES
  ('2024-03-01', 125.5, 89.2, 92),
  ('2024-03-02', 132.8, 91.5, 94),
  ('2024-03-03', 128.3, 88.7, 90);
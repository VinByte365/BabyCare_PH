/**
 * BabyGuide PH — Emergency Data
 *
 * Philippine emergency hotlines, healthcare facility info,
 * and trigger criteria for the Emergency Alert Module.
 */

export interface EmergencyHotline {
  name: string;
  number: string;
  description: string;
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health_center';
  address: string;
  city: string;
  phone: string;
  is24Hour: boolean;
  hasEmergency: boolean;
  latitude?: number;
  longitude?: number;
}

export interface EmergencyStep {
  stepNumber: number;
  title: string;
  body: string;
}

export const EMERGENCY_HOTLINES: EmergencyHotline[] = [
  {
    name: 'National Emergency Hotline',
    number: '911',
    description: 'National emergency response — ambulance, fire, police.',
  },
  {
    name: 'NDRRMC',
    number: '911',
    description: 'National Disaster Risk Reduction & Management Council.',
  },
  {
    name: 'Philippine Red Cross',
    number: '143',
    description: 'Ambulance services, first aid, and disaster response.',
  },
  {
    name: 'DOH Emergency Hotline',
    number: '1555',
    description: 'Department of Health — medical emergency assistance.',
  },
  {
    name: 'Bureau of Fire Protection',
    number: '160',
    description: 'Fire and rescue services.',
  },
];

export const HEALTHCARE_FACILITIES: HealthcareFacility[] = [
  {
    id: 'pgh',
    name: 'Philippine General Hospital',
    type: 'hospital',
    address: 'Taft Avenue, Ermita',
    city: 'Manila',
    phone: '(632) 8554-8400',
    is24Hour: true,
    hasEmergency: true,
  },
  {
    id: 'st_lukes_qc',
    name: 'St. Luke\'s Medical Center - Quezon City',
    type: 'hospital',
    address: '279 E. Rodriguez Sr. Avenue',
    city: 'Quezon City',
    phone: '(632) 8723-0101',
    is24Hour: true,
    hasEmergency: true,
  },
  {
    id: 'makati_med',
    name: 'Makati Medical Center',
    type: 'hospital',
    address: '2 Amorsolo Street, Legazpi Village',
    city: 'Makati',
    phone: '(632) 8888-9999',
    is24Hour: true,
    hasEmergency: true,
  },
  {
    id: 'asian_hospital',
    name: 'Asian Hospital and Medical Center',
    type: 'hospital',
    address: '2205 Civic Drive, Filinvest City',
    city: 'Muntinlupa',
    phone: '(632) 8771-9000',
    is24Hour: true,
    hasEmergency: true,
  },
  {
    id: 'medical_city',
    name: 'The Medical City',
    type: 'hospital',
    address: 'Ortigas Avenue',
    city: 'Pasig',
    phone: '(632) 8988-1000',
    is24Hour: true,
    hasEmergency: true,
  },
];

export const EMERGENCY_FIRST_STEPS: EmergencyStep[] = [
  {
    stepNumber: 1,
    title: 'Stay Calm',
    body: 'Take a deep breath. Panic can make it harder to think clearly. You are not alone — help is available.',
  },
  {
    stepNumber: 2,
    title: 'Call for Help',
    body: 'Dial 911 for an ambulance or go to the nearest hospital emergency room. If someone is with you, send them to get help while you stay with the baby.',
  },
  {
    stepNumber: 3,
    title: 'Keep Baby Safe',
    body: 'Place the baby on a flat, firm surface on their back. Keep the airway clear. Do not shake the baby under any circumstances.',
  },
  {
    stepNumber: 4,
    title: 'Prepare Information',
    body: 'Be ready to tell the doctor: the baby\'s age, weight, symptoms, when symptoms started, any medications given, and whether the baby has any known allergies.',
  },
];

export function getEmergencyTriggerCriteria(): {
  emergencySymptoms: string[];
  urgentSymptoms: string[];
} {
  return {
    emergencySymptoms: [
      'difficult_breathing',
      'seizures',
      'bulging_fontanelle',
      'grunting',
      'flaring',
      'retractions',
      'green_vomit',
      'blood_in_stool',
      'unequal_pupils',
      'unconsciousness',
    ],
    urgentSymptoms: [
      'fever_high',
      'lethargy',
      'poor_feeding',
      'dehydration',
      'skin_blisters',
      'umbilical_redness',
      'abdominal_distension',
      'excessive_spitup',
      'stiffness',
      'floppiness',
    ],
  };
}

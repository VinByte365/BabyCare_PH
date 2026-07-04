/**
 * BabyGuide PH — Symptom Checker Engine
 *
 * Decision-tree symptom assessment engine with local disease database.
 * Cross-references selected symptoms against known newborn conditions
 * and returns severity-ranked differential assessments.
 */

// ── Types ──────────────────────────────────────────────

export type SymptomId = string;

export interface Symptom {
  id: SymptomId;
  label: string;
  category: 'general' | 'respiratory' | 'digestive' | 'skin' | 'neurological' | 'feeding';
}

export interface QuestionStep {
  id: string;
  title: string;
  subtitle: string;
  symptoms: Symptom[];
  allowMultiple: boolean;
}

export type SeverityLevel = 'emergency' | 'urgent' | 'moderate' | 'low';

export interface Disease {
  id: string;
  name: string;
  commonName?: string;
  description: string;
  severity: SeverityLevel;
  symptoms: SymptomId[];
  matchingThreshold: number; // 0-1, fraction of symptoms that must match
  recommendation: string;
  homeCare?: string;
  whenToSeekCare: string;
  emergencySigns?: string[];
}

export interface AssessmentResult {
  diseaseId: string;
  diseaseName: string;
  matchScore: number;
  severity: SeverityLevel;
  description: string;
  recommendation: string;
  homeCare?: string;
  whenToSeekCare: string;
  emergencySigns?: string[];
}

export interface CheckerSession {
  sessionId: string;
  selectedSymptoms: SymptomId[];
  bodyAreas: string[];
  startedAt: string;
  completedAt?: string;
  results?: AssessmentResult[];
  isEmergency: boolean;
}

// ── Symptom Database ───────────────────────────────────

export const SYMPTOMS: Symptom[] = [
  // General
  { id: 'fever_high', label: 'High fever (>38°C / 100.4°F)', category: 'general' },
  { id: 'fever_low', label: 'Low-grade fever (37.5-38°C)', category: 'general' },
  { id: 'lethargy', label: 'Unusually sleepy / difficult to wake', category: 'general' },
  { id: 'irritability', label: 'Excessive crying / irritability', category: 'general' },
  { id: 'poor_feeding', label: 'Poor feeding / not interested in milk', category: 'general' },
  { id: 'dehydration', label: 'Signs of dehydration (dry mouth, no tears, fewer wet diapers)', category: 'general' },
  { id: 'weight_loss', label: 'Weight loss or poor weight gain', category: 'general' },

  // Respiratory
  { id: 'cough', label: 'Cough', category: 'respiratory' },
  { id: 'difficult_breathing', label: 'Difficulty breathing / rapid breathing', category: 'respiratory' },
  { id: 'nasal_congestion', label: 'Stuffy or runny nose', category: 'respiratory' },
  { id: 'wheezing', label: 'Wheezing or noisy breathing', category: 'respiratory' },
  { id: 'grunting', label: 'Grunting with each breath', category: 'respiratory' },
  { id: 'flaring', label: 'Nostril flaring', category: 'respiratory' },
  { id: 'retractions', label: 'Chest retractions (pulling in between ribs)', category: 'respiratory' },

  // Digestive
  { id: 'vomiting', label: 'Vomiting (not just spit-up)', category: 'digestive' },
  { id: 'diarrhea', label: 'Diarrhea / frequent watery stools', category: 'digestive' },
  { id: 'constipation', label: 'Constipation / hard dry stools', category: 'digestive' },
  { id: 'blood_in_stool', label: 'Blood in stool', category: 'digestive' },
  { id: 'abdominal_distension', label: 'Swollen or hard belly', category: 'digestive' },
  { id: 'excessive_spitup', label: 'Forceful / projectile vomiting', category: 'digestive' },

  // Skin
  { id: 'rash', label: 'Rash / red spots on skin', category: 'skin' },
  { id: 'jaundice', label: 'Yellowing of skin or eyes (jaundice)', category: 'skin' },
  { id: 'skin_blisters', label: 'Blisters or pus-filled bumps', category: 'skin' },
  { id: 'umbilical_redness', label: 'Redness or discharge around umbilical cord', category: 'skin' },
  { id: 'skin_peeling', label: 'Excessive skin peeling', category: 'skin' },
  { id: 'bruising', label: 'Unexplained bruising or tiny red spots', category: 'skin' },

  // Neurological
  { id: 'seizures', label: 'Seizures / convulsions / jerking movements', category: 'neurological' },
  { id: 'stiffness', label: 'Stiff body / arching back', category: 'neurological' },
  { id: 'floppiness', label: 'Floppy / limp body tone', category: 'neurological' },
  { id: 'bulging_fontanelle', label: 'Bulging soft spot on head', category: 'neurological' },
  { id: 'unequal_pupils', label: 'Unequal pupil size', category: 'neurological' },

  // Feeding
  { id: 'not_waking_to_feed', label: 'Not waking to feed', category: 'feeding' },
  { id: 'vomiting_after_each_feed', label: 'Vomiting after every feed', category: 'feeding' },
  { id: 'green_vomit', label: 'Green or bile-stained vomit', category: 'feeding' },
  { id: 'feeding_difficulty', label: 'Difficulty latching / sucking', category: 'feeding' },
];

// ── Question Steps (decision tree) ─────────────────────

export const QUESTION_STEPS: QuestionStep[] = [
  {
    id: 'general',
    title: 'General Symptoms',
    subtitle: 'Select any general symptoms your baby is showing',
    allowMultiple: true,
    symptoms: SYMPTOMS.filter((s) => s.category === 'general'),
  },
  {
    id: 'respiratory',
    title: 'Breathing & Respiratory',
    subtitle: 'Any breathing or respiratory symptoms?',
    allowMultiple: true,
    symptoms: SYMPTOMS.filter((s) => s.category === 'respiratory'),
  },
  {
    id: 'digestive',
    title: 'Digestive & Feeding',
    subtitle: 'Any digestive or feeding concerns?',
    allowMultiple: true,
    symptoms: SYMPTOMS.filter((s) => s.category === 'digestive' || s.category === 'feeding'),
  },
  {
    id: 'skin',
    title: 'Skin & Appearance',
    subtitle: 'Any skin changes or visible symptoms?',
    allowMultiple: true,
    symptoms: SYMPTOMS.filter((s) => s.category === 'skin'),
  },
  {
    id: 'neurological',
    title: 'Movement & Alertness',
    subtitle: 'Any concerns with movement, alertness, or behavior?',
    allowMultiple: true,
    symptoms: SYMPTOMS.filter((s) => s.category === 'neurological'),
  },
];

// ── Disease Database ───────────────────────────────────

export const DISEASES: Disease[] = [
  {
    id: 'neonatal_sepsis',
    name: 'Neonatal Sepsis',
    description: 'A serious bacterial infection in the bloodstream that requires immediate medical attention.',
    severity: 'emergency',
    symptoms: ['fever_high', 'lethargy', 'poor_feeding', 'irritability', 'difficult_breathing', 'grunting', 'flaring', 'retractions'],
    matchingThreshold: 0.3,
    recommendation: 'Seek emergency medical care immediately. Neonatal sepsis requires immediate IV antibiotics and hospital monitoring.',
    whenToSeekCare: 'Immediately — go to the nearest emergency room or call an ambulance.',
    emergencySigns: ['Difficulty breathing', 'Unusually sleepy', 'Not feeding', 'High fever'],
  },
  {
    id: 'meningitis',
    name: 'Neonatal Meningitis',
    description: 'Inflammation of the membranes surrounding the brain and spinal cord, often caused by infection.',
    severity: 'emergency',
    symptoms: ['fever_high', 'lethargy', 'poor_feeding', 'seizures', 'bulging_fontanelle', 'stiffness', 'irritability', 'vomiting'],
    matchingThreshold: 0.3,
    recommendation: 'Seek emergency care immediately. Meningitis requires urgent diagnosis and IV antibiotic treatment.',
    whenToSeekCare: 'Immediately — go to the nearest emergency room.',
    emergencySigns: ['Bulging soft spot', 'Stiff body', 'Seizures', 'High fever with lethargy'],
  },
  {
    id: 'pneumonia',
    name: 'Neonatal Pneumonia',
    description: 'A lung infection causing inflammation in the air sacs, making breathing difficult.',
    severity: 'urgent',
    symptoms: ['cough', 'difficult_breathing', 'fever_high', 'poor_feeding', 'grunting', 'flaring', 'retractions', 'wheezing'],
    matchingThreshold: 0.3,
    recommendation: 'See a doctor urgently. Pneumonia in newborns typically requires hospitalization for monitoring and antibiotics.',
    homeCare: 'Keep baby warm and offer frequent small feeds. Monitor breathing closely.',
    whenToSeekCare: 'Within 24 hours, or immediately if breathing worsens.',
    emergencySigns: ['Blue lips or face', 'Grunting with each breath', 'Severe chest retractions'],
  },
  {
    id: 'bronchiolitis',
    name: 'Bronchiolitis / RSV',
    description: 'A common respiratory infection that causes inflammation of the small airways in the lungs.',
    severity: 'urgent',
    symptoms: ['cough', 'wheezing', 'difficult_breathing', 'nasal_congestion', 'poor_feeding', 'fever_low', 'irritability'],
    matchingThreshold: 0.35,
    recommendation: 'Consult a pediatrician promptly. Most cases can be managed at home with supportive care, but young infants may need hospital monitoring.',
    homeCare: 'Use saline drops and bulb suction for nasal congestion. Offer frequent small feeds. Monitor for signs of breathing difficulty.',
    whenToSeekCare: 'Within 24-48 hours. Go to ER if baby has trouble breathing or stops feeding.',
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    description: 'A bacterial infection in the urinary tract that can be serious in newborns.',
    severity: 'urgent',
    symptoms: ['fever_high', 'irritability', 'poor_feeding', 'vomiting', 'lethargy'],
    matchingThreshold: 0.4,
    recommendation: 'See a pediatrician within 24 hours. UTI in newborns requires urine testing and antibiotic treatment.',
    whenToSeekCare: 'Within 24 hours if fever persists or baby seems unwell.',
  },
  {
    id: 'jaundice_severe',
    name: 'Severe Jaundice (Hyperbilirubinemia)',
    description: 'High levels of bilirubin causing yellowing of the skin and eyes. Requires treatment to prevent brain damage.',
    severity: 'urgent',
    symptoms: ['jaundice', 'lethargy', 'poor_feeding', 'dehydration', 'weight_loss'],
    matchingThreshold: 0.4,
    recommendation: 'Consult a pediatrician urgently. Severe jaundice requires phototherapy treatment.',
    homeCare: 'Ensure frequent feeding to promote bilirubin excretion through stool.',
    whenToSeekCare: 'Within 24 hours if jaundice is spreading or baby is very sleepy.',
    emergencySigns: ['Jaundice reaching arms/legs', 'Extreme sleepiness', 'Not feeding', 'High-pitched cry'],
  },
  {
    id: 'dehydration',
    name: 'Dehydration',
    description: 'Loss of body fluids, common with vomiting, diarrhea, or insufficient feeding.',
    severity: 'urgent',
    symptoms: ['dehydration', 'poor_feeding', 'lethargy', 'dry_mouth', 'fewer_wet_diapers'],
    matchingThreshold: 0.5,
    recommendation: 'Seek medical attention. Dehydration in newborns can progress quickly.',
    homeCare: 'Offer more frequent feeds. Monitor diaper count (should be 6+ wet diapers/day).',
    whenToSeekCare: 'Within 24 hours if baby has fewer than 4 wet diapers in 24 hours.',
    emergencySigns: ['No wet diaper in 8 hours', 'Sunken eyes', 'Sunken soft spot', 'Extreme sleepiness'],
  },
  {
    id: 'intussusception',
    name: 'Intussusception',
    description: 'A serious condition where part of the intestine folds into another section, causing a blockage.',
    severity: 'emergency',
    symptoms: ['abdominal_distension', 'vomiting', 'blood_in_stool', 'irritability', 'lethargy', 'poor_feeding'],
    matchingThreshold: 0.4,
    recommendation: 'Seek emergency care immediately. This condition requires urgent medical intervention.',
    whenToSeekCare: 'Immediately — go to the emergency room.',
    emergencySigns: ['Currant-jelly stools', 'Severe abdominal pain (pulling knees to chest)', 'Bile-stained vomit'],
  },
  {
    id: 'pyloric_stenosis',
    name: 'Pyloric Stenosis',
    description: 'A narrowing of the stomach outlet causing forceful vomiting after feeds.',
    severity: 'urgent',
    symptoms: ['excessive_spitup', 'weight_loss', 'dehydration', 'poor_feeding', 'constipation'],
    matchingThreshold: 0.4,
    recommendation: 'Consult a pediatric surgeon. Pyloric stenosis requires surgical correction but is not an emergency.',
    whenToSeekCare: 'Within 1-2 days if baby has persistent projectile vomiting.',
  },
  {
    id: 'eczema',
    name: 'Eczema / Atopic Dermatitis',
    description: 'A common skin condition causing dry, itchy, inflamed patches on the skin.',
    severity: 'low',
    symptoms: ['rash', 'skin_peeling'],
    matchingThreshold: 0.5,
    recommendation: 'Use fragrance-free moisturizers and avoid harsh soaps. Consult pediatrician if severe.',
    homeCare: 'Apply unscented moisturizer after baths. Use lukewarm water. Dress in soft cotton clothing.',
    whenToSeekCare: 'At next well-child visit, or sooner if rash is severe or appears infected.',
  },
  {
    id: 'diaper_rash',
    name: 'Diaper Rash',
    description: 'Common skin irritation in the diaper area caused by prolonged wetness or friction.',
    severity: 'low',
    symptoms: ['rash'],
    matchingThreshold: 0.6,
    recommendation: 'Change diapers frequently and apply zinc oxide barrier cream.',
    homeCare: 'Keep diaper area clean and dry. Apply diaper cream with each change. Give diaper-free time.',
    whenToSeekCare: 'If rash persists beyond a week or has pus-filled bumps.',
  },
  {
    id: 'colic',
    name: 'Infant Colic',
    description: 'Excessive crying in an otherwise healthy baby, typically in the first 3-4 months.',
    severity: 'low',
    symptoms: ['irritability'],
    matchingThreshold: 0.5,
    recommendation: 'Colic is common and usually resolves on its own around 3-4 months.',
    homeCare: 'Try gentle rocking, white noise, warm baths, and burping during feeds. Hold baby upright after feeding.',
    whenToSeekCare: 'At next checkup if crying persists. Rule out other causes if baby has fever or other symptoms.',
  },
  {
    id: 'common_cold',
    name: 'Common Cold',
    description: 'A mild viral upper respiratory infection that is common in newborns.',
    severity: 'low',
    symptoms: ['nasal_congestion', 'cough', 'fever_low', 'poor_feeding'],
    matchingThreshold: 0.4,
    recommendation: 'Supportive care at home. Most colds resolve within 7-10 days.',
    homeCare: 'Use saline drops and nasal aspirator for congestion. Offer frequent small feeds. Use a cool-mist humidifier.',
    whenToSeekCare: 'If fever persists >3 days, or if baby develops difficulty breathing.',
  },
  {
    id: 'thrush',
    name: 'Oral Thrush',
    description: 'A fungal (candida) infection in the mouth, appearing as white patches on tongue and cheeks.',
    severity: 'low',
    symptoms: ['poor_feeding', 'irritability', 'feeding_difficulty'],
    matchingThreshold: 0.5,
    recommendation: 'Consult pediatrician for antifungal oral drops. Treat promptly to prevent feeding difficulties.',
    homeCare: 'Sterilize bottle nipples and pacifiers. If breastfeeding, mother may need treatment too.',
    whenToSeekCare: 'Within a few days if white patches appear and baby seems uncomfortable feeding.',
  },
  {
    id: 'umbilical_infection',
    name: 'Umbilical Cord Infection (Omphalitis)',
    description: 'An infection of the umbilical cord stump, which can spread if not treated.',
    severity: 'urgent',
    symptoms: ['umbilical_redness', 'fever_high', 'irritability', 'poor_feeding'],
    matchingThreshold: 0.4,
    recommendation: 'See a pediatrician urgently. Antibiotics may be needed to prevent spread.',
    homeCare: 'Keep umbilical area clean and dry. Do not submerge in bath water until stump falls off.',
    whenToSeekCare: 'Within 24 hours if redness spreads or there is discharge with fever.',
    emergencySigns: ['Spreading redness on belly', 'Fever with cord redness', 'Pus draining from stump'],
  },
  {
    id: 'allergic_reaction',
    name: 'Allergic Reaction',
    description: 'An immune response to food, medication, or environmental trigger.',
    severity: 'urgent',
    symptoms: ['rash', 'difficult_breathing', 'vomiting', 'diarrhea'],
    matchingThreshold: 0.35,
    recommendation: 'If breathing is affected, seek emergency care. Otherwise consult pediatrician.',
    homeCare: 'Identify and remove trigger. For mild rash, antihistamines may be prescribed by doctor.',
    whenToSeekCare: 'Immediately if breathing difficulty. Within 24 hours for hives/rash without breathing issues.',
    emergencySigns: ['Swelling of face/lips/tongue', 'Difficulty breathing', 'Wheezing'],
  },
  {
    id: 'gastroenteritis',
    name: 'Gastroenteritis (Stomach Flu)',
    description: 'An infection of the digestive tract causing vomiting and diarrhea.',
    severity: 'moderate',
    symptoms: ['vomiting', 'diarrhea', 'fever_low', 'poor_feeding', 'dehydration', 'irritability'],
    matchingThreshold: 0.35,
    recommendation: 'Focus on hydration. Monitor for signs of dehydration.',
    homeCare: 'Offer frequent small breastmilk or formula feeds. Watch diaper output. Keep baby clean and dry.',
    whenToSeekCare: 'Within 24 hours if unable to keep fluids down, fewer wet diapers, or blood in stool.',
    emergencySigns: ['No wet diaper in 8 hours', 'Blood in stool', 'Green vomit', 'Extreme lethargy'],
  },
];

// ── Engine Functions ───────────────────────────────────

let sessionCounter = 0;

export function createSession(): string {
  sessionCounter += 1;
  return `chk_${Date.now()}_${sessionCounter}`;
}

export function getSymptomById(id: SymptomId): Symptom | undefined {
  return SYMPTOMS.find((s) => s.id === id);
}

export function getSymptomsByIds(ids: SymptomId[]): Symptom[] {
  return SYMPTOMS.filter((s) => ids.includes(s.id));
}

export function getSymptomsByCategory(category: Symptom['category']): Symptom[] {
  return SYMPTOMS.filter((s) => s.category === category);
}

export function getDiseaseById(id: string): Disease | undefined {
  return DISEASES.find((d) => d.id === id);
}

/**
 * Cross-reference selected symptoms against disease database.
 * Returns ranked assessments sorted by match score descending.
 */
export function assessSymptoms(selectedSymptomIds: SymptomId[]): {
  results: AssessmentResult[];
  isEmergency: boolean;
} {
  if (selectedSymptomIds.length === 0) {
    return { results: [], isEmergency: false };
  }

  const selectedSet = new Set(selectedSymptomIds);
  const assessments: AssessmentResult[] = [];

  for (const disease of DISEASES) {
    const matchingSymptoms = disease.symptoms.filter((s) => selectedSet.has(s));
    const matchScore = disease.symptoms.length > 0
      ? matchingSymptoms.length / disease.symptoms.length
      : 0;

    // Only include if meets threshold
    if (matchScore >= disease.matchingThreshold) {
      assessments.push({
        diseaseId: disease.id,
        diseaseName: disease.name,
        matchScore,
        severity: disease.severity,
        description: disease.description,
        recommendation: disease.recommendation,
        homeCare: disease.homeCare,
        whenToSeekCare: disease.whenToSeekCare,
        emergencySigns: disease.emergencySigns,
      });
    }
  }

  // Sort by match score descending, then by severity (emergency first)
  const severityOrder: Record<SeverityLevel, number> = {
    emergency: 0,
    urgent: 1,
    moderate: 2,
    low: 3,
  };

  assessments.sort((a, b) => {
    if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore;
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const isEmergency = assessments.some((a) => a.severity === 'emergency');

  return { results: assessments, isEmergency };
}

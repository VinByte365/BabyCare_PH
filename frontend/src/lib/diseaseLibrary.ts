/**
 * BabyGuide PH — Disease Library
 *
 * Enriched disease database for the Disease Library module.
 * Extends the symptom checker Disease type with additional
 * fields needed for the library detail view.
 */

import type { SeverityLevel, SymptomId } from './symptomEngine';

export type DiseaseCategory = 'general' | 'respiratory' | 'digestive' | 'skin' | 'neurological';

export interface DiseaseLibraryEntry {
  id: string;
  name: string;
  commonName?: string;
  category: DiseaseCategory;
  description: string;
  severity: SeverityLevel;
  symptoms: SymptomId[];
  matchingThreshold: number;
  recommendation: string;
  homeCare?: string;
  whenToSeekCare: string;
  emergencySigns?: string[];
  causes: string;
  prevention?: string;
  treatment: string;
  complications?: string;
  faq?: { question: string; answer: string }[];
}

export const LIBRARY_CATEGORIES: { id: DiseaseCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'respiratory', label: 'Respiratory' },
  { id: 'digestive', label: 'Digestive' },
  { id: 'skin', label: 'Skin' },
  { id: 'neurological', label: 'Neurological' },
  { id: 'general', label: 'General' },
];

export const DISEASE_LIBRARY: DiseaseLibraryEntry[] = [
  {
    id: 'neonatal_sepsis',
    name: 'Neonatal Sepsis',
    category: 'general',
    description: 'A serious bacterial infection in the bloodstream that requires immediate medical attention.',
    severity: 'emergency',
    symptoms: ['fever_high', 'lethargy', 'poor_feeding', 'irritability', 'difficult_breathing', 'grunting', 'flaring', 'retractions'],
    matchingThreshold: 0.3,
    recommendation: 'Seek emergency medical care immediately. Neonatal sepsis requires immediate IV antibiotics and hospital monitoring.',
    whenToSeekCare: 'Immediately — go to the nearest emergency room or call an ambulance.',
    emergencySigns: ['Difficulty breathing', 'Unusually sleepy', 'Not feeding', 'High fever'],
    causes: 'Sepsis occurs when bacteria enter the baby\'s bloodstream, often during or shortly after delivery. Risk factors include premature birth, low birth weight, prolonged rupture of membranes, and maternal infection during delivery.',
    prevention: 'Good prenatal care, screening for group B streptococcus during pregnancy, and proper hand hygiene when handling the newborn can reduce risk.',
    treatment: 'Treatment requires immediate hospitalization. Intravenous (IV) antibiotics are given, along with supportive care such as oxygen, IV fluids, and close monitoring of vital signs. Treatment typically lasts 7-14 days.',
    complications: 'If not treated promptly, sepsis can lead to meningitis, organ failure, septic shock, and long-term developmental problems.',
    faq: [
      { question: 'Can sepsis be prevented during delivery?', answer: 'Proper prenatal screening for Group B Strep (GBS) and administering antibiotics during labor to GBS-positive mothers significantly reduces the risk of early-onset sepsis.' },
      { question: 'How long will my baby be in the hospital?', answer: 'Most babies with sepsis stay in the hospital for 7-14 days to complete the full course of IV antibiotics.' },
      { question: 'Will my baby have long-term effects?', answer: 'With prompt treatment, most babies recover fully. However, severe cases may have long-term effects, which is why early treatment is critical.' },
    ],
  },
  {
    id: 'meningitis',
    name: 'Neonatal Meningitis',
    category: 'neurological',
    description: 'Inflammation of the membranes surrounding the brain and spinal cord, often caused by infection.',
    severity: 'emergency',
    symptoms: ['fever_high', 'lethargy', 'poor_feeding', 'seizures', 'bulging_fontanelle', 'stiffness', 'irritability', 'vomiting'],
    matchingThreshold: 0.3,
    recommendation: 'Seek emergency care immediately. Meningitis requires urgent diagnosis and IV antibiotic treatment.',
    whenToSeekCare: 'Immediately — go to the nearest emergency room.',
    emergencySigns: ['Bulging soft spot', 'Stiff body', 'Seizures', 'High fever with lethargy'],
    causes: 'Meningitis in newborns is most often caused by bacteria (such as Group B Strep or E. coli) that spread from the bloodstream to the brain. It can also be caused by viruses. Risk factors include premature birth and maternal infections.',
    prevention: 'Vaccination of pregnant women (where available), proper hand hygiene, and treating maternal infections promptly during pregnancy can reduce risk.',
    treatment: 'Treatment requires immediate hospitalization with IV antibiotics or antiviral medications. Supportive care includes fluids, seizure management, and monitoring of brain pressure. Treatment typically lasts 2-3 weeks.',
    complications: 'Potential complications include hearing loss, vision problems, developmental delays, cerebral palsy, and seizures.',
    faq: [
      { question: 'Can meningitis cause hearing loss?', answer: 'Yes, hearing loss is a known complication. All babies who have had meningitis should have a hearing test after recovery.' },
      { question: 'Is meningitis contagious?', answer: 'Most bacterial meningitis is not highly contagious, but the bacteria that cause it can spread through close contact. Family members may be given preventive antibiotics.' },
    ],
  },
  {
    id: 'pneumonia',
    name: 'Neonatal Pneumonia',
    category: 'respiratory',
    description: 'A lung infection causing inflammation in the air sacs, making breathing difficult.',
    severity: 'urgent',
    symptoms: ['cough', 'difficult_breathing', 'fever_high', 'poor_feeding', 'grunting', 'flaring', 'retractions', 'wheezing'],
    matchingThreshold: 0.3,
    recommendation: 'See a doctor urgently. Pneumonia in newborns typically requires hospitalization for monitoring and antibiotics.',
    whenToSeekCare: 'Within 24 hours, or immediately if breathing worsens.',
    emergencySigns: ['Blue lips or face', 'Grunting with each breath', 'Severe chest retractions'],
    causes: 'Pneumonia is caused by bacteria, viruses, or fungi. Newborns are particularly vulnerable because their immune systems are not fully developed. Infections can be acquired during birth or from the environment after delivery.',
    prevention: 'Good hand hygiene, keeping the baby away from sick individuals, and ensuring proper ventilation at home. Maternal vaccination (flu, whooping cough) during pregnancy also helps protect the newborn.',
    treatment: 'Treatment includes antibiotics for bacterial pneumonia, oxygen therapy if needed, IV fluids to prevent dehydration, and careful monitoring of breathing. Hospital stays typically range from 5-10 days.',
    complications: 'Possible complications include respiratory failure, sepsis, lung abscess, and pleural effusion (fluid around the lungs).',
    faq: [
      { question: 'Can my baby recover fully from pneumonia?', answer: 'Yes, with prompt medical treatment, most newborns recover fully without long-term lung damage.' },
      { question: 'How can I tell if my baby\'s breathing is getting worse?', answer: 'Watch for faster breathing, grunting with each breath, nostril flaring, chest retractions (skin pulling in between ribs), and blue discoloration around the lips.' },
    ],
  },
  {
    id: 'bronchiolitis',
    name: 'Bronchiolitis / RSV',
    category: 'respiratory',
    description: 'A common respiratory infection that causes inflammation of the small airways in the lungs.',
    severity: 'urgent',
    symptoms: ['cough', 'wheezing', 'difficult_breathing', 'nasal_congestion', 'poor_feeding', 'fever_low', 'irritability'],
    matchingThreshold: 0.35,
    recommendation: 'Consult a pediatrician promptly. Most cases can be managed at home with supportive care, but young infants may need hospital monitoring.',
    whenToSeekCare: 'Within 24-48 hours. Go to ER if baby has trouble breathing or stops feeding.',
    causes: 'Bronchiolitis is most commonly caused by Respiratory Syncytial Virus (RSV). It spreads through respiratory droplets from coughs and sneezes. Outbreaks are common during the rainy season in the Philippines.',
    prevention: 'Frequent hand washing, avoiding crowded places with the baby, keeping the baby away from people with colds, and cleaning frequently touched surfaces. There is no vaccine for RSV yet, but preventive antibody injections are available for high-risk infants.',
    treatment: 'Home care includes using saline drops and bulb suction for nasal congestion, offering frequent small feeds, and using a cool-mist humidifier. Hospital treatment may include oxygen support, IV fluids, and suctioning of mucus.',
    complications: 'Severe cases can lead to pneumonia, respiratory failure, or dehydration. Premature babies and those with heart or lung conditions are at higher risk.',
    faq: [
      { question: 'Is RSV season a concern in the Philippines?', answer: 'Yes, RSV infections tend to peak during the rainy season (June to November). Extra precautions during these months are recommended for young infants.' },
      { question: 'Can bronchiolitis happen more than once?', answer: 'Yes, babies can get bronchiolitis more than once, though subsequent infections are often milder.' },
    ],
  },
  {
    id: 'uti',
    name: 'Urinary Tract Infection',
    category: 'general',
    description: 'A bacterial infection in the urinary tract that can be serious in newborns.',
    severity: 'urgent',
    symptoms: ['fever_high', 'irritability', 'poor_feeding', 'vomiting', 'lethargy'],
    matchingThreshold: 0.4,
    recommendation: 'See a pediatrician within 24 hours. UTI in newborns requires urine testing and antibiotic treatment.',
    whenToSeekCare: 'Within 24 hours if fever persists or baby seems unwell.',
    causes: 'UTIs occur when bacteria enter the urinary tract through the urethra. In newborns, it is more common in uncircumcised boys and can also be caused by anatomical abnormalities in the urinary system.',
    prevention: 'Proper hygiene during diaper changes (wipe front to back for girls), keeping the genital area clean and dry, and ensuring the baby is well-hydrated through regular feeding.',
    treatment: 'Treatment involves oral or IV antibiotics based on severity. A course of 7-14 days is typical. Further imaging tests may be ordered to check for anatomical issues.',
    complications: 'If untreated, UTIs can spread to the kidneys (pyelonephritis) and potentially cause kidney damage or sepsis.',
    faq: [
      { question: 'How is a urine sample collected from a newborn?', answer: 'A urine collection bag is attached to the baby\'s genital area, or a catheter may be used for a more accurate sample. In some cases, a suprapubic aspiration (using a needle to draw urine from the bladder) is performed.' },
      { question: 'Will my baby need further testing after a UTI?', answer: 'Newborns with a confirmed UTI often undergo imaging studies (like a renal ultrasound or VCUG) to check for vesicoureteral reflux or other anatomical abnormalities.' },
    ],
  },
  {
    id: 'jaundice_severe',
    name: 'Severe Jaundice (Hyperbilirubinemia)',
    category: 'general',
    description: 'High levels of bilirubin causing yellowing of the skin and eyes. Requires treatment to prevent brain damage.',
    severity: 'urgent',
    symptoms: ['jaundice', 'lethargy', 'poor_feeding', 'dehydration', 'weight_loss'],
    matchingThreshold: 0.4,
    recommendation: 'Consult a pediatrician urgently. Severe jaundice requires phototherapy treatment.',
    whenToSeekCare: 'Within 24 hours if jaundice is spreading or baby is very sleepy.',
    emergencySigns: ['Jaundice reaching arms/legs', 'Extreme sleepiness', 'Not feeding', 'High-pitched cry'],
    causes: 'Jaundice is caused by a buildup of bilirubin, a yellow substance produced when red blood cells break down. Newborns have immature livers that cannot process bilirubin quickly enough. Severe jaundice can be worsened by breastfeeding difficulties, bruising during birth, or blood type incompatibility.',
    prevention: 'Ensuring adequate feeding (breast milk or formula) helps the baby pass bilirubin through stool. Regular monitoring of bilirubin levels in the first few days after birth is standard practice.',
    treatment: 'Phototherapy is the standard treatment — the baby is placed under a special blue light that helps break down bilirubin in the skin. In very severe cases, exchange transfusion (replacing the baby\'s blood with donor blood) may be needed.',
    complications: 'Extremely high bilirubin levels can cause kernicterus, a type of brain damage that can lead to hearing loss, movement disorders, and developmental delays.',
    faq: [
      { question: 'Is jaundice in newborns always dangerous?', answer: 'Mild jaundice is very common and usually harmless. It becomes dangerous only when bilirubin levels get very high, which is why monitoring is important.' },
      { question: 'Does breastfeeding cause jaundice?', answer: 'Breastfeeding itself does not cause jaundice, but inadequate feeding can lead to dehydration and slower bilirubin clearance. Breastfeeding should continue; the baby just needs to feed effectively.' },
    ],
  },
  {
    id: 'dehydration',
    name: 'Dehydration',
    category: 'digestive',
    description: 'Loss of body fluids, common with vomiting, diarrhea, or insufficient feeding.',
    severity: 'urgent',
    symptoms: ['dehydration', 'poor_feeding', 'lethargy', 'dry_mouth', 'fewer_wet_diapers'],
    matchingThreshold: 0.5,
    recommendation: 'Seek medical attention. Dehydration in newborns can progress quickly.',
    whenToSeekCare: 'Within 24 hours if baby has fewer than 4 wet diapers in 24 hours.',
    emergencySigns: ['No wet diaper in 8 hours', 'Sunken eyes', 'Sunken soft spot', 'Extreme sleepiness'],
    causes: 'Dehydration in newborns is usually caused by insufficient milk intake, vomiting, diarrhea, or fever. Hot weather can also contribute to fluid loss. In the Philippines, the tropical climate increases the risk of dehydration.',
    prevention: 'Ensure the baby feeds at least 8-12 times per day. Monitor wet diaper count (6+ per day is normal). During hot weather, offer extra feeds. Watch for early signs like dry lips and fewer wet diapers.',
    treatment: 'Mild to moderate dehydration is treated by increasing feeding frequency. Severe cases may require hospitalization for IV fluids or nasogastric tube feeding. The underlying cause (vomiting, diarrhea, etc.) must also be addressed.',
    complications: 'Severe dehydration can lead to electrolyte imbalances, kidney damage, seizures, and shock. It can progress rapidly in newborns, so early intervention is critical.',
    faq: [
      { question: 'How many wet diapers should my newborn have each day?', answer: 'A well-hydrated newborn should have at least 6 wet diapers per day after the first week of life. Fewer than 4 wet diapers in 24 hours is a warning sign.' },
      { question: 'Can I give my baby water for dehydration?', answer: 'No. Newborns should only receive breast milk or formula. Water can lead to water intoxication and electrolyte imbalances. Offer more frequent milk feeds instead.' },
    ],
  },
  {
    id: 'intussusception',
    name: 'Intussusception',
    category: 'digestive',
    description: 'A serious condition where part of the intestine folds into another section, causing a blockage.',
    severity: 'emergency',
    symptoms: ['abdominal_distension', 'vomiting', 'blood_in_stool', 'irritability', 'lethargy', 'poor_feeding'],
    matchingThreshold: 0.4,
    recommendation: 'Seek emergency care immediately. This condition requires urgent medical intervention.',
    whenToSeekCare: 'Immediately — go to the emergency room.',
    emergencySigns: ['Currant-jelly stools', 'Severe abdominal pain (pulling knees to chest)', 'Bile-stained vomit'],
    causes: 'The exact cause is often unknown, but it is sometimes triggered by a viral infection or a polyp/tumor in the intestine. It is most common in babies 6-18 months old but can occur in newborns as well.',
    prevention: 'There is no known way to prevent intussusception, but being aware of the symptoms and seeking prompt care can prevent serious complications.',
    treatment: 'A non-surgical procedure called an air or barium enema can often correct the telescoping intestine. If this fails or if the intestine is damaged, surgery is needed.',
    complications: 'Without treatment, the intestine can become strangulated, leading to tissue death, perforation, peritonitis (abdominal infection), and shock.',
    faq: [
      { question: 'What does "currant-jelly" stool look like?', answer: 'It looks like a mixture of blood and mucus that resembles currant jelly or red gelatin. This is a classic sign of intussusception and requires immediate medical attention.' },
      { question: 'Can intussusception come back after treatment?', answer: 'In about 10% of cases, intussusception can recur, usually within 24 hours of treatment. Your doctor will monitor the baby closely.' },
    ],
  },
  {
    id: 'pyloric_stenosis',
    name: 'Pyloric Stenosis',
    category: 'digestive',
    description: 'A narrowing of the stomach outlet causing forceful vomiting after feeds.',
    severity: 'urgent',
    symptoms: ['excessive_spitup', 'weight_loss', 'dehydration', 'poor_feeding', 'constipation'],
    matchingThreshold: 0.4,
    recommendation: 'Consult a pediatric surgeon. Pyloric stenosis requires surgical correction but is not an emergency.',
    whenToSeekCare: 'Within 1-2 days if baby has persistent projectile vomiting.',
    causes: 'The muscle at the outlet of the stomach (pylorus) thickens, preventing food from passing into the small intestine. The cause is unknown but genetics play a role. It is more common in first-born male infants.',
    prevention: 'There is no known way to prevent pyloric stenosis. Early recognition of symptoms is important.',
    treatment: 'Surgery called a pyloromyotomy is performed to cut the thickened muscle and open the stomach outlet. The surgery is safe and effective. Most babies go home within 24-48 hours after surgery.',
    complications: 'Untreated pyloric stenosis leads to severe dehydration, weight loss, and electrolyte imbalances. With treatment, the outlook is excellent.',
    faq: [
      { question: 'What does projectile vomiting look like?', answer: 'Unlike regular spit-up, projectile vomiting is forceful — the milk shoots out several inches or feet from the baby\'s mouth. It usually happens shortly after feeding.' },
      { question: 'Can pyloric stenosis resolve on its own?', answer: 'No, surgery is necessary to correct the narrowing. However, it is not an emergency — the baby can wait a day or two for surgery while being rehydrated.' },
    ],
  },
  {
    id: 'eczema',
    name: 'Eczema / Atopic Dermatitis',
    category: 'skin',
    description: 'A common skin condition causing dry, itchy, inflamed patches on the skin.',
    severity: 'low',
    symptoms: ['rash', 'skin_peeling'],
    matchingThreshold: 0.5,
    recommendation: 'Use fragrance-free moisturizers and avoid harsh soaps. Consult pediatrician if severe.',
    whenToSeekCare: 'At next well-child visit, or sooner if rash is severe or appears infected.',
    causes: 'Eczema is caused by a combination of genetic and environmental factors. It involves a defect in the skin barrier and an overactive immune response. Triggers include dry skin, irritants (soaps, detergents), allergens, heat, and sweating.',
    prevention: 'Regular moisturizing with fragrance-free creams, bathing with lukewarm water, using mild soap-free cleansers, dressing the baby in soft cotton clothing, and keeping the room cool can help prevent flare-ups.',
    treatment: 'Daily moisturizing is the cornerstone of treatment. For flare-ups, mild topical corticosteroids (hydrocortisone) may be prescribed by a doctor. Avoid harsh soaps and keep nails short to prevent scratching damage. Wet wrap therapy may be used for severe cases.',
    complications: 'Repeated scratching can lead to skin infections (bacterial or viral). Eczema is also associated with food allergies, asthma, and allergic rhinitis (the "atopic march").',
    faq: [
      { question: 'Will my baby outgrow eczema?', answer: 'Many children outgrow eczema by school age, though some continue to have dry or sensitive skin into adulthood.' },
      { question: 'Is eczema caused by an allergy?', answer: 'Eczema itself is not an allergy, but it is strongly associated with allergies. Certain foods can trigger flare-ups in some children. Talk to your pediatrician before eliminating foods.' },
    ],
  },
  {
    id: 'diaper_rash',
    name: 'Diaper Rash',
    category: 'skin',
    description: 'Common skin irritation in the diaper area caused by prolonged wetness or friction.',
    severity: 'low',
    symptoms: ['rash'],
    matchingThreshold: 0.6,
    recommendation: 'Change diapers frequently and apply zinc oxide barrier cream.',
    whenToSeekCare: 'If rash persists beyond a week or has pus-filled bumps.',
    causes: 'Diaper rash is caused by prolonged contact with urine and stool, which irritates the baby\'s delicate skin. Friction from diapers, yeast infections (Candida), and bacterial infections can also cause or worsen the rash. In the Philippines, the warm, humid climate can make diaper rash more common.',
    prevention: 'Change diapers frequently (every 2-3 hours and immediately after bowel movements). Clean the area gently with water and pat dry. Apply a barrier cream with zinc oxide at each change. Give diaper-free time daily.',
    treatment: 'Increase diaper change frequency, use zinc oxide cream or petroleum jelly, and give the baby diaper-free time to let the skin air out. For yeast infections (bright red rash with satellite spots), an antifungal cream may be prescribed. If the rash has pus-filled bumps, antibiotics may be needed.',
    complications: 'Untreated severe diaper rash can lead to skin breakdown and secondary bacterial or fungal infections.',
    faq: [
      { question: 'Should I use baby powder for diaper rash?', answer: 'Powders are not recommended as they can be inhaled by the baby and may actually worsen irritation. Stick with zinc oxide barrier creams.' },
      { question: 'How do I know if it\'s a yeast infection?', answer: 'Yeast diaper rashes are bright red, have small red bumps (satellite lesions) around the edges, and do not improve with regular diaper rash cream. A pediatrician can diagnose and prescribe antifungal treatment.' },
    ],
  },
  {
    id: 'colic',
    name: 'Infant Colic',
    category: 'general',
    description: 'Excessive crying in an otherwise healthy baby, typically in the first 3-4 months.',
    severity: 'low',
    symptoms: ['irritability'],
    matchingThreshold: 0.5,
    recommendation: 'Colic is common and usually resolves on its own around 3-4 months.',
    whenToSeekCare: 'At next checkup if crying persists. Rule out other causes if baby has fever or other symptoms.',
    causes: 'The exact cause of colic is unknown. Possible contributing factors include an immature digestive system, gas, overstimulation, or the baby\'s temperament. It is a diagnosis of exclusion — meaning other causes of crying must first be ruled out.',
    prevention: 'Colic cannot be prevented, but responsive care (picking up the baby when they cry, feeding on demand) may reduce its severity.',
    treatment: 'Home care includes gentle rocking, white noise, warm baths, burping during feeds, and holding the baby upright after feeding. Gripe water or simethicone drops may help some babies. Swaddling and babywearing can also be soothing. The most important thing is parental support and taking breaks when needed.',
    complications: 'Colic itself does not cause any medical complications. However, it can be very stressful for parents and caregivers. Support from family and friends is important for parental well-being.',
    faq: [
      { question: 'How is colic different from normal crying?', answer: 'Colic follows the "rule of three": crying for more than 3 hours per day, more than 3 days per week, for more than 3 weeks. The baby is otherwise healthy and growing well.' },
      { question: 'When does colic go away?', answer: 'Colic typically resolves on its own by 3-4 months of age, often improving gradually.' },
    ],
  },
  {
    id: 'common_cold',
    name: 'Common Cold',
    category: 'respiratory',
    description: 'A mild viral upper respiratory infection that is common in newborns.',
    severity: 'low',
    symptoms: ['nasal_congestion', 'cough', 'fever_low', 'poor_feeding'],
    matchingThreshold: 0.4,
    recommendation: 'Supportive care at home. Most colds resolve within 7-10 days.',
    whenToSeekCare: 'If fever persists >3 days, or if baby develops difficulty breathing.',
    causes: 'The common cold is caused by viruses (most often rhinoviruses). Newborns have immature immune systems and can catch colds easily from family members. In the Philippines, colds are common year-round but increase during the rainy season.',
    prevention: 'Frequent hand washing, keeping the baby away from people with colds, and wearing a mask if the caregiver has cold symptoms. Breastfeeding provides antibodies that help protect against infections.',
    treatment: 'Home care is the main treatment. Use saline drops and a bulb syringe to clear nasal congestion. Use a cool-mist humidifier in the room. Offer frequent small feeds to prevent dehydration. Do not give over-the-counter cold or cough medicines to infants without a doctor\'s approval.',
    complications: 'In newborns, a cold can sometimes progress to more serious conditions like ear infections, bronchiolitis, or pneumonia. Monitor breathing and feeding closely.',
    faq: [
      { question: 'Can I give my baby paracetamol for fever?', answer: 'Paracetamol may be given to babies over 2 months old if they have a fever and are uncomfortable. Always follow the weight-based dosing instructions from your pediatrician.' },
      { question: 'How do I safely suction my baby\'s nose?', answer: 'Use a rubber bulb syringe. Squeeze the bulb, gently insert the tip into one nostril, then release. Wash with soap and water after each use. Do this before feeds to help your baby breathe and eat better.' },
    ],
  },
  {
    id: 'thrush',
    name: 'Oral Thrush',
    category: 'skin',
    description: 'A fungal (candida) infection in the mouth, appearing as white patches on tongue and cheeks.',
    severity: 'low',
    symptoms: ['poor_feeding', 'irritability', 'feeding_difficulty'],
    matchingThreshold: 0.5,
    recommendation: 'Consult pediatrician for antifungal oral drops. Treat promptly to prevent feeding difficulties.',
    whenToSeekCare: 'Within a few days if white patches appear and baby seems uncomfortable feeding.',
    causes: 'Thrush is caused by an overgrowth of Candida albicans, a fungus that normally lives in small amounts in the mouth. Factors that can lead to overgrowth include antibiotic use (by the baby or breastfeeding mother), a weakened immune system, or using pacifiers/bottle nipples that are not properly sterilized.',
    prevention: 'Sterilize bottle nipples and pacifiers regularly by boiling them. If breastfeeding and you develop a yeast infection on your nipples, treat it promptly. Wash hands thoroughly before and after feeding.',
    treatment: 'Treatment involves applying antifungal oral drops (such as nystatin) to the baby\'s mouth after feeds, usually 4 times per day. Continue for several days after the white patches disappear to prevent recurrence. If breastfeeding, the mother may also need treatment for nipple thrush.',
    complications: 'Severe thrush can cause feeding difficulties leading to poor weight gain. In very rare cases, it can spread to the esophagus or other parts of the body.',
    faq: [
      { question: 'How do I tell thrush apart from milk residue?', answer: 'Milk residue wipes off easily, while thrush patches are more stubborn and may bleed slightly if scraped. If you are unsure, have your pediatrician take a look.' },
      { question: 'Can I continue breastfeeding if my baby has thrush?', answer: 'Yes, absolutely. Breastfeeding can continue even if the baby has thrush. In fact, breast milk contains antibodies that can help fight the infection.' },
    ],
  },
  {
    id: 'umbilical_infection',
    name: 'Umbilical Cord Infection (Omphalitis)',
    category: 'skin',
    description: 'An infection of the umbilical cord stump, which can spread if not treated.',
    severity: 'urgent',
    symptoms: ['umbilical_redness', 'fever_high', 'irritability', 'poor_feeding'],
    matchingThreshold: 0.4,
    recommendation: 'See a pediatrician urgently. Antibiotics may be needed to prevent spread.',
    whenToSeekCare: 'Within 24 hours if redness spreads or there is discharge with fever.',
    emergencySigns: ['Spreading redness on belly', 'Fever with cord redness', 'Pus draining from stump'],
    causes: 'Omphalitis is caused by bacteria (such as Staphylococcus or Streptococcus) entering the umbilical stump. Risk factors include poor hygiene, keeping the stump too moist, premature birth, and prolonged hospital stay after delivery.',
    prevention: 'Keep the umbilical stump clean and dry. Fold the diaper below the stump. Give sponge baths instead of tub baths until the stump falls off. Clean around the base with a cotton swab dipped in 70% isopropyl alcohol if recommended by your doctor.',
    treatment: 'Mild cases may be treated with topical antibiotics. More serious cases require oral or IV antibiotics. If an abscess forms, it may need to be drained. Treatment is important to prevent the infection from spreading to the abdominal wall or bloodstream.',
    complications: 'The infection can spread to the abdominal wall (cellulitis), the blood (sepsis), or the liver (portal vein thrombosis). Early treatment is crucial.',
    faq: [
      { question: 'When does the umbilical stump normally fall off?', answer: 'The umbilical stump usually falls off within 1-2 weeks after birth. The area should heal completely within a few more days.' },
      { question: 'What is normal vs. concerning discharge from the stump?', answer: 'A small amount of clear or slightly bloody discharge is normal as the stump dries and separates. Pus (yellow or green discharge with odor) and spreading redness are signs of infection.' },
    ],
  },
  {
    id: 'allergic_reaction',
    name: 'Allergic Reaction',
    category: 'general',
    description: 'An immune response to food, medication, or environmental trigger.',
    severity: 'urgent',
    symptoms: ['rash', 'difficult_breathing', 'vomiting', 'diarrhea'],
    matchingThreshold: 0.35,
    recommendation: 'If breathing is affected, seek emergency care. Otherwise consult pediatrician.',
    whenToSeekCare: 'Immediately if breathing difficulty. Within 24 hours for hives/rash without breathing issues.',
    emergencySigns: ['Swelling of face/lips/tongue', 'Difficulty breathing', 'Wheezing'],
    causes: 'Allergic reactions occur when the immune system overreacts to a normally harmless substance (allergen). Common triggers in newborns include cow\'s milk protein, soy, certain medications, and insect bites. In the Philippines, food allergies are becoming more recognized as a concern.',
    prevention: 'The best prevention is avoiding known allergens. If breastfeeding, the mother may need to eliminate certain foods from her diet. For formula-fed babies with confirmed milk allergy, a hypoallergenic formula may be recommended.',
    treatment: 'Mild reactions (skin rashes, hives) may be treated with antihistamines prescribed by a doctor. Severe reactions (anaphylaxis) require immediate emergency treatment with epinephrine and hospital observation. Always carry emergency contact information if your baby has known allergies.',
    complications: 'Severe allergic reactions can cause anaphylaxis — a life-threatening condition that affects breathing and blood pressure. Repeated exposure to allergens can also cause chronic skin or digestive problems.',
    faq: [
      { question: 'How soon after exposure does an allergic reaction happen?', answer: 'Reactions typically occur within minutes to 2 hours after exposure. Delayed reactions (up to 48 hours) can also occur, especially with food allergies like cow\'s milk protein.' },
      { question: 'Can a baby develop allergies even if the parents don\'t have any?', answer: 'Allergies are more common in children with a family history of allergies, but they can occur in any child. Breastfeeding and delaying solid foods until recommended age may help reduce the risk.' },
    ],
  },
  {
    id: 'gastroenteritis',
    name: 'Gastroenteritis (Stomach Flu)',
    category: 'digestive',
    description: 'An infection of the digestive tract causing vomiting and diarrhea.',
    severity: 'moderate',
    symptoms: ['vomiting', 'diarrhea', 'fever_low', 'poor_feeding', 'dehydration', 'irritability'],
    matchingThreshold: 0.35,
    recommendation: 'Focus on hydration. Monitor for signs of dehydration.',
    whenToSeekCare: 'Within 24 hours if unable to keep fluids down, fewer wet diapers, or blood in stool.',
    emergencySigns: ['No wet diaper in 8 hours', 'Blood in stool', 'Green vomit', 'Extreme lethargy'],
    causes: 'Gastroenteritis is usually caused by viruses (rotavirus, norovirus, adenovirus) and sometimes by bacteria. It is very common in infants and spreads easily through contaminated hands, toys, or surfaces. Rotavirus is a leading cause of severe diarrhea in Filipino infants.',
    prevention: 'Good hand hygiene is the best prevention. The rotavirus vaccine is part of the routine immunization schedule in the Philippines and significantly reduces the risk of severe gastroenteritis. Clean toys and surfaces regularly.',
    treatment: 'Continue breastfeeding or formula feeding — do not stop. Offer smaller, more frequent feeds. Monitor wet diaper count. For mild dehydration, a pediatrician may recommend an oral rehydration solution (such as Pedialyte) in small amounts between feeds. Hospitalization with IV fluids may be needed for severe dehydration.',
    complications: 'The main complication is dehydration, which can become severe quickly in newborns. Electrolyte imbalances and weight loss can also occur.',
    faq: [
      { question: 'Should I stop breastfeeding if my baby has diarrhea?', answer: 'No, continue breastfeeding. Breast milk is easier to digest and provides antibodies that help fight the infection. In fact, breast milk is the best thing for a baby with gastroenteritis.' },
      { question: 'What is oral rehydration solution (ORS) and where can I get it?', answer: 'ORS is a mixture of clean water, sugar, and salt that helps replace lost fluids and electrolytes. It is available at any pharmacy in the Philippines as sachets (e.g., Pedialyte, WHO-ORS). Follow package instructions for mixing.' },
    ],
  },
];

export function getDiseaseLibraryEntry(id: string): DiseaseLibraryEntry | undefined {
  return DISEASE_LIBRARY.find((d) => d.id === id);
}

export function getDiseasesByCategory(category: DiseaseCategory): DiseaseLibraryEntry[] {
  return DISEASE_LIBRARY.filter((d) => d.category === category);
}

export function searchDiseases(query: string): DiseaseLibraryEntry[] {
  const q = query.toLowerCase().trim();
  if (!q) return DISEASE_LIBRARY;
  return DISEASE_LIBRARY.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      (d.commonName && d.commonName.toLowerCase().includes(q)) ||
      d.description.toLowerCase().includes(q),
  );
}

export function getCategoryDisplayName(category: DiseaseCategory): string {
  const map: Record<DiseaseCategory, string> = {
    general: 'General',
    respiratory: 'Respiratory',
    digestive: 'Digestive',
    skin: 'Skin',
    neurological: 'Neurological',
  };
  return map[category] ?? category;
}

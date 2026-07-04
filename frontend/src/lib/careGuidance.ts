/**
 * BabyGuide PH — Care Guidance Library
 *
 * Step-by-step instructional guides linked to disease/symptom entries.
 * Each guide contains numbered steps with descriptions and icons.
 */

export interface CareStep {
  stepNumber: number;
  title: string;
  body: string;
  icon?: string;
}

export interface CareGuide {
  id: string;
  title: string;
  summary: string;
  category: string;
  diseaseIds: string[];
  steps: CareStep[];
  estimatedMinutes?: number;
}

export const CARE_GUIDES: CareGuide[] = [
  {
    id: 'fever_management',
    title: 'Fever Management at Home',
    summary: 'How to safely monitor and manage your baby\'s fever, including when to use medication and when to seek help.',
    category: 'General Care',
    diseaseIds: ['common_cold', 'gastroenteritis', 'uti', 'pneumonia'],
    estimatedMinutes: 5,
    steps: [
      {
        stepNumber: 1,
        title: 'Check the Temperature',
        body: 'Use a digital thermometer to take your baby\'s temperature. For newborns under 3 months, use a rectal thermometer for the most accurate reading. A temperature above 38°C (100.4°F) is considered a fever.',
        icon: 'thermometer-outline',
      },
      {
        stepNumber: 2,
        title: 'Remove Extra Layers',
        body: 'Dress your baby in lightweight, breathable clothing. Remove excess blankets or swaddles. Keep the room at a comfortable temperature — not too hot or cold.',
        icon: 'shirt-outline',
      },
      {
        stepNumber: 3,
        title: 'Offer Frequent Feeds',
        body: 'Fever increases fluid loss. Offer breast milk or formula more frequently than usual. Watch for signs of dehydration: fewer wet diapers, dry mouth, sunken soft spot.',
        icon: 'water-outline',
      },
      {
        stepNumber: 4,
        title: 'Medication (If Needed)',
        body: 'For babies over 2 months, paracetamol (acetaminophen) may be given based on weight. Always follow your pediatrician\'s dosing instructions. Never give aspirin to a baby. Ibuprofen is not recommended for infants under 6 months.',
        icon: 'medkit-outline',
      },
      {
        stepNumber: 5,
        title: 'Monitor Closely',
        body: 'Check temperature every 2-4 hours. If fever persists beyond 3 days, exceeds 40°C (104°F), or is accompanied by rash, difficulty breathing, or extreme lethargy, seek medical attention immediately.',
        icon: 'eye-outline',
      },
    ],
  },
  {
    id: 'diaper_rash_care',
    title: 'Diaper Rash Prevention & Treatment',
    summary: 'Step-by-step guide to preventing and treating diaper rash, including proper cleaning and barrier protection.',
    category: 'Skin Care',
    diseaseIds: ['diaper_rash', 'eczema'],
    estimatedMinutes: 5,
    steps: [
      {
        stepNumber: 1,
        title: 'Change Diapers Frequently',
        body: 'Check and change diapers every 2-3 hours, or immediately after bowel movements. Prolonged contact with urine and stool is the main cause of diaper rash.',
        icon: 'refresh-outline',
      },
      {
        stepNumber: 2,
        title: 'Clean Gently',
        body: 'Use warm water and a soft cloth or alcohol-free baby wipes. Gently pat the area dry — do not rub. For stubborn stool, use a small amount of mild soap-free cleanser.',
        icon: 'water-outline',
      },
      {
        stepNumber: 3,
        title: 'Apply Barrier Cream',
        body: 'Apply a thick layer of zinc oxide diaper cream or petroleum jelly. This creates a protective barrier against moisture. Do not wipe off completely at the next change — just clean the soiled areas.',
        icon: 'color-palette-outline',
      },
      {
        stepNumber: 4,
        title: 'Give Diaper-Free Time',
        body: 'Let your baby spend 10-15 minutes without a diaper several times a day. Place them on a waterproof mat or towel. Fresh air helps the skin heal naturally.',
        icon: 'sunny-outline',
      },
      {
        stepNumber: 5,
        title: 'When to See a Doctor',
        body: 'Consult a pediatrician if: the rash has pus-filled bumps or blisters, lasts more than a week despite home care, is bright red with satellite spots (possible yeast infection), or your baby also has a fever.',
        icon: 'medkit-outline',
      },
    ],
  },
  {
    id: 'jaundice_care',
    title: 'Newborn Jaundice Care at Home',
    summary: 'How to monitor jaundice at home, when phototherapy is needed, and feeding tips to help clear bilirubin.',
    category: 'Newborn Care',
    diseaseIds: ['jaundice_severe'],
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Check Skin Color Daily',
        body: 'Gently press on your baby\'s skin (forehead, chest, arms, legs) and release. If the skin looks yellowish when you blanch it, jaundice may be present. Check in natural daylight for the most accurate view.',
        icon: 'eye-outline',
      },
      {
        stepNumber: 2,
        title: 'Feed Frequently',
        body: 'Breastfeed or bottle-feed every 2-3 hours. Frequent feeding helps your baby pass more stool, which removes bilirubin from the body. If your baby is very sleepy, wake them for feeds.',
        icon: 'nutrition-outline',
      },
      {
        stepNumber: 3,
        title: 'Track Wet & Dirty Diapers',
        body: 'A well-fed newborn should have at least 6 wet diapers and 3-4 stool diapers per day. Fewer diapers may indicate insufficient feeding, which can worsen jaundice.',
        icon: 'water-outline',
      },
      {
        stepNumber: 4,
        title: 'Know When Jaundice Is Spreading',
        body: 'Jaundice that starts on the face and spreads to the chest, abdomen, arms, or legs indicates rising bilirubin levels. If the yellow color reaches the knees or elbows, seek medical attention urgently.',
        icon: 'warning-outline',
      },
      {
        stepNumber: 5,
        title: 'Follow Up for Phototherapy',
        body: 'If bilirubin levels are high, your pediatrician may recommend phototherapy. Your baby will be placed under a special blue light that helps break down bilirubin. This can be done in the hospital or sometimes at home.',
        icon: 'sunny-outline',
      },
    ],
  },
  {
    id: 'cough_cold_care',
    title: 'Cough & Cold Care for Infants',
    summary: 'Safe ways to relieve cold symptoms in newborns, including nasal suctioning, humidifiers, and feeding tips.',
    category: 'Respiratory Care',
    diseaseIds: ['common_cold', 'bronchiolitis'],
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Clear Nasal Congestion',
        body: 'Use saline drops (1-2 drops per nostril) to loosen mucus. Wait 30 seconds, then use a bulb syringe to gently suction each nostril. Do this before feeds to help your baby breathe and eat better.',
        icon: 'water-outline',
      },
      {
        stepNumber: 2,
        title: 'Use a Cool-Mist Humidifier',
        body: 'Place a cool-mist humidifier in your baby\'s room to add moisture to the air. This helps loosen congestion and soothe irritated airways. Clean the humidifier daily to prevent mold growth.',
        icon: 'cloud-outline',
      },
      {
        stepNumber: 3,
        title: 'Offer Small, Frequent Feeds',
        body: 'Nasal congestion can make feeding difficult. Offer smaller amounts more frequently. Keep the baby upright during and after feeds to help with breathing and reduce spit-up.',
        icon: 'nutrition-outline',
      },
      {
        stepNumber: 4,
        title: 'Keep Baby Elevated',
        body: 'Slightly elevate the head of the crib mattress (by placing a towel under the mattress, not pillows in the crib) to help with nasal drainage. Never use pillows or loose bedding in the crib.',
        icon: 'bed-outline',
      },
      {
        stepNumber: 5,
        title: 'Monitor Breathing Closely',
        body: 'Watch for signs of breathing difficulty: rapid breathing, grunting, flaring nostrils, chest retractions, or blue lips. If any of these appear, seek emergency care immediately.',
        icon: 'alert-circle-outline',
      },
    ],
  },
  {
    id: 'vomiting_diarrhea_care',
    title: 'Vomiting & Diarrhea Care',
    summary: 'How to keep your baby hydrated during stomach illness, what to feed, and warning signs of dehydration.',
    category: 'Digestive Care',
    diseaseIds: ['gastroenteritis', 'dehydration'],
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Continue Breastfeeding or Formula',
        body: 'Do not stop milk feeds. Breast milk and formula provide essential fluids and nutrition. Offer smaller amounts more frequently (e.g., 30-60 ml every 30 minutes). If your baby vomits, wait 15-20 minutes and try again.',
        icon: 'nutrition-outline',
      },
      {
        stepNumber: 2,
        title: 'Offer Oral Rehydration Solution (ORS)',
        body: 'Between feeds, offer small sips of ORS (available at any pharmacy — ask for Pedialyte or WHO-ORS). Give 1-2 teaspoons every 5-10 minutes. Do not give plain water to newborns.',
        icon: 'water-outline',
      },
      {
        stepNumber: 3,
        title: 'Track Diaper Output',
        body: 'Count wet diapers — you should see at least 4-6 per day. Fewer than 4 wet diapers in 24 hours is a warning sign of dehydration. Also track stool consistency and frequency.',
        icon: 'clipboard-outline',
      },
      {
        stepNumber: 4,
        title: 'Prevent Diaper Rash',
        body: 'Frequent loose stools can cause severe diaper rash. Change diapers immediately after each stool. Clean gently and apply a thick layer of zinc oxide barrier cream.',
        icon: 'color-palette-outline',
      },
      {
        stepNumber: 5,
        title: 'Know When to Seek Help',
        body: 'Go to the doctor if: vomiting lasts more than 12 hours, there is blood in the stool or vomit, fewer than 4 wet diapers in 24 hours, sunken eyes or soft spot, extreme sleepiness, or green/bile-stained vomit.',
        icon: 'medkit-outline',
      },
    ],
  },
  {
    id: 'eczema_skin_care',
    title: 'Eczema & Sensitive Skin Care',
    summary: 'Daily skin care routine for babies with eczema, including moisturizing, bathing tips, and trigger management.',
    category: 'Skin Care',
    diseaseIds: ['eczema'],
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Moisturize Daily',
        body: 'Apply a fragrance-free, hypoallergenic moisturizer (cream or ointment, not lotion) at least twice a day. Apply immediately after bathing to lock in moisture. Look for products with ceramides or colloidal oatmeal.',
        icon: 'water-outline',
      },
      {
        stepNumber: 2,
        title: 'Use Lukewarm Baths',
        body: 'Bathe your baby in lukewarm water for 5-10 minutes. Hot water can worsen eczema. Use mild, soap-free cleansers designed for sensitive skin. Pat dry gently with a soft towel — do not rub.',
        icon: 'water-outline',
      },
      {
        stepNumber: 3,
        title: 'Dress in Soft Fabrics',
        body: 'Use 100% cotton clothing and bedding. Avoid wool, synthetic fabrics, and rough textures. Remove tags and avoid tight-fitting clothes that can irritate the skin.',
        icon: 'shirt-outline',
      },
      {
        stepNumber: 4,
        title: 'Avoid Triggers',
        body: 'Common triggers include harsh soaps, fragrances, cigarette smoke, heat, and sweating. Keep the room cool. Use fragrance-free laundry detergent. Avoid fabric softeners.',
        icon: 'warning-outline',
      },
      {
        stepNumber: 5,
        title: 'Prevent Scratching',
        body: 'Keep your baby\'s fingernails short and filed smooth. Use cotton mittens or sleeves if needed. If scratching is severe, ask your pediatrician about antihistamines or wet wrap therapy.',
        icon: 'hand-left-outline',
      },
    ],
  },
  {
    id: 'umbilical_cord_care',
    title: 'Umbilical Cord Stump Care',
    summary: 'How to clean and care for the umbilical cord stump until it falls off naturally.',
    category: 'Newborn Care',
    diseaseIds: ['umbilical_infection'],
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Keep It Clean and Dry',
        body: 'The most important rule: keep the stump dry. Fold the diaper down below the stump so it stays exposed to air. Do not cover it with the diaper or tight clothing.',
        icon: 'water-outline',
      },
      {
        stepNumber: 2,
        title: 'Give Sponge Baths Only',
        body: 'Do not submerge the stump in bath water until it falls off. Give sponge baths using a soft, damp cloth. Clean around the base gently if needed, and pat dry thoroughly.',
        icon: 'water-outline',
      },
      {
        stepNumber: 3,
        title: 'Allow Air Circulation',
        body: 'Expose the stump to air as much as possible. Air drying helps the stump dry out and fall off naturally, usually within 1-2 weeks. Do not pull or tug on the stump.',
        icon: 'sunny-outline',
      },
      {
        stepNumber: 4,
        title: 'Watch for Signs of Infection',
        body: 'Contact your pediatrician if you notice: spreading redness around the base, pus or foul-smelling discharge, bleeding that does not stop, or if the baby develops a fever.',
        icon: 'alert-circle-outline',
      },
      {
        stepNumber: 5,
        title: 'What to Expect When It Falls Off',
        body: 'The stump will turn from yellow-green to brown-black as it dries. It will fall off naturally, usually within 7-21 days. A small amount of blood-tinged discharge is normal when it separates. The belly button area should heal completely within a few more days.',
        icon: 'checkmark-circle-outline',
      },
    ],
  },
  {
    id: 'feeding_difficulty_care',
    title: 'Feeding Difficulty & Latching Tips',
    summary: 'Practical tips for managing feeding challenges including poor latch, thrush, and low milk intake.',
    category: 'Feeding',
    diseaseIds: ['thrush', 'dehydration'],
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Check Positioning',
        body: 'Ensure your baby is positioned properly: baby\'s belly facing yours, head in line with the body, nose level with the nipple. Use pillows to support your arms and bring baby to breast height.',
        icon: 'body-outline',
      },
      {
        stepNumber: 2,
        title: 'Watch for Hunger Cues',
        body: 'Feed when you see early hunger cues: rooting (turning head toward breast), lip-smacking, sucking on hands, or fussiness. Crying is a late hunger cue — try to feed before baby gets too upset.',
        icon: 'eye-outline',
      },
      {
        stepNumber: 3,
        title: 'Check for Oral Issues',
        body: 'Look inside your baby\'s mouth. White patches on the tongue, gums, or cheeks that do not wipe off could be thrush. A tight tongue-tie can also cause latching difficulty. Consult your pediatrician if you suspect either.',
        icon: 'search-outline',
      },
      {
        stepNumber: 4,
        title: 'Track Feeding and Output',
        body: 'Keep a simple log: how many feeds per day (8-12 is normal), duration of feeds, and number of wet/dirty diapers. This helps identify patterns and problems early.',
        icon: 'clipboard-outline',
      },
      {
        stepNumber: 5,
        title: 'When to Get Help',
        body: 'Contact a lactation consultant or pediatrician if: your baby is not waking to feed, has fewer than 6 wet diapers per day, is losing weight, or seems consistently frustrated at the breast/bottle.',
        icon: 'medkit-outline',
      },
    ],
  },
  {
    id: 'colic_management',
    title: 'Managing Infant Colic & Excessive Crying',
    summary: 'Soothing techniques and strategies for managing colic, including when to rule out other medical causes.',
    category: 'General Care',
    diseaseIds: ['colic'],
    estimatedMinutes: 4,
    steps: [
      {
        stepNumber: 1,
        title: 'Rule Out Basic Needs',
        body: 'Before assuming colic, check: is the baby hungry, wet, too hot/cold, or tired? Try feeding, changing, or adjusting the room temperature. Sometimes the solution is simpler than you think.',
        icon: 'checkmark-circle-outline',
      },
      {
        stepNumber: 2,
        title: 'Use Gentle Motion',
        body: 'Rock your baby gently in your arms, use a baby swing, or go for a walk with the baby in a carrier or stroller. Rhythmic motion is very soothing for most babies. Avoid vigorous shaking — always support the head and neck.',
        icon: 'walk-outline',
      },
      {
        stepNumber: 3,
        title: 'Try White Noise',
        body: 'White noise machines, fans, running water, or even a static radio station can help calm a colicky baby. The sound should be about as loud as a shower — loud enough to be heard over the crying.',
        icon: 'volume-medium-outline',
      },
      {
        stepNumber: 4,
        title: 'Burp During and After Feeds',
        body: 'Burp your baby after every 30-60 ml (1-2 oz) of feeding. Hold upright against your shoulder or sit them on your lap and support the chest and head. Gentle pats on the back help release trapped gas.',
        icon: 'nutrition-outline',
      },
      {
        stepNumber: 5,
        title: 'Take Care of Yourself Too',
        body: 'Colic is exhausting for parents. It is okay to put the baby down in a safe place (like the crib) and take a 5-10 minute break. Ask for help from family or friends. Colic usually resolves by 3-4 months.',
        icon: 'heart-outline',
      },
    ],
  },
  {
    id: 'thrush_care',
    title: 'Oral Thrush Treatment & Prevention',
    summary: 'How to identify and treat oral thrush, including medication application and preventing reinfection.',
    category: 'Feeding',
    diseaseIds: ['thrush'],
    estimatedMinutes: 3,
    steps: [
      {
        stepNumber: 1,
        title: 'Identify the Signs',
        body: 'Look for white, cottage-cheese-like patches on the tongue, inner cheeks, gums, or roof of the mouth. Unlike milk residue, these patches do not wipe off easily and may bleed slightly if scraped.',
        icon: 'search-outline',
      },
      {
        stepNumber: 2,
        title: 'Apply Antifungal Drops',
        body: 'Your pediatrician will prescribe antifungal oral drops (usually nystatin). Use a dropper to apply the medication to the white patches and inside the cheeks. Give after feeds and wait 5-10 minutes before offering more milk.',
        icon: 'medkit-outline',
      },
      {
        stepNumber: 3,
        title: 'Sterilize Feeding Items',
        body: 'Boil bottle nipples, pacifiers, and breast pump parts for 5 minutes daily. Replace them if they show signs of wear. This prevents reinfection. Wash your hands thoroughly before and after feeding.',
        icon: 'water-outline',
      },
      {
        stepNumber: 4,
        title: 'Treat Nipple Thrush (If Breastfeeding)',
        body: 'If you are breastfeeding, check your nipples for signs of thrush: itchy, red, cracked, or sore nipples. Ask your doctor about antifungal cream for your nipples. You can continue breastfeeding during treatment.',
        icon: 'heart-outline',
      },
      {
        stepNumber: 5,
        title: 'Complete the Full Course',
        body: 'Continue giving the medication for a few days after the white patches disappear. Stopping too early can cause the thrush to return. Follow up with your pediatrician if it does not improve.',
        icon: 'checkmark-circle-outline',
      },
    ],
  },
];

export function getCareGuide(id: string): CareGuide | undefined {
  return CARE_GUIDES.find((g) => g.id === id);
}

export function getCareGuidesByDisease(diseaseId: string): CareGuide[] {
  return CARE_GUIDES.filter((g) => g.diseaseIds.includes(diseaseId));
}

export function searchCareGuides(query: string): CareGuide[] {
  const q = query.toLowerCase().trim();
  if (!q) return CARE_GUIDES;
  return CARE_GUIDES.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q),
  );
}

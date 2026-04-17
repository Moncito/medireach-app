import {
  Pill,
  Thermometer,
  Heart,
  Brain,
  Droplets,
  ShieldCheck,
  Wind,
  Flame,
  Eye,
  Baby,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface Medicine {
  slug: string;
  name: string;
  genericName: string;
  shortDescription: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  category: MedicineCategory;
  type: "otc" | "common-rx";
  uses: string[];
  dosage: {
    adults: string;
    children?: string;
    notes?: string;
  };
  sideEffects: {
    common: string[];
    serious: string[];
  };
  warnings: string[];
  interactions: string[];
  doNotUseIf: string[];
}

export type MedicineCategory =
  | "pain-relief"
  | "cold-flu"
  | "allergy"
  | "digestive"
  | "heart"
  | "mental-health"
  | "skin"
  | "vitamins";

export const MEDICINE_CATEGORIES: Record<MedicineCategory, { label: string; color: string }> = {
  "pain-relief": { label: "Pain Relief", color: "bg-accent-coral/10 text-accent-coral" },
  "cold-flu": { label: "Cold & Flu", color: "bg-blue-50 text-blue-600" },
  allergy: { label: "Allergy", color: "bg-amber-50 text-amber-600" },
  digestive: { label: "Digestive", color: "bg-accent-mint/10 text-accent-mint" },
  heart: { label: "Heart & Blood Pressure", color: "bg-red-50 text-red-600" },
  "mental-health": { label: "Mental Health", color: "bg-accent-lavender/10 text-accent-lavender" },
  skin: { label: "Skin Care", color: "bg-orange-50 text-orange-600" },
  vitamins: { label: "Vitamins & Supplements", color: "bg-green-50 text-green-600" },
};

/* ------------------------------------------------------------------ */
/*  Medicine Data                                                     */
/* ------------------------------------------------------------------ */

export const MEDICINES: Medicine[] = [
  /* ---- Ibuprofen ---- */
  {
    slug: "ibuprofen",
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    shortDescription: "NSAID for pain, inflammation, and fever reduction.",
    icon: Pill,
    iconBg: "bg-accent-coral/10",
    iconColor: "text-accent-coral",
    category: "pain-relief",
    type: "otc",
    uses: [
      "Mild to moderate pain (headaches, toothaches, muscle aches)",
      "Fever reduction",
      "Menstrual cramps",
      "Minor arthritis pain",
      "Inflammation reduction",
    ],
    dosage: {
      adults: "200–400 mg every 4–6 hours as needed. Max 1,200 mg/day (OTC).",
      children: "Dose by weight: 5–10 mg/kg every 6–8 hours. Consult pediatrician.",
      notes: "Take with food or milk to reduce stomach upset.",
    },
    sideEffects: {
      common: ["Stomach upset", "Nausea", "Dizziness", "Mild headache"],
      serious: [
        "Stomach bleeding or ulcers",
        "Kidney problems (prolonged use)",
        "Allergic reaction (rash, swelling, difficulty breathing)",
        "Increased risk of heart attack or stroke (long-term use)",
      ],
    },
    warnings: [
      "Do not take for more than 10 days without consulting a doctor",
      "Avoid if you have a history of stomach ulcers",
      "Can increase blood pressure",
      "May interact with blood thinners",
    ],
    interactions: [
      "Aspirin — may reduce aspirin's heart-protective effects",
      "Blood thinners (warfarin) — increased bleeding risk",
      "ACE inhibitors — reduced blood pressure effects",
      "Lithium — increased lithium levels",
      "Methotrexate — increased toxicity risk",
    ],
    doNotUseIf: [
      "Allergic to NSAIDs (aspirin, naproxen)",
      "History of stomach bleeding or ulcers",
      "Severe kidney or liver disease",
      "Third trimester of pregnancy",
      "Just before or after heart bypass surgery (CABG)",
    ],
  },

  /* ---- Acetaminophen ---- */
  {
    slug: "acetaminophen",
    name: "Acetaminophen (Tylenol)",
    genericName: "Acetaminophen / Paracetamol",
    shortDescription: "Pain reliever and fever reducer; easier on the stomach than NSAIDs.",
    icon: Thermometer,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    category: "pain-relief",
    type: "otc",
    uses: [
      "Headaches and migraines",
      "Fever reduction",
      "Toothaches",
      "Muscle aches and backaches",
      "Cold and flu symptoms",
    ],
    dosage: {
      adults: "500–1,000 mg every 4–6 hours. Max 3,000 mg/day.",
      children: "Dose by weight: 10–15 mg/kg every 4–6 hours. Use children's formulation.",
      notes: "Do NOT exceed daily maximum — liver damage risk. Avoid with alcohol.",
    },
    sideEffects: {
      common: ["Generally well-tolerated at recommended doses"],
      serious: [
        "Liver damage (overdose or chronic use)",
        "Severe skin reactions (rare — Stevens-Johnson syndrome)",
        "Allergic reaction (rash, swelling)",
      ],
    },
    warnings: [
      "Leading cause of liver failure when overdosed — strictly follow dosing",
      "Many combination products contain acetaminophen — check ALL labels",
      "Avoid alcohol while taking (increases liver damage risk)",
      "Do not take for more than 10 days without medical advice",
    ],
    interactions: [
      "Alcohol — greatly increases liver damage risk",
      "Warfarin — may increase bleeding risk with regular use",
      "Isoniazid (TB medicine) — increased liver toxicity",
      "Other acetaminophen-containing products — risk of accidental overdose",
    ],
    doNotUseIf: [
      "Severe liver disease",
      "Alcohol use disorder (heavy drinking)",
      "Known allergy to acetaminophen",
    ],
  },

  /* ---- Aspirin ---- */
  {
    slug: "aspirin",
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid (ASA)",
    shortDescription: "NSAID for pain, fever, inflammation, and heart attack prevention.",
    icon: Heart,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    category: "heart",
    type: "otc",
    uses: [
      "Pain relief (headaches, toothaches, muscle pain)",
      "Fever reduction",
      "Anti-inflammatory",
      "Heart attack and stroke prevention (low-dose, doctor-prescribed)",
      "Blood clot prevention",
    ],
    dosage: {
      adults: "325–650 mg every 4–6 hours for pain/fever. Low-dose: 81 mg/day for heart health.",
      children: "NOT recommended for children under 18 (Reye's syndrome risk).",
      notes: "Take with food. Low-dose aspirin should only be used under medical supervision.",
    },
    sideEffects: {
      common: ["Stomach upset", "Heartburn", "Nausea"],
      serious: [
        "Stomach bleeding or ulcers",
        "Allergic reaction (asthma-like symptoms)",
        "Tinnitus (ringing in ears) at high doses",
        "Increased bleeding time",
      ],
    },
    warnings: [
      "Do NOT give to children or teens — risk of Reye's syndrome",
      "Stop taking 7 days before surgery (bleeding risk)",
      "Can worsen asthma in sensitive individuals",
      "Low-dose aspirin: do not stop suddenly without doctor's advice",
    ],
    interactions: [
      "Ibuprofen — may reduce aspirin's cardioprotective effect",
      "Blood thinners (warfarin, heparin) — increased bleeding risk",
      "Methotrexate — increased toxicity",
      "SSRIs (antidepressants) — increased bleeding risk",
      "Alcohol — increased stomach bleeding risk",
    ],
    doNotUseIf: [
      "Under 18 years old (Reye's syndrome risk)",
      "Bleeding disorders (hemophilia)",
      "Active stomach ulcer",
      "Aspirin or NSAID allergy",
      "Third trimester of pregnancy",
    ],
  },

  /* ---- Diphenhydramine ---- */
  {
    slug: "diphenhydramine",
    name: "Diphenhydramine (Benadryl)",
    genericName: "Diphenhydramine HCl",
    shortDescription: "Antihistamine for allergies, itching, and sleep aid.",
    icon: Wind,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    category: "allergy",
    type: "otc",
    uses: [
      "Allergic reactions (hives, itching, runny nose)",
      "Hay fever / seasonal allergies",
      "Sleep aid (short-term)",
      "Motion sickness",
      "Mild allergic skin reactions",
    ],
    dosage: {
      adults: "25–50 mg every 4–6 hours. Max 300 mg/day.",
      children: "Ages 6–11: 12.5–25 mg every 4–6 hours. Under 6: consult pediatrician.",
      notes: "Causes drowsiness — do not drive or operate machinery.",
    },
    sideEffects: {
      common: ["Drowsiness", "Dry mouth", "Dizziness", "Blurred vision", "Constipation"],
      serious: [
        "Difficulty urinating",
        "Fast or irregular heartbeat",
        "Confusion (especially in elderly)",
        "Seizures (overdose)",
      ],
    },
    warnings: [
      "Causes significant drowsiness — avoid driving",
      "Not recommended for elderly (increased fall risk, confusion)",
      "Do not combine with alcohol or sedatives",
      "Not for long-term use as a sleep aid",
    ],
    interactions: [
      "Alcohol — excessive drowsiness",
      "Sedatives/sleeping pills — compounded sedation",
      "MAO inhibitors — dangerous interaction",
      "Other antihistamines — overdose risk",
      "Anticholinergic drugs — increased side effects",
    ],
    doNotUseIf: [
      "Glaucoma (narrow-angle)",
      "Enlarged prostate with urinary retention",
      "Currently taking MAO inhibitors",
      "Severe breathing problems (emphysema, chronic bronchitis)",
    ],
  },

  /* ---- Cetirizine ---- */
  {
    slug: "cetirizine",
    name: "Cetirizine (Zyrtec)",
    genericName: "Cetirizine HCl",
    shortDescription: "Non-drowsy antihistamine for allergy relief.",
    icon: ShieldCheck,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    category: "allergy",
    type: "otc",
    uses: [
      "Seasonal allergies (pollen, grass)",
      "Year-round allergies (dust, pet dander)",
      "Hives (urticaria)",
      "Itchy/watery eyes",
      "Runny nose and sneezing",
    ],
    dosage: {
      adults: "10 mg once daily.",
      children: "Ages 6+: 5–10 mg once daily. Ages 2–5: 2.5 mg once or twice daily.",
      notes: "Can be taken with or without food. May cause mild drowsiness in some people.",
    },
    sideEffects: {
      common: ["Mild drowsiness", "Dry mouth", "Fatigue", "Headache"],
      serious: [
        "Severe allergic reaction (rare — difficulty breathing, swelling)",
        "Difficulty urinating",
        "Vision changes",
      ],
    },
    warnings: [
      "Less drowsy than diphenhydramine, but may still cause mild sedation",
      "Use caution when driving until you know how it affects you",
      "Reduce dose if kidney impairment",
    ],
    interactions: [
      "Alcohol — increased drowsiness",
      "Sedatives — increased sedation",
      "Theophylline — may slightly decrease cetirizine clearance",
    ],
    doNotUseIf: [
      "Severe kidney disease (without dose adjustment)",
      "Known allergy to cetirizine or hydroxyzine",
    ],
  },

  /* ---- Omeprazole ---- */
  {
    slug: "omeprazole",
    name: "Omeprazole (Prilosec)",
    genericName: "Omeprazole",
    shortDescription: "Proton pump inhibitor for heartburn and acid reflux.",
    icon: Flame,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    category: "digestive",
    type: "otc",
    uses: [
      "Frequent heartburn (2+ days per week)",
      "Gastroesophageal reflux disease (GERD)",
      "Stomach ulcers (with medical supervision)",
      "Erosive esophagitis",
      "Acid-related stomach pain",
    ],
    dosage: {
      adults: "20 mg once daily, 30 minutes before breakfast. 14-day course for OTC use.",
      children: "Only under medical supervision. Dose varies by weight.",
      notes: "Swallow tablet whole — do not crush or chew. Do not use OTC for more than 14 days without a doctor.",
    },
    sideEffects: {
      common: ["Headache", "Stomach pain", "Nausea", "Diarrhea", "Gas"],
      serious: [
        "Vitamin B12 deficiency (long-term use)",
        "Magnesium deficiency (long-term)",
        "Increased fracture risk (hip, wrist, spine — long-term)",
        "Kidney problems (rare)",
        "C. difficile infection risk",
      ],
    },
    warnings: [
      "Not for immediate heartburn relief — takes 1–4 days to work fully",
      "Do not use OTC version for more than 14 days / 3 times per year",
      "Long-term use requires medical supervision",
      "May mask symptoms of stomach cancer",
    ],
    interactions: [
      "Clopidogrel (Plavix) — reduced effectiveness",
      "Methotrexate — increased levels",
      "St. John's Wort — reduced omeprazole levels",
      "Iron and B12 supplements — reduced absorption",
      "Diazepam — increased levels",
    ],
    doNotUseIf: [
      "Known allergy to PPIs",
      "Taking rilpivirine-containing HIV medications",
      "Liver disease (without dose adjustment)",
    ],
  },

  /* ---- Loperamide ---- */
  {
    slug: "loperamide",
    name: "Loperamide (Imodium)",
    genericName: "Loperamide HCl",
    shortDescription: "Anti-diarrheal medication for acute and chronic diarrhea.",
    icon: Droplets,
    iconBg: "bg-accent-mint/10",
    iconColor: "text-accent-mint",
    category: "digestive",
    type: "otc",
    uses: [
      "Acute diarrhea",
      "Traveler's diarrhea",
      "Chronic diarrhea (IBS-related)",
      "Reducing stool volume (ileostomy patients)",
    ],
    dosage: {
      adults: "4 mg initially, then 2 mg after each loose stool. Max 8 mg/day (OTC).",
      children: "Not for children under 2. Ages 2–5: consult doctor. Ages 6–11: 2 mg after first loose stool, then 1 mg after each subsequent. Max 6 mg/day.",
      notes: "Drink plenty of fluids to prevent dehydration. Stop use if no improvement in 48 hours.",
    },
    sideEffects: {
      common: ["Constipation", "Dizziness", "Nausea", "Stomach cramps"],
      serious: [
        "Severe constipation or bloating",
        "Heart rhythm problems (overdose)",
        "Paralytic ileus (bowel obstruction)",
        "Toxic megacolon (in inflammatory bowel disease)",
      ],
    },
    warnings: [
      "Do NOT exceed recommended dose — cardiac risk at high doses",
      "Do not use if diarrhea has blood or fever (may indicate bacterial infection)",
      "Stop if no improvement after 48 hours",
      "Not a substitute for proper hydration — drink fluids",
    ],
    interactions: [
      "Ritonavir — may increase loperamide levels",
      "Quinidine — increased loperamide absorption",
      "Gemfibrozil — increased loperamide levels",
    ],
    doNotUseIf: [
      "Bloody or black stool",
      "Fever above 101.3°F (38.5°C) with diarrhea",
      "Acute dysentery",
      "C. difficile colitis",
      "Children under 2 years old",
    ],
  },

  /* ---- Hydrocortisone Cream ---- */
  {
    slug: "hydrocortisone",
    name: "Hydrocortisone Cream",
    genericName: "Hydrocortisone (topical)",
    shortDescription: "Mild topical corticosteroid for itching, rashes, and skin inflammation.",
    icon: Flame,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    category: "skin",
    type: "otc",
    uses: [
      "Eczema and dermatitis",
      "Insect bite reactions",
      "Poison ivy / oak rashes",
      "Minor skin irritation and itching",
      "Allergic skin reactions",
    ],
    dosage: {
      adults: "Apply thin layer to affected area 1–4 times daily. OTC: 0.5%–1% strength.",
      children: "Use sparingly on children. Not for babies under 2 without doctor's advice.",
      notes: "Rub in gently. Do not cover with bandages unless directed. Use for shortest time needed.",
    },
    sideEffects: {
      common: ["Mild burning or stinging on application", "Skin dryness", "Itching at application site"],
      serious: [
        "Skin thinning (prolonged use)",
        "Stretch marks (prolonged use on large areas)",
        "Skin discoloration",
        "Worsening of skin infections",
      ],
    },
    warnings: [
      "Do not use on the face for more than 5 days without medical advice",
      "Do not use on broken, infected, or deeply wounded skin",
      "Prolonged use can thin the skin",
      "Not for acne, rosacea, or perioral dermatitis",
    ],
    interactions: [
      "Other topical corticosteroids — additive thinning risk",
      "Generally minimal systemic interactions for OTC topical use",
    ],
    doNotUseIf: [
      "Skin infections (fungal, viral, or bacterial without appropriate treatment)",
      "Acne or rosacea",
      "On open wounds or deeply broken skin",
      "Around the eyes (without doctor's direction)",
    ],
  },

  /* ---- Melatonin ---- */
  {
    slug: "melatonin",
    name: "Melatonin",
    genericName: "Melatonin",
    shortDescription: "Natural sleep hormone supplement for insomnia and jet lag.",
    icon: Brain,
    iconBg: "bg-accent-lavender/10",
    iconColor: "text-accent-lavender",
    category: "vitamins",
    type: "otc",
    uses: [
      "Difficulty falling asleep",
      "Jet lag recovery",
      "Shift work sleep disorder",
      "Sleep schedule regulation",
      "Short-term insomnia",
    ],
    dosage: {
      adults: "0.5–5 mg, 30–60 minutes before bedtime. Start with lowest effective dose.",
      children: "Only under pediatrician guidance. Typically 0.5–1 mg.",
      notes: "More is NOT better — lower doses (0.5–3 mg) are often more effective. Not regulated as a drug in the US (supplement).",
    },
    sideEffects: {
      common: ["Daytime drowsiness", "Headache", "Dizziness", "Vivid dreams"],
      serious: [
        "Morning grogginess (dose too high)",
        "Mood changes",
        "Hormonal effects with long-term use (theoretical)",
      ],
    },
    warnings: [
      "Not FDA-regulated as a drug — quality varies between brands",
      "Can worsen depression symptoms in some people",
      "May affect blood sugar — diabetics should monitor",
      "Do not drive or operate machinery after taking",
    ],
    interactions: [
      "Blood thinners (warfarin) — may increase bleeding risk",
      "Diabetes medications — may affect blood sugar",
      "Immunosuppressants — may interfere",
      "Sedatives/sleep aids — compounded drowsiness",
      "Caffeine — may reduce effectiveness",
    ],
    doNotUseIf: [
      "Autoimmune disease (without doctor's approval)",
      "Pregnancy or breastfeeding (insufficient safety data)",
      "Seizure disorder (may lower threshold)",
    ],
  },

  /* ---- Vitamin D ---- */
  {
    slug: "vitamin-d",
    name: "Vitamin D3",
    genericName: "Cholecalciferol (Vitamin D3)",
    shortDescription: "Essential vitamin for bone health, immunity, and mood.",
    icon: ShieldCheck,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    category: "vitamins",
    type: "otc",
    uses: [
      "Vitamin D deficiency prevention and treatment",
      "Bone health (calcium absorption)",
      "Immune system support",
      "Mood regulation (seasonal affective disorder)",
      "Muscle function support",
    ],
    dosage: {
      adults: "600–2,000 IU daily for most adults. Up to 4,000 IU/day considered safe upper limit.",
      children: "400–1,000 IU daily depending on age. Breastfed infants: 400 IU/day.",
      notes: "Take with a meal containing fat for better absorption. Get blood levels checked if supplementing high doses.",
    },
    sideEffects: {
      common: ["Generally well-tolerated at recommended doses"],
      serious: [
        "Hypercalcemia (very high doses) — nausea, vomiting, weakness",
        "Kidney stones (excessive supplementation)",
        "Kidney damage (prolonged excessive use)",
      ],
    },
    warnings: [
      "Do not exceed 4,000 IU/day without medical supervision",
      "High doses can cause dangerously high calcium levels",
      "Get blood level (25-OH Vitamin D) tested before high-dose supplementation",
      "Some medical conditions require adjusted dosing",
    ],
    interactions: [
      "Thiazide diuretics — may increase calcium levels",
      "Steroids (corticosteroids) — may reduce vitamin D absorption",
      "Weight loss drugs (orlistat) — reduced absorption",
      "Cholestyramine — reduced absorption",
    ],
    doNotUseIf: [
      "Hypercalcemia (high calcium levels)",
      "Kidney disease (without dose guidance)",
      "Sarcoidosis or other granulomatous diseases",
    ],
  },

  /* ---- Pseudoephedrine ---- */
  {
    slug: "pseudoephedrine",
    name: "Pseudoephedrine (Sudafed)",
    genericName: "Pseudoephedrine HCl",
    shortDescription: "Nasal decongestant for stuffy nose from colds or allergies.",
    icon: Wind,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    category: "cold-flu",
    type: "otc",
    uses: [
      "Nasal congestion (common cold)",
      "Sinus congestion",
      "Ear congestion (eustachian tube)",
      "Allergic rhinitis congestion",
    ],
    dosage: {
      adults: "60 mg every 4–6 hours. Max 240 mg/day. Extended-release: 120 mg every 12 hours.",
      children: "Ages 6–11: 30 mg every 4–6 hours. Under 6: consult doctor.",
      notes: "Sold behind pharmacy counter (no prescription needed, but ID required in US). Take with water.",
    },
    sideEffects: {
      common: ["Insomnia", "Nervousness", "Restlessness", "Dry mouth"],
      serious: [
        "Increased blood pressure",
        "Rapid or irregular heartbeat",
        "Difficulty urinating",
        "Severe headache",
      ],
    },
    warnings: [
      "Can significantly raise blood pressure",
      "Do not take within 2 weeks of MAO inhibitors",
      "May cause insomnia — take last dose in the afternoon",
      "Not for prolonged use (more than 7 days)",
    ],
    interactions: [
      "MAO inhibitors — dangerously high blood pressure",
      "Beta-blockers — reduced effectiveness",
      "Methyldopa — reduced blood pressure control",
      "Caffeine — increased stimulant effects",
      "Other decongestants — overdose risk",
    ],
    doNotUseIf: [
      "Severe or uncontrolled high blood pressure",
      "Heart disease",
      "Overactive thyroid (hyperthyroidism)",
      "Currently taking MAO inhibitors",
      "Urinary retention or prostate problems",
    ],
  },

  /* ---- Dextromethorphan ---- */
  {
    slug: "dextromethorphan",
    name: "Dextromethorphan (Robitussin DM)",
    genericName: "Dextromethorphan HBr",
    shortDescription: "Cough suppressant for dry, non-productive coughs.",
    icon: Wind,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    category: "cold-flu",
    type: "otc",
    uses: [
      "Dry, non-productive cough",
      "Cough due to common cold",
      "Cough due to minor throat irritation",
    ],
    dosage: {
      adults: "10–20 mg every 4 hours, or 30 mg every 6–8 hours. Max 120 mg/day.",
      children: "Ages 4–11: 5–10 mg every 4 hours. Under 4: do not use.",
      notes: "Do NOT suppress productive (wet, mucus-producing) coughs. Many combo products contain this — check labels.",
    },
    sideEffects: {
      common: ["Drowsiness", "Dizziness", "Nausea", "Stomach upset"],
      serious: [
        "Serotonin syndrome (with SSRIs — confusion, rapid heart rate, fever)",
        "Breathing problems (overdose)",
        "Hallucinations (abuse/overdose)",
      ],
    },
    warnings: [
      "Do NOT use to suppress productive coughs (you need to cough up mucus)",
      "HIGH abuse potential — keep away from teens",
      "Check combination products to avoid double-dosing",
      "Do not use for chronic cough (smoker's cough, asthma) without doctor",
    ],
    interactions: [
      "SSRIs/SNRIs — risk of serotonin syndrome",
      "MAO inhibitors — dangerous interaction (wait 14 days)",
      "Sedatives — increased drowsiness",
      "Quinidine — increased DXM levels",
    ],
    doNotUseIf: [
      "Currently taking MAO inhibitors",
      "Productive (wet) cough",
      "Chronic cough from smoking or asthma",
      "Children under 4 years old",
    ],
  },

  /* ---- Loratadine ---- */
  {
    slug: "loratadine",
    name: "Loratadine (Claritin)",
    genericName: "Loratadine",
    shortDescription: "Non-drowsy antihistamine for allergy symptoms.",
    icon: Eye,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    category: "allergy",
    type: "otc",
    uses: [
      "Seasonal allergies (hay fever)",
      "Year-round allergies (dust mites, mold, pet dander)",
      "Hives (chronic urticaria)",
      "Itchy/watery eyes",
      "Sneezing and runny nose",
    ],
    dosage: {
      adults: "10 mg once daily.",
      children: "Ages 6+: 10 mg once daily. Ages 2–5: 5 mg once daily (syrup). Under 2: consult doctor.",
      notes: "Truly non-drowsy for most people. Can be taken with or without food.",
    },
    sideEffects: {
      common: ["Headache", "Dry mouth", "Fatigue (uncommon)"],
      serious: [
        "Severe allergic reaction (very rare)",
        "Rapid or irregular heartbeat (very rare / overdose)",
      ],
    },
    warnings: [
      "Reduce dose with severe liver disease",
      "Results may take 1–3 hours to be noticed",
      "Less effective than cetirizine for some people",
    ],
    interactions: [
      "Erythromycin — may increase loratadine levels",
      "Ketoconazole — may increase loratadine levels",
      "Cimetidine — may increase loratadine levels",
      "Generally well-tolerated with most medications",
    ],
    doNotUseIf: [
      "Known allergy to loratadine or desloratadine",
      "Severe liver disease (without dose adjustment)",
    ],
  },

  /* ---- Calcium Carbonate (Tums) ---- */
  {
    slug: "calcium-carbonate",
    name: "Calcium Carbonate (Tums)",
    genericName: "Calcium Carbonate",
    shortDescription: "Antacid for fast heartburn and indigestion relief.",
    icon: Droplets,
    iconBg: "bg-accent-mint/10",
    iconColor: "text-accent-mint",
    category: "digestive",
    type: "otc",
    uses: [
      "Heartburn",
      "Acid indigestion",
      "Sour stomach",
      "Upset stomach from food",
      "Calcium supplementation (secondary use)",
    ],
    dosage: {
      adults: "500–1,000 mg (1–2 tablets) as needed. Max 7,500 mg/day for regular strength.",
      children: "Ages 2–11: half an adult dose or as directed. Under 2: consult doctor.",
      notes: "Chew tablets thoroughly before swallowing. Fast-acting but short duration (1–3 hours).",
    },
    sideEffects: {
      common: ["Constipation", "Gas", "Bloating"],
      serious: [
        "Kidney stones (excessive/prolonged use)",
        "Milk-alkali syndrome (very high doses — nausea, vomiting, confusion)",
        "Hypercalcemia (excessive use)",
      ],
    },
    warnings: [
      "Not for frequent heartburn — see a doctor if using more than 2 weeks",
      "High calcium intake can cause kidney stones",
      "May interfere with absorption of other medications — take 2 hours apart",
      "Rebound acid production with frequent use",
    ],
    interactions: [
      "Tetracycline/fluoroquinolone antibiotics — reduced absorption (take 2 hrs apart)",
      "Levothyroxine (thyroid) — reduced absorption",
      "Iron supplements — reduced absorption",
      "Bisphosphonates (osteoporosis drugs) — reduced absorption",
    ],
    doNotUseIf: [
      "Hypercalcemia",
      "Kidney disease (without medical guidance)",
      "Taking medications that interact with calcium (without timing separation)",
    ],
  },

  /* ---- Children's Acetaminophen ---- */
  {
    slug: "childrens-acetaminophen",
    name: "Children's Acetaminophen",
    genericName: "Acetaminophen (Pediatric)",
    shortDescription: "Pediatric pain reliever and fever reducer in liquid/chewable form.",
    icon: Baby,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    category: "pain-relief",
    type: "otc",
    uses: [
      "Childhood fever reduction",
      "Teething pain",
      "Headaches in children",
      "Sore throat pain",
      "Post-vaccination fever/pain",
    ],
    dosage: {
      adults: "N/A — pediatric formulation",
      children: "Strictly by weight: 10–15 mg/kg every 4–6 hours. Max 5 doses/day. Use syringe for accurate dosing.",
      notes: "ALWAYS dose by weight, not age. Use the measuring device provided. Do NOT use adult formulations for children.",
    },
    sideEffects: {
      common: ["Generally well-tolerated at correct doses"],
      serious: [
        "Liver damage (overdose — MOST COMMON childhood poisoning)",
        "Allergic reaction (rash, difficulty breathing)",
        "Severe skin reactions (extremely rare)",
      ],
    },
    warnings: [
      "OVERDOSE IS DANGEROUS — always use weight-based dosing",
      "Many children's cold products contain acetaminophen — check ALL labels",
      "Do not give more than 5 doses in 24 hours",
      "Store out of children's reach — accidental overdose is a leading poisoning cause",
      "Do not use adult or extra-strength formulations for children",
    ],
    interactions: [
      "Other acetaminophen-containing products (cold/flu combos) — overdose risk",
      "Generally safe with most pediatric medications",
    ],
    doNotUseIf: [
      "Known allergy to acetaminophen",
      "Liver disease in the child",
      "Already taking another acetaminophen-containing product",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                  */
/* ------------------------------------------------------------------ */

export function getMedicineBySlug(slug: string): Medicine | undefined {
  return MEDICINES.find((m) => m.slug === slug);
}

export function getMedicinesByCategory(category: MedicineCategory): Medicine[] {
  return MEDICINES.filter((m) => m.category === category);
}

export const MEDICINE_DISCLAIMER =
  "This information is for educational purposes only and does not replace professional medical advice. Always consult a pharmacist or healthcare provider before starting, stopping, or changing any medication.";

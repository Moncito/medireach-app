import {
  Flame,
  Droplets,
  Bone,
  Wind,
  Heart,
  Bug,
  Zap,
  Thermometer,
  AlertTriangle,
  Baby,
  Eye,
  Pill,
  type LucideIcon,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

export interface FirstAidStep {
  instruction: string;
  warning?: string;
  tip?: string;
}

export interface FirstAidGuide {
  slug: string;
  title: string;
  shortDescription: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  category: Category;
  severity: "info" | "warning" | "critical";
  whenToCall911: string[];
  steps: FirstAidStep[];
  doNot: string[];
  supplies?: string[];
}

export type Category =
  | "injuries"
  | "environmental"
  | "medical"
  | "pediatric";

export const CATEGORIES: Record<Category, { label: string; color: string }> = {
  injuries: { label: "Injuries", color: "bg-accent-coral/10 text-accent-coral" },
  environmental: { label: "Environmental", color: "bg-accent-mint/10 text-accent-mint" },
  medical: { label: "Medical", color: "bg-accent-lavender/10 text-accent-lavender" },
  pediatric: { label: "Pediatric", color: "bg-amber-50 text-amber-600" },
};

/* ------------------------------------------------------------------ */
/*  Guide Data                                                        */
/* ------------------------------------------------------------------ */

export const FIRST_AID_GUIDES: FirstAidGuide[] = [
  /* ---- Burns ---- */
  {
    slug: "burns",
    title: "Burns & Scalds",
    shortDescription:
      "How to treat minor to moderate burns from heat, steam, or hot liquids.",
    icon: Flame,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    category: "injuries",
    severity: "warning",
    whenToCall911: [
      "Burns covering a large area (bigger than the palm of the hand)",
      "Burns on the face, hands, feet, genitals, or over joints",
      "Deep burns that appear white, brown, or black",
      "Burns caused by chemicals or electricity",
      "The person is an infant, elderly, or has a chronic illness",
    ],
    steps: [
      {
        instruction:
          "Remove the person from the source of the burn. If clothing is on fire, have them stop, drop, and roll.",
        warning: "Do NOT remove clothing stuck to the burn.",
      },
      {
        instruction:
          "Cool the burn under cool (not ice-cold) running water for at least 10–20 minutes. This is the single most important first aid step.",
        tip: "Even if the burn happened a while ago, cooling still helps if done within 3 hours.",
      },
      {
        instruction:
          "Remove rings, watches, or tight clothing near the burn area before swelling starts.",
      },
      {
        instruction:
          "After cooling, cover the burn loosely with a clean, non-stick bandage or cling wrap. This protects against infection.",
        tip: "Cling wrap is ideal — lay it over the burn, don't wrap tightly.",
      },
      {
        instruction:
          "Give over-the-counter pain relief (ibuprofen or paracetamol) if needed.",
      },
      {
        instruction:
          "Keep the burned area elevated if possible to reduce swelling.",
      },
    ],
    doNot: [
      "Do NOT apply ice directly to the burn",
      "Do NOT apply butter, toothpaste, or home remedies",
      "Do NOT pop blisters — they protect against infection",
      "Do NOT use fluffy cotton or adhesive bandages directly on the burn",
    ],
    supplies: ["Cool running water", "Cling wrap or non-stick bandage", "Pain relievers"],
  },

  /* ---- Cuts & Wounds ---- */
  {
    slug: "cuts-and-wounds",
    title: "Cuts & Wounds",
    shortDescription:
      "Stop bleeding and prevent infection from cuts, scrapes, and minor wounds.",
    icon: Droplets,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    category: "injuries",
    severity: "warning",
    whenToCall911: [
      "Bleeding that won't stop after 10 minutes of firm pressure",
      "Deep wounds where fat, muscle, or bone is visible",
      "Wounds caused by an animal or human bite",
      "Wounds with embedded objects (glass, metal)",
      "Signs of infection: increasing redness, warmth, swelling, or pus",
    ],
    steps: [
      {
        instruction:
          "Wash your hands thoroughly or put on clean gloves to prevent infection.",
      },
      {
        instruction:
          "Apply firm, direct pressure to the wound using a clean cloth or bandage. Maintain pressure for at least 10 minutes without peeking.",
        warning: "If blood soaks through, add more material on top — do NOT remove the first layer.",
      },
      {
        instruction:
          "Once bleeding stops, gently clean the wound with clean water. Remove any visible dirt or debris.",
        tip: "Tap water works well. Avoid hydrogen peroxide or alcohol directly on the wound — they can damage tissue.",
      },
      {
        instruction:
          "Apply a thin layer of antibiotic ointment (like Neosporin) if available.",
      },
      {
        instruction:
          "Cover the wound with a sterile bandage or adhesive strip. Change the dressing daily or whenever it gets wet or dirty.",
      },
      {
        instruction:
          "Watch for signs of infection over the next few days: redness spreading, increased pain, warmth, swelling, or fever.",
      },
    ],
    doNot: [
      "Do NOT use a tourniquet for minor cuts",
      "Do NOT pull out deeply embedded objects",
      "Do NOT blow on the wound",
      "Do NOT touch the wound with dirty hands",
    ],
    supplies: [
      "Clean cloth or gauze",
      "Clean water",
      "Antibiotic ointment",
      "Adhesive bandages or sterile dressings",
    ],
  },

  /* ---- Fractures ---- */
  {
    slug: "fractures",
    title: "Fractures & Sprains",
    shortDescription:
      "Stabilize suspected broken bones and sprains until medical help arrives.",
    icon: Bone,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    category: "injuries",
    severity: "critical",
    whenToCall911: [
      "The bone is visible through the skin (open fracture)",
      "The limb is numb, blue, or cold below the injury",
      "You suspect a fracture of the spine, pelvis, hip, or thigh",
      "The person cannot move the injured area at all",
      "There is significant deformity of the limb",
    ],
    steps: [
      {
        instruction:
          "Keep the person still and calm. Do NOT try to straighten or move the injured area.",
        warning: "Moving a fracture incorrectly can cause more damage.",
      },
      {
        instruction:
          "Immobilize the injured area. Use a splint if available — boards, rolled newspapers, or even a pillow can work. Secure with bandages or cloth strips.",
        tip: "Always splint in the position found. Include the joints above and below the fracture.",
      },
      {
        instruction:
          "Apply a cold pack wrapped in a cloth to the injured area for 15–20 minutes to reduce swelling.",
      },
      {
        instruction:
          "Elevate the injured area above heart level if possible (unless it causes more pain).",
      },
      {
        instruction:
          "For sprains, remember R.I.C.E.: Rest, Ice, Compression, Elevation.",
      },
      {
        instruction:
          "If there's an open wound with the fracture, cover it loosely with a clean dressing. Do not try to push bone back in.",
      },
    ],
    doNot: [
      "Do NOT try to realign the bone",
      "Do NOT move the person if a spinal injury is suspected",
      "Do NOT apply heat to a fresh injury",
      "Do NOT let the person put weight on the injured area",
    ],
    supplies: [
      "Splinting material (boards, magazines, pillows)",
      "Bandages or cloth strips",
      "Cold pack or ice wrapped in cloth",
    ],
  },

  /* ---- Choking ---- */
  {
    slug: "choking",
    title: "Choking",
    shortDescription:
      "Clear a blocked airway in adults using back blows and abdominal thrusts.",
    icon: Wind,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    category: "medical",
    severity: "critical",
    whenToCall911: [
      "The person cannot cough, speak, or breathe",
      "The person becomes unconscious",
      "Abdominal thrusts are not clearing the blockage",
      "The person is pregnant or obese (use chest thrusts instead)",
    ],
    steps: [
      {
        instruction:
          "If the person can cough forcefully, encourage them to keep coughing. Do not interfere — coughing is the body's best mechanism.",
      },
      {
        instruction:
          "If the person CANNOT cough, speak, or breathe: Stand behind them and give 5 sharp back blows between the shoulder blades using the heel of your hand.",
        tip: "Lean the person slightly forward while giving back blows.",
      },
      {
        instruction:
          "If back blows don't work: Perform the Heimlich maneuver. Stand behind the person, place your fist just above their belly button, grab it with your other hand, and give 5 quick upward thrusts.",
      },
      {
        instruction:
          "Alternate between 5 back blows and 5 abdominal thrusts until the object is dislodged or the person can breathe.",
      },
      {
        instruction:
          "If the person becomes unconscious, lower them to the ground carefully, call 911, and begin CPR. Check the mouth for the object before each rescue breath.",
        warning:
          "Do NOT do blind finger sweeps — only remove an object you can see.",
      },
    ],
    doNot: [
      "Do NOT slap the person on the back if they can still cough",
      "Do NOT give abdominal thrusts to infants under 1 year",
      "Do NOT try to reach into the throat to grab the object",
      "Do NOT give water to someone who is actively choking",
    ],
  },

  /* ---- CPR ---- */
  {
    slug: "cpr",
    title: "CPR (Cardiopulmonary Resuscitation)",
    shortDescription:
      "Life-saving technique when someone's heart stops. Every second counts.",
    icon: Heart,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
    category: "medical",
    severity: "critical",
    whenToCall911: [
      "Always call 911 FIRST (or have someone else call) before starting CPR",
      "The person is unresponsive and not breathing normally",
      "The person is unresponsive and not breathing normally (do not delay CPR to check for a pulse)",
    ],
    steps: [
      {
        instruction:
          "Check for responsiveness: Tap the person's shoulders firmly and shout 'Are you okay?' If no response, call 911 immediately (or have someone else call).",
      },
      {
        instruction:
          "Place the person on their back on a firm surface. Kneel beside their chest.",
      },
      {
        instruction:
          "Place the heel of one hand on the center of the chest (on the breastbone). Place your other hand on top and interlace your fingers.",
        tip: "Keep your arms straight and position your shoulders directly above your hands.",
      },
      {
        instruction:
          "Push hard and fast: Compress the chest at least 2 inches deep at a rate of 100–120 compressions per minute. Allow the chest to fully recoil between compressions.",
        tip: "Push to the beat of 'Stayin' Alive' by the Bee Gees — that's roughly the right tempo.",
      },
      {
        instruction:
          "If trained: After every 30 compressions, tilt the head back, lift the chin, and give 2 rescue breaths (1 second each). Watch for the chest to rise.",
      },
      {
        instruction:
          "Continue CPR until emergency services arrive, an AED is available, or the person starts breathing normally.",
        warning: "Do NOT stop CPR to check for a pulse — keep going until help arrives.",
      },
    ],
    doNot: [
      "Do NOT delay CPR to look for an AED — start compressions immediately",
      "Do NOT compress too slowly or too shallowly",
      "Do NOT interrupt compressions for more than 10 seconds",
      "Do NOT be afraid of hurting the person — broken ribs heal, cardiac arrest kills",
    ],
  },

  /* ---- Insect Bites & Stings ---- */
  {
    slug: "insect-bites-stings",
    title: "Insect Bites & Stings",
    shortDescription:
      "Treat bee stings, spider bites, and other insect encounters safely.",
    icon: Bug,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
    category: "environmental",
    severity: "info",
    whenToCall911: [
      "Signs of severe allergic reaction: swelling of face/throat, difficulty breathing, dizziness",
      "Sting inside the mouth or throat",
      "Multiple stings (more than 10–20)",
      "Known severe allergy to insect stings",
      "Symptoms of infection days after the sting",
    ],
    steps: [
      {
        instruction:
          "Move away from the area where the sting/bite occurred to avoid more stings.",
      },
      {
        instruction:
          "For bee stings: Remove the stinger as quickly as possible by scraping it sideways with a flat edge (credit card, fingernail). Don't squeeze it.",
        tip: "Speed matters more than technique — the sooner the stinger is out, the less venom is injected.",
      },
      {
        instruction:
          "Clean the area with soap and water.",
      },
      {
        instruction:
          "Apply a cold pack wrapped in cloth for 10–15 minutes to reduce swelling and pain.",
      },
      {
        instruction:
          "Take an antihistamine (like Benadryl) for itching and swelling. Apply hydrocortisone cream for local relief.",
      },
      {
        instruction:
          "If the person has a known allergy and carries an EpiPen, help them use it immediately and call 911.",
        warning: "Even after using an EpiPen, the person needs emergency medical care.",
      },
    ],
    doNot: [
      "Do NOT squeeze the stinger — this injects more venom",
      "Do NOT scratch the bite — it increases infection risk",
      "Do NOT apply mud or tobacco to the sting",
      "Do NOT ignore signs of allergic reaction",
    ],
    supplies: [
      "Soap and water",
      "Cold pack",
      "Antihistamine (Benadryl)",
      "Hydrocortisone cream",
      "EpiPen (if prescribed)",
    ],
  },

  /* ---- Heat Emergencies ---- */
  {
    slug: "heat-stroke-exhaustion",
    title: "Heat Stroke & Exhaustion",
    shortDescription:
      "Recognize and respond to heat-related illnesses before they become life-threatening.",
    icon: Thermometer,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
    category: "environmental",
    severity: "critical",
    whenToCall911: [
      "Body temperature above 103°F (39.4°C)",
      "Hot, red, dry skin with NO sweating",
      "Confusion, altered consciousness, or seizures",
      "Rapid pulse with throbbing headache",
      "The person loses consciousness",
    ],
    steps: [
      {
        instruction:
          "Move the person to a cool, shaded area or air-conditioned space immediately.",
      },
      {
        instruction:
          "Remove excess clothing and loosen tight garments.",
      },
      {
        instruction:
          "Cool the person rapidly: Apply cold wet cloths or ice packs to the neck, armpits, and groin. Fan the person while misting with cool water.",
        tip: "Neck, armpits, and groin are the most effective cooling spots because large blood vessels run close to the skin there.",
      },
      {
        instruction:
          "If the person is conscious and alert, give small sips of cool water. Add a pinch of salt if available.",
        warning: "Do NOT force fluids if the person is vomiting or not fully conscious.",
      },
      {
        instruction:
          "For heat exhaustion (heavy sweating, weakness, cold pale skin): Rest, cool down, and hydrate. It should improve within 30 minutes.",
      },
      {
        instruction:
          "For heat stroke (hot dry skin, confusion, high temperature): This is a medical emergency. Call 911 and cool aggressively while waiting.",
      },
    ],
    doNot: [
      "Do NOT give large amounts of water to drink quickly",
      "Do NOT give alcohol or caffeine",
      "Do NOT use rubbing alcohol to cool the skin",
      "Do NOT leave the person alone",
    ],
    supplies: [
      "Cool water",
      "Ice packs or cold cloths",
      "Fan or spray bottle",
    ],
  },

  /* ---- Electric Shock ---- */
  {
    slug: "electric-shock",
    title: "Electric Shock",
    shortDescription:
      "Safely respond to electrical injuries from household or environmental sources.",
    icon: Zap,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    category: "environmental",
    severity: "critical",
    whenToCall911: [
      "Any electric shock from a high-voltage source (power lines, industrial equipment)",
      "The person is unconscious or not breathing",
      "Visible burns at entry/exit points",
      "Irregular heartbeat or chest pain after the shock",
      "The person fell after being shocked",
    ],
    steps: [
      {
        instruction:
          "Do NOT touch the person if they are still in contact with the electrical source. Your first priority is your own safety.",
        warning: "You could become a victim too. Never approach downed power lines.",
      },
      {
        instruction:
          "Turn off the power source if you can do so safely (unplug, switch off breaker). If you can't, use a dry non-conductive object (wooden broom, rubber mat) to separate the person from the source.",
      },
      {
        instruction:
          "Once the person is free from the source, check for breathing and pulse. Begin CPR if needed.",
      },
      {
        instruction:
          "Look for both entry and exit burn wounds. There may be internal damage even if external burns look small.",
      },
      {
        instruction:
          "Cover any burns with a sterile, non-stick bandage. Do not apply ointments.",
      },
      {
        instruction:
          "Keep the person warm and lying down with legs elevated (unless they have a head, neck, or spinal injury).",
      },
    ],
    doNot: [
      "Do NOT touch the person while they're connected to the source",
      "Do NOT use metal or wet objects to separate them from the source",
      "Do NOT move the person if a spinal injury is suspected",
      "Do NOT underestimate the injury — internal damage may not be visible",
    ],
  },

  /* ---- Seizures ---- */
  {
    slug: "seizures",
    title: "Seizures",
    shortDescription:
      "Keep someone safe during a seizure and know when to call for help.",
    icon: AlertTriangle,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    category: "medical",
    severity: "warning",
    whenToCall911: [
      "Seizure lasts more than 5 minutes",
      "The person doesn't regain consciousness",
      "A second seizure follows quickly",
      "The person is pregnant, has diabetes, or is injured",
      "This is the person's first seizure",
      "The seizure happens in water",
    ],
    steps: [
      {
        instruction:
          "Stay calm and time the seizure. Note when it starts — if it lasts more than 5 minutes, call 911.",
      },
      {
        instruction:
          "Clear the area around the person. Move hard or sharp objects away to prevent injury.",
      },
      {
        instruction:
          "Place something soft under their head (folded jacket, pillow) to prevent head injury.",
      },
      {
        instruction:
          "Once the jerking stops, gently turn the person onto their side (recovery position). This keeps the airway clear.",
        tip: "The recovery position prevents choking if the person vomits.",
      },
      {
        instruction:
          "Stay with the person until they are fully conscious and aware. Speak calmly and reassuringly.",
      },
      {
        instruction:
          "After the seizure, the person may be confused or sleepy. This is normal. Help them rest in a safe place.",
      },
    ],
    doNot: [
      "Do NOT hold the person down or try to restrain their movements",
      "Do NOT put anything in their mouth (they cannot swallow their tongue)",
      "Do NOT give food, water, or pills until fully alert",
      "Do NOT attempt CPR during the seizure unless breathing stops afterward",
    ],
  },

  /* ---- Choking in Infants ---- */
  {
    slug: "infant-choking",
    title: "Infant Choking (Under 1 Year)",
    shortDescription:
      "Modified technique for clearing a blocked airway in babies and infants.",
    icon: Baby,
    iconBg: "bg-pink-50",
    iconColor: "text-pink-500",
    category: "pediatric",
    severity: "critical",
    whenToCall911: [
      "The infant cannot cry, cough, or breathe",
      "The infant turns blue or becomes limp",
      "Back blows and chest thrusts don't clear the blockage",
      "The infant becomes unconscious",
    ],
    steps: [
      {
        instruction:
          "Confirm the infant is choking: Can they cry or cough? If yes, let them cough — it's the most effective way to clear the airway.",
      },
      {
        instruction:
          "If the infant CANNOT cry, cough, or breathe: Lay the infant face-down along your forearm, with the head lower than the chest. Support the head and jaw with your hand.",
        tip: "Sit down and rest your forearm on your thigh for stability.",
      },
      {
        instruction:
          "Give 5 firm back blows between the shoulder blades using the heel of your hand.",
      },
      {
        instruction:
          "Turn the infant face-up on your other forearm. Give 5 chest thrusts using two fingers on the center of the breastbone, just below the nipple line.",
        warning: "Use chest thrusts, NOT abdominal thrusts (Heimlich) for infants.",
      },
      {
        instruction:
          "Alternate between 5 back blows and 5 chest thrusts until the object comes out or the infant starts coughing/crying.",
      },
      {
        instruction:
          "If the infant becomes unconscious, call 911 and begin infant CPR (30 compressions with 2 fingers, 2 gentle breaths).",
      },
    ],
    doNot: [
      "Do NOT use abdominal thrusts (Heimlich) on infants",
      "Do NOT do blind finger sweeps in the mouth",
      "Do NOT hold the infant upside down by the feet",
      "Do NOT give up — keep alternating back blows and chest thrusts",
    ],
  },

  /* ---- Eye Injuries ---- */
  {
    slug: "eye-injuries",
    title: "Eye Injuries",
    shortDescription:
      "Handle chemical splashes, foreign objects, and impacts to the eye safely.",
    icon: Eye,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
    category: "injuries",
    severity: "warning",
    whenToCall911: [
      "Chemical splash in the eye",
      "Object embedded in the eye",
      "Sudden vision loss or significant change in vision",
      "Blood visible in the eye",
      "Severe pain that doesn't improve with flushing",
    ],
    steps: [
      {
        instruction:
          "For chemical splashes: Immediately flush the eye with clean water for at least 15–20 minutes. Hold the eyelid open and let water run from the inner corner outward.",
        warning: "Speed is critical — start flushing immediately, don't waste time looking for eye wash.",
      },
      {
        instruction:
          "For small foreign objects (dust, eyelash): Try blinking several times. Pull the upper eyelid over the lower to stimulate tears. If visible, gently flush with water.",
      },
      {
        instruction:
          "For embedded objects: Do NOT try to remove them. Stabilize the object by placing a paper cup or similar shield over the eye without pressing on it.",
      },
      {
        instruction:
          "For blunt impact: Apply a cold compress gently over the eye for 15 minutes to reduce swelling. Do not apply pressure.",
      },
      {
        instruction:
          "Cover the injured eye loosely with a sterile pad. For severe trauma or embedded objects: cover both eyes to reduce movement (eyes move together). For minor injuries: covering the injured eye only is sufficient.",
      },
      {
        instruction:
          "Seek medical attention for any eye injury that doesn't resolve quickly with flushing.",
      },
    ],
    doNot: [
      "Do NOT rub the eye",
      "Do NOT try to remove embedded objects",
      "Do NOT apply pressure to an injured eye",
      "Do NOT use tweezers or cotton swabs on the eye",
    ],
    supplies: [
      "Clean water for flushing",
      "Sterile eye pads",
      "Paper cup (for shielding embedded objects)",
      "Cold compress",
    ],
  },

  /* ---- Poisoning ---- */
  {
    slug: "poisoning",
    title: "Poisoning",
    shortDescription:
      "Respond to accidental ingestion, inhalation, or skin contact with toxic substances.",
    icon: Pill,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
    category: "medical",
    severity: "critical",
    whenToCall911: [
      "The person is unconscious, drowsy, or having seizures",
      "Difficulty breathing",
      "Known ingestion of a corrosive substance (bleach, acids, batteries)",
      "Poisoning in a child",
      "Uncertain about what was ingested or how much",
    ],
    steps: [
      {
        instruction:
          "Call Poison Control (1-800-222-1222 in the US) or emergency services immediately. Have the container or substance name ready if possible.",
      },
      {
        instruction:
          "If the person is conscious and alert, follow the instructions from Poison Control. They will guide you on whether to give water, induce position changes, etc.",
      },
      {
        instruction:
          "For inhaled poisons (gas, fumes): Move the person to fresh air immediately. Open windows and doors.",
        warning: "Do NOT enter a gas-filled area without proper protection.",
      },
      {
        instruction:
          "For poison on the skin: Remove contaminated clothing and rinse the skin with running water for 15–20 minutes.",
      },
      {
        instruction:
          "For poison in the eyes: Flush with clean water for 15–20 minutes.",
      },
      {
        instruction:
          "If the person vomits, turn them on their side to prevent choking. Save a sample of the vomit for medical personnel.",
      },
    ],
    doNot: [
      "Do NOT induce vomiting unless told to by Poison Control or a doctor",
      "Do NOT give activated charcoal without medical guidance",
      "Do NOT give anything by mouth to an unconscious person",
      "Do NOT try to neutralize poison (e.g., giving acid for a base)",
    ],
    supplies: [
      "Poison Control phone number (1-800-222-1222 in US)",
      "Clean water for flushing",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Lookup helpers                                                    */
/* ------------------------------------------------------------------ */

export function getGuideBySlug(slug: string): FirstAidGuide | undefined {
  return FIRST_AID_GUIDES.find((g) => g.slug === slug);
}

export function getGuidesByCategory(category: Category): FirstAidGuide[] {
  return FIRST_AID_GUIDES.filter((g) => g.category === category);
}

/** Emergency numbers for quick reference */
export const EMERGENCY_NUMBERS = [
  { country: "United States", number: "911", label: "Emergency" },
  { country: "United States", number: "1-800-222-1222", label: "Poison Control" },
  { country: "United Kingdom", number: "999", label: "Emergency" },
  { country: "European Union", number: "112", label: "Emergency" },
  { country: "Philippines", number: "911", label: "Emergency" },
  { country: "Australia", number: "000", label: "Emergency" },
  { country: "India", number: "112", label: "Emergency" },
  { country: "Japan", number: "119", label: "Ambulance" },
];

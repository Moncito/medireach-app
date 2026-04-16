/**
 * Rule-based triage engine — handles emergencies and common symptom patterns
 * locally without hitting the Gemini API. Returns null when AI should handle it.
 */

import type { Severity } from "@/lib/gemini";

export interface TriageResult {
  message: string;
  severity: Severity;
  source: "emergency" | "rules" | "ai";
}

/* ------------------------------------------------------------------ */
/*  Emergency detection — instant, no API call                        */
/* ------------------------------------------------------------------ */

interface EmergencyRule {
  keywords: RegExp;
  response: string;
}

const EMERGENCY_RULES: EmergencyRule[] = [
  {
    keywords:
      /chest\s*pain|chest\s*tight|heart\s*attack|cardiac|crushing\s*(chest|pressure)/i,
    response: `**This sounds like it could be a medical emergency.**

If you or someone near you is experiencing chest pain, tightness, or pressure — especially if it radiates to the arm, jaw, or back — please take these steps immediately:

1. **Call emergency services (911 / your local emergency number) right now**
2. Sit or lie down in a comfortable position
3. If available, chew an aspirin (unless allergic)
4. Loosen any tight clothing
5. Stay calm and try to breathe slowly

Do not wait to see if the pain goes away. Early treatment saves lives.

⚠️ *This is an automated emergency response. It is not a diagnosis. Professional medical help is essential.*`,
  },
  {
    keywords:
      /can'?t\s*breathe|difficulty\s*breathing|struggling\s*to\s*breathe|severe\s*shortness|choking|suffocating|gasping/i,
    response: `**Difficulty breathing can be a medical emergency.**

Please take these steps immediately:

1. **Call emergency services (911 / your local emergency number)**
2. Sit upright — do not lie flat
3. If you have a prescribed inhaler, use it now
4. Loosen any tight clothing around the chest and neck
5. Try to stay calm and take slow, steady breaths
6. Open a window or move to an area with fresh air if possible

If someone near you has stopped breathing, begin CPR if you're trained.

⚠️ *This is an automated emergency response. Seek professional medical help immediately.*`,
  },
  {
    keywords:
      /stroke|face\s*droop|arm\s*weakness|slurred\s*speech|sudden\s*numbness|can'?t\s*(move|feel)\s*(my|one)\s*(arm|leg|side|face)/i,
    response: `**These symptoms could indicate a stroke. Time is critical.**

Remember **F.A.S.T.**:
- **F**ace — Is one side drooping? Ask the person to smile.
- **A**rms — Can they raise both arms? Does one drift down?
- **S**peech — Is speech slurred or strange?
- **T**ime — Call emergency services immediately!

1. **Call 911 / your local emergency number NOW**
2. Note the time symptoms started — this helps doctors choose treatment
3. Do NOT give food, water, or medication
4. Keep the person comfortable and monitor breathing
5. Be ready to perform CPR if they become unresponsive

⚠️ *Every minute matters with a stroke. Do not wait.*`,
  },
  {
    keywords:
      /severe\s*bleeding|won'?t\s*stop\s*bleeding|heavy\s*blood\s*loss|arterial|blood\s*(everywhere|gushing|spurting)/i,
    response: `**Severe bleeding requires immediate action.**

1. **Call emergency services (911 / your local emergency number)**
2. Apply firm, direct pressure to the wound with a clean cloth
3. Do NOT remove the cloth — add more layers on top if it soaks through
4. If a limb is injured, elevate it above heart level if possible
5. If bleeding is from an arm or leg and won't stop, apply a tourniquet 2-3 inches above the wound (only as a last resort)
6. Keep the person warm and lying down
7. Do NOT give food or drink

Stay with the person until help arrives and keep applying pressure.

⚠️ *This is an automated first-aid response. Professional medical care is essential.*`,
  },
  {
    keywords:
      /allergic\s*reaction|anaphyl|throat\s*(closing|swelling|tight)|can'?t\s*swallow.*swell|epipen|hives\s*(all|everywhere|spreading).*breath/i,
    response: `**This may be a severe allergic reaction (anaphylaxis).**

1. **Call emergency services (911 / your local emergency number) immediately**
2. If an epinephrine auto-injector (EpiPen) is available, use it NOW — inject into the outer thigh
3. Help the person lie down with legs elevated (unless they have trouble breathing — then sit them up)
4. Loosen tight clothing
5. If breathing stops, begin CPR
6. A second EpiPen dose can be given after 5-15 minutes if no improvement
7. Do NOT give oral medications if having trouble swallowing

Even if symptoms improve after epinephrine, emergency medical care is still needed.

⚠️ *Anaphylaxis can be life-threatening. Do not delay calling for help.*`,
  },
  {
    keywords:
      /suicid|kill\s*myself|want\s*to\s*die|end\s*(my|it\s*all)|self\s*harm|overdose\s*(on|myself)/i,
    response: `**I hear you, and I want you to know that help is available right now.**

You are not alone. Please reach out to someone who can help:

📞 **National Suicide Prevention Lifeline**: **988** (call or text in the US)
📞 **Crisis Text Line**: Text **HOME** to **741741**
📞 **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

If you are in immediate danger:
1. **Call 911 / your local emergency number**
2. Go to your nearest emergency room
3. Stay with someone you trust
4. Remove access to anything that could cause harm

You matter. What you're feeling right now is temporary, even if it doesn't feel that way. A trained professional can help you through this.

💙 *MediReach cares about your wellbeing. This is beyond what an AI can help with — please talk to a real person.*`,
  },
  {
    keywords:
      /unconscious|unresponsive|not\s*(breathing|responding|waking)|passed\s*out\s*(and|won'?t)|seizure\s*(won'?t\s*stop|lasted|more\s*than\s*5)/i,
    response: `**Someone who is unconscious or having a prolonged seizure needs emergency help.**

1. **Call emergency services (911 / your local emergency number) immediately**
2. Check for breathing — look, listen, and feel
3. If NOT breathing: Begin CPR (30 chest compressions, 2 rescue breaths)
4. If breathing: Place them in the recovery position (on their side)
5. Do NOT put anything in their mouth
6. Do NOT try to restrain someone having a seizure
7. Clear the area of dangerous objects
8. Note the time the episode started

Stay with the person until emergency services arrive.

⚠️ *This is an automated emergency response. Professional medical help is essential.*`,
  },
];

/* ------------------------------------------------------------------ */
/*  Common symptom rules — fast local responses                       */
/* ------------------------------------------------------------------ */

interface SymptomRule {
  pattern: RegExp;
  /** Only match if this is the first message (no conversation history) */
  firstMessageOnly: boolean;
  response: string;
  severity: Severity;
  /** Follow-up questions to include */
  followUp?: string;
}

const SYMPTOM_RULES: SymptomRule[] = [
  {
    pattern:
      /\b(common\s*cold|runny\s*nose|sneezing|stuffy\s*nose|nasal\s*congestion)\b.*\b(sore\s*throat|cough|sneez)\b|\b(sore\s*throat|cough|sneez)\b.*\b(runny\s*nose|stuffy|congestion)\b/i,
    firstMessageOnly: true,
    severity: "low",
    response: `Based on your description, these symptoms are commonly associated with a **common cold** or upper respiratory infection.

**What you can do:**
1. Rest and get plenty of sleep
2. Stay hydrated — water, warm tea, and broths are great
3. Use over-the-counter remedies like decongestants or throat lozenges
4. Gargle with warm salt water for sore throat relief
5. Use a humidifier to ease congestion
6. Honey in warm water can soothe a cough (not for children under 1)

**Watch for these warning signs** that may need a doctor's visit:
- Symptoms lasting more than 10 days
- Fever above 103°F (39.4°C)
- Symptoms that improve then suddenly worsen
- Severe sinus pain or headache`,
    followUp:
      "How long have you had these symptoms? And have you had any fever?",
  },
  {
    pattern:
      /\b(headache|head\s*hurts|head\s*ache|migraine|head\s*pounding|head\s*pain)\b/i,
    firstMessageOnly: true,
    severity: null,
    response: `I understand you're dealing with a headache. To give you the best guidance, I need to understand a bit more about what you're experiencing.`,
    followUp: `Could you tell me:
1. **Where** does it hurt? (front, back, one side, all over)
2. **How long** have you had it?
3. **How would you rate the pain** on a scale of 1-10?
4. Is it **throbbing**, **constant pressure**, or **sharp**?
5. Any other symptoms? (nausea, light sensitivity, neck stiffness, fever)`,
  },
  {
    pattern: /\b(stomach\s*ache|stomach\s*pain|belly\s*pain|abdominal\s*pain|tummy\s*ache|stomach\s*cramp|stomach\s*hurts)\b/i,
    firstMessageOnly: true,
    severity: null,
    response: `I'm sorry you're dealing with stomach discomfort. Abdominal pain can have many causes, so I'd like to understand your situation better.`,
    followUp: `Can you help me narrow it down:
1. **Where exactly** is the pain? (upper/lower, left/right, or all over)
2. **When** did it start?
3. Is it **constant** or does it come and go?
4. Any **nausea, vomiting, or diarrhea**?
5. Have you eaten anything unusual recently?
6. Any **fever**?`,
  },
  {
    pattern:
      /\b(fever|temperature|burning\s*up|feel(ing)?\s*hot)\b.*\b(1[0-9]{2}|high)\b/i,
    firstMessageOnly: true,
    severity: "moderate",
    response: `A fever is your body's natural response to fighting infection. Here's what I'd recommend:

**Immediate care:**
1. Stay hydrated — drink plenty of water and clear fluids
2. Rest as much as possible
3. Take acetaminophen (Tylenol) or ibuprofen (Advil) as directed for comfort
4. Wear light, breathable clothing
5. Use a lukewarm (not cold) compress on your forehead

**See a doctor if:**
- Fever is above **103°F (39.4°C)** and not responding to medication
- It has lasted more than **3 days**
- You have a **stiff neck**, **severe headache**, or **rash**
- You're experiencing **confusion** or **difficulty breathing**
- You have a weakened immune system`,
    followUp:
      "How long have you had the fever, and do you have any other symptoms like cough, body aches, or rash?",
  },
];

/* ------------------------------------------------------------------ */
/*  Triage function                                                   */
/* ------------------------------------------------------------------ */

export function triageLocally(
  userMessage: string,
  conversationLength: number
): TriageResult | null {
  // 1. Always check emergencies (regardless of conversation state)
  for (const rule of EMERGENCY_RULES) {
    if (rule.keywords.test(userMessage)) {
      return {
        message: rule.response,
        severity: "emergency",
        source: "emergency",
      };
    }
  }

  // 2. Check symptom rules (only on first message for pattern-matched responses)
  for (const rule of SYMPTOM_RULES) {
    if (rule.firstMessageOnly && conversationLength > 0) continue;

    if (rule.pattern.test(userMessage)) {
      let message = rule.response;
      if (rule.followUp) {
        message += `\n\n${rule.followUp}`;
      }
      message +=
        "\n\n*Remember: This is general guidance based on common patterns. For persistent or worsening symptoms, please consult a healthcare professional.*";

      return {
        message,
        severity: rule.severity,
        source: "rules",
      };
    }
  }

  // 3. No local match — let AI handle it
  return null;
}

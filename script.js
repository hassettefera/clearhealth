let currentLang = 'en';
let activeConditionId = '';

// Register Service Worker for Offline Functionality (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(err => console.log('SW registration failed:', err));
  });
}

// Dark Mode Toggle Logic
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// UI Setup & Keyboard Shortcuts
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') runSearch();
    });
  }
});

// Interface Translations
const uiTranslations = {
  en: {
    title: "Medical information, simplified.",
    subtitle: "Understand your health in simple, everyday language.",
    placeholder: "Search a condition (e.g., Diabetes, Flu, Gout)...",
    button: "Search",
    whatLabel: "What is it?",
    lifestyleLabel: "Simple Daily Tips:",
    emergencyLabel: "When to Seek Immediate Care:"
  },
  es: {
    title: "Información médica, simplificada.",
    subtitle: "Comprenda su salud en un lenguaje sencillo y cotidiano.",
    placeholder: "Busque una condición (ej. Diabetes, Gripe)...",
    button: "Buscar",
    whatLabel: "¿Qué es?",
    lifestyleLabel: "Consejos diarios sencillos:",
    emergencyLabel: "Cuándo buscar atención inmediata:"
  }
  // You can add more UI translations here for zh, am, vi as needed
};

// Expanded Medical Database (All 49 Conditions)
const medicalDatabase = [
  // --- 🫀 Heart, Blood, & Circulation ---
  {
    id: 'blood_pressure',
    keywords: ['high blood pressure', 'hypertension', 'blood pressure'],
    category: { en: 'Heart, Blood, & Circulation' },
    title: { en: 'High Blood Pressure (Hypertension)' },
    emergency: { en: 'Seek emergency care if you experience severe chest pain, sudden vision changes, severe headache, or trouble breathing.' },
    whatIsIt: { en: 'Your heart works too hard pumping blood, putting extra pressure on your blood vessels.' },
    lifestyle: { en: ['<strong>Cut Back on Salt:</strong> Helps lower blood volume and pressure.', '<strong>Daily Walks:</strong> Keeps heart muscles strong and relaxed.'] }
  },
  {
    id: 'cholesterol',
    keywords: ['high cholesterol', 'fat', 'cholesterol'],
    category: { en: 'Heart, Blood, & Circulation' },
    title: { en: 'High Cholesterol' },
    emergency: { en: 'Seek urgent medical attention if you experience sudden chest tightness or left arm pain.' },
    whatIsIt: { en: 'Fat buildup in the blood tubes that slows down healthy blood flow.' },
    lifestyle: { en: ['<strong>Eat More Fiber:</strong> Oats and beans help clear out fat.', '<strong>Limit Fried Foods:</strong> Protects your blood vessels.'] }
  },
  {
    id: 'anemia',
    keywords: ['anemia', 'iron', 'weakness'],
    category: { en: 'Heart, Blood, & Circulation' },
    title: { en: 'Anemia (Low Iron)' },
    emergency: { en: 'Seek emergency care if you faint or experience severe shortness of breath.' },
    whatIsIt: { en: 'Low iron in the blood making you feel constantly weak, tired, and cold.' },
    lifestyle: { en: ['<strong>Eat Iron-Rich Foods:</strong> Spinach, beans, and red meat.', '<strong>Add Vitamin C:</strong> Helps your body absorb iron.'] }
  },
  {
    id: 'heart_attack',
    keywords: ['heart attack', 'chest pain'],
    category: { en: 'Heart, Blood, & Circulation' },
    title: { en: 'Heart Attack' },
    emergency: { en: 'CALL 911 IMMEDIATELY if you feel crushing chest pain, or pain radiating to your jaw or arm.' },
    whatIsIt: { en: 'A blocked tube stopping blood from reaching the heart.' },
    lifestyle: { en: ['<strong>Call 911:</strong> Do not drive yourself to the hospital.', '<strong>Chew Aspirin:</strong> If advised by emergency dispatchers.'] }
  },
  {
    id: 'stroke',
    keywords: ['stroke', 'brain attack', 'face drooping'],
    category: { en: 'Heart, Blood, & Circulation' },
    title: { en: 'Stroke' },
    emergency: { en: 'CALL 911 IMMEDIATELY. Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911.' },
    whatIsIt: { en: 'A blocked or burst tube stopping blood in the brain.' },
    lifestyle: { en: ['<strong>Act Fast:</strong> Time is critical to saving brain function.'] }
  },
  {
    id: 'dvt',
    keywords: ['blood clots', 'dvt', 'leg pain'],
    category: { en: 'Heart, Blood, & Circulation' },
    title: { en: 'Blood Clots (DVT)' },
    emergency: { en: 'Seek immediate care if you have sudden chest pain or difficulty breathing, which means a clot may have moved to your lungs.' },
    whatIsIt: { en: 'Jelly-like blood lumps trapped in the legs, causing swelling and pain.' },
    lifestyle: { en: ['<strong>Move Around:</strong> Don\'t sit still for long periods (like on long flights).'] }
  },
  {
    id: 'pad',
    keywords: ['poor circulation', 'pad', 'cold legs'],
    category: { en: 'Heart, Blood, & Circulation' },
    title: { en: 'Poor Circulation (PAD)' },
    emergency: { en: 'Seek care if a leg or foot suddenly turns pale, blue, or cold.' },
    whatIsIt: { en: 'Cold or painful legs from bad blood flow.' },
    lifestyle: { en: ['<strong>Quit Smoking:</strong> Smoking severely restricts blood flow.', '<strong>Walk Regularly:</strong> Helps build new blood pathways.'] }
  },

  // --- 🫁 Lungs & Breathing ---
  {
    id: 'asthma',
    keywords: ['asthma', 'breathing', 'wheezing'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'Asthma' },
    emergency: { en: 'Go to the ER if your rescue inhaler isn\'t working or you can\'t speak in full sentences.' },
    whatIsIt: { en: 'Swollen breathing tubes that squeeze shut.' },
    lifestyle: { en: ['<strong>Avoid Triggers:</strong> Keep away from smoke, strong perfumes, and dust.'] }
  },
  {
    id: 'flu',
    keywords: ['flu', 'influenza', 'fever'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'The Flu (Influenza)' },
    emergency: { en: 'Seek care for severe chest pain, trouble breathing, or confusion.' },
    whatIsIt: { en: 'A severe viral infection of the nose and lungs.' },
    lifestyle: { en: ['<strong>Rest Completely:</strong> Stay home and sleep.', '<strong>Hydrate:</strong> Drink lots of water and warm broth.'] }
  },
  {
    id: 'pneumonia',
    keywords: ['pneumonia', 'lung infection'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'Pneumonia' },
    emergency: { en: 'Seek immediate care for high persistent fever or sharp chest pain when breathing.' },
    whatIsIt: { en: 'A deep lung infection filled with fluid.' },
    lifestyle: { en: ['<strong>Get Lots of Rest:</strong> Your body needs extreme energy to fight it.', '<strong>Sip Warm Liquids:</strong> Helps loosen chest fluid.'] }
  },
  {
    id: 'bronchitis',
    keywords: ['bronchitis', 'chest cold', 'cough'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'Bronchitis' },
    emergency: { en: 'Seek care if you cough up blood or have a fever over 101°F (38.3°C) for several days.' },
    whatIsIt: { en: 'Irritated chest tubes causing a deep, painful cough.' },
    lifestyle: { en: ['<strong>Use a Humidifier:</strong> Moist air soothes the chest tubes.', '<strong>Avoid Smoke:</strong> Do not smoke or be around second-hand smoke.'] }
  },
  {
    id: 'copd',
    keywords: ['copd', 'smokers cough', 'emphysema'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'COPD' },
    emergency: { en: 'Seek emergency help if you cannot catch your breath or your lips turn blue.' },
    whatIsIt: { en: 'Long-term lung damage usually from smoke or dust.' },
    lifestyle: { en: ['<strong>Stop Smoking:</strong> This is the #1 way to slow down the damage.', '<strong>Practice Pursed-Lip Breathing:</strong> Breathe in through the nose, out slowly through pursed lips.'] }
  },
  {
    id: 'sleep_apnea',
    keywords: ['sleep apnea', 'snoring', 'tired'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'Sleep Apnea' },
    emergency: { en: 'Talk to a doctor if you wake up gasping or choking for air.' },
    whatIsIt: { en: 'Stopping breathing for short moments while sleeping.' },
    lifestyle: { en: ['<strong>Sleep on Your Side:</strong> Prevents your tongue from blocking the airway.'] }
  },

  // --- 🧠 Brain & Mental Health ---
  {
    id: 'migraine',
    keywords: ['migraine', 'headache', 'vomiting'],
    category: { en: 'Brain & Mental Health' },
    title: { en: 'Migraine' },
    emergency: { en: 'Seek care if it is the "worst headache of your life" or comes on like a sudden thunderclap.' },
    whatIsIt: { en: 'Severe, blinding headaches often causing vomiting and sensitivity to light/sound.' },
    lifestyle: { en: ['<strong>Rest in a Dark Room:</strong> Turn off all lights and screens.', '<strong>Hydrate Early:</strong> Drink water as soon as you feel it coming.'] }
  },
  {
    id: 'anxiety',
    keywords: ['anxiety', 'panic', 'worry'],
    category: { en: 'Brain & Mental Health' },
    title: { en: 'Anxiety' },
    emergency: { en: 'Seek help if a panic attack feels like a heart attack (severe chest pain).' },
    whatIsIt: { en: 'Severe, constant worry that causes chest tightness and a racing heart.' },
    lifestyle: { en: ['<strong>Box Breathing:</strong> Breathe in 4 seconds, hold 4 seconds, exhale 4 seconds.', '<strong>Limit Caffeine:</strong> Coffee can make anxiety much worse.'] }
  },
  {
    id: 'depression',
    keywords: ['depression', 'sadness', 'tired'],
    category: { en: 'Brain & Mental Health' },
    title: { en: 'Depression' },
    emergency: { en: 'Call the suicide hotline (988 in the US) or go to the ER if you have thoughts of hurting yourself.' },
    whatIsIt: { en: 'Long-term, heavy sadness that steals your energy and motivation.' },
    lifestyle: { en: ['<strong>Seek Support:</strong> Talk to a therapist or trusted friend.', '<strong>Small Steps:</strong> Focus on just doing one small task a day.'] }
  },
  {
    id: 'concussion',
    keywords: ['concussion', 'head injury'],
    category: { en: 'Brain & Mental Health' },
    title: { en: 'Concussion' },
    emergency: { en: 'Go to the ER if you experience repeated vomiting, a worsening headache, or unequal pupil sizes.' },
    whatIsIt: { en: 'A brain bruise from a hard hit to the head.' },
    lifestyle: { en: ['<strong>Mental Rest:</strong> Avoid screens, reading, and loud noises for a few days.'] }
  },
  {
    id: 'dementia',
    keywords: ['dementia', 'alzheimers', 'memory'],
    category: { en: 'Brain & Mental Health' },
    title: { en: 'Dementia / Alzheimer\'s' },
    emergency: { en: 'Seek immediate help if the person wanders off and gets lost.' },
    whatIsIt: { en: 'Memory fading and getting easily lost due to brain changes over time.' },
    lifestyle: { en: ['<strong>Keep a Routine:</strong> Predictable days reduce confusion.', '<strong>Safety First:</strong> Remove tripping hazards and secure doors.'] }
  },
  {
    id: 'seizures',
    keywords: ['seizures', 'epilepsy', 'shaking'],
    category: { en: 'Brain & Mental Health' },
    title: { en: 'Seizures (Epilepsy)' },
    emergency: { en: 'Call 911 if a seizure lasts more than 5 minutes or if the person doesn\'t wake up afterward.' },
    whatIsIt: { en: 'Sudden electrical storms in the brain causing shaking or staring blankly.' },
    lifestyle: { en: ['<strong>Stay Safe:</strong> If someone is seizing, gently roll them on their side and cushion their head. Do not put anything in their mouth.'] }
  },

  // --- 🪓 Joints, Bones, & Muscles ---
  {
    id: 'arthritis',
    keywords: ['arthritis', 'joint pain', 'stiff'],
    category: { en: 'Joints, Bones, & Muscles' },
    title: { en: 'Arthritis' },
    emergency: { en: 'See a doctor if a joint suddenly becomes swollen, red, hot, and impossible to move.' },
    whatIsIt: { en: 'Swollen, stiff joints that hurt when moving.' },
    lifestyle: { en: ['<strong>Gentle Movement:</strong> Swimming or walking keeps joints lubricated.', '<strong>Warm Compresses:</strong> Helps loosen stiff joints in the morning.'] }
  },
  {
    id: 'gout',
    keywords: ['gout', 'toe pain', 'crystals'],
    category: { en: 'Joints, Bones, & Muscles' },
    title: { en: 'Gout' },
    emergency: { en: 'Seek care if the severe joint pain is accompanied by a high fever.' },
    whatIsIt: { en: 'Sharp crystals in the joints causing sudden, massive toe pain.' },
    lifestyle: { en: ['<strong>Drink Lots of Water:</strong> Helps flush out the crystals.', '<strong>Avoid Red Meat & Alcohol:</strong> These trigger flare-ups.'] }
  },
  {
    id: 'osteoporosis',
    keywords: ['osteoporosis', 'weak bones', 'fracture'],
    category: { en: 'Joints, Bones, & Muscles' },
    title: { en: 'Osteoporosis' },
    emergency: { en: 'Go to the ER immediately if you fall and cannot put weight on a limb, or experience severe back pain.' },
    whatIsIt: { en: 'Weak, hollow bones that break easily during slips.' },
    lifestyle: { en: ['<strong>Calcium & Vitamin D:</strong> Essential for keeping remaining bone strong.', '<strong>Fall Prevention:</strong> Remove loose rugs and wear supportive shoes.'] }
  },
  {
    id: 'sciatica',
    keywords: ['sciatica', 'back pain', 'leg pain'],
    category: { en: 'Joints, Bones, & Muscles' },
    title: { en: 'Sciatica' },
    emergency: { en: 'Go to the ER if you lose control of your bowels/bladder or experience sudden severe numbness in your legs.' },
    whatIsIt: { en: 'A pinched back nerve causing shooting leg pain.' },
    lifestyle: { en: ['<strong>Gentle Stretching:</strong> Yoga or specific back stretches help relieve pressure.', '<strong>Avoid Heavy Lifting:</strong> Protect your lower back.'] }
  },
  {
    id: 'carpal_tunnel',
    keywords: ['carpal tunnel', 'wrist pain', 'numb fingers'],
    category: { en: 'Joints, Bones, & Muscles' },
    title: { en: 'Carpal Tunnel' },
    emergency: { en: 'Consult a doctor if you start dropping objects frequently due to hand weakness.' },
    whatIsIt: { en: 'Pinched wrist nerves making fingers go numb.' },
    lifestyle: { en: ['<strong>Wear a Wrist Splint:</strong> Especially at night to keep the wrist straight.', '<strong>Take Keyboard Breaks:</strong> Rest your hands during repetitive work.'] }
  },

  // --- 💧 Urinary, Kidney, & Blood Sugar ---
  {
    id: 'diabetes',
    keywords: ['diabetes', 'sugar', 'blood sugar'],
    category: { en: 'Urinary, Kidney, & Blood Sugar' },
    title: { en: 'Diabetes (Type 2)' },
    emergency: { en: 'Seek immediate care for extreme confusion, fruity-smelling breath, or passing out.' },
    whatIsIt: { en: 'The body cannot process sugar from food properly, leaving it trapped in the blood.' },
    lifestyle: { en: ['<strong>Watch Sugary Drinks:</strong> Switch soda and juice for water.', '<strong>Walk After Meals:</strong> Helps your muscles burn off the extra sugar.'] }
  },
  {
    id: 'uti',
    keywords: ['uti', 'urinary tract infection', 'burning pee'],
    category: { en: 'Urinary, Kidney, & Blood Sugar' },
    title: { en: 'Urinary Tract Infection (UTI)' },
    emergency: { en: 'Seek urgent care for high fever, shaking chills, or severe lower back pain (signs of a kidney infection).' },
    whatIsIt: { en: 'Bacteria in the bladder causing burning pee and a constant need to go.' },
    lifestyle: { en: ['<strong>Drink Plenty of Water:</strong> Flushes the bacteria out.', '<strong>Don\'t Hold It:</strong> Use the bathroom as soon as you feel the urge.'] }
  },
  {
    id: 'kidney_stones',
    keywords: ['kidney stones', 'side pain'],
    category: { en: 'Urinary, Kidney, & Blood Sugar' },
    title: { en: 'Kidney Stones' },
    emergency: { en: 'Go to the ER for unbearable pain, vomiting, or blood in the urine.' },
    whatIsIt: { en: 'Sharp, tiny rocks in the body causing severe side pain.' },
    lifestyle: { en: ['<strong>Hydrate constantly:</strong> Your urine should be clear or very pale yellow.', '<strong>Limit Salt:</strong> High sodium causes stones to form.'] }
  },
  {
    id: 'ckd',
    keywords: ['kidney disease', 'ckd', 'kidney failure'],
    category: { en: 'Urinary, Kidney, & Blood Sugar' },
    title: { en: 'Chronic Kidney Disease' },
    emergency: { en: 'Seek care for severe swelling in your legs/face or intense shortness of breath.' },
    whatIsIt: { en: 'Filter organs slowing down and failing to clean the blood.' },
    lifestyle: { en: ['<strong>Control Blood Pressure:</strong> High blood pressure damages kidneys faster.', '<strong>Follow a Kidney-Friendly Diet:</strong> As prescribed by your doctor.'] }
  },

  // --- 🪵 Stomach & Digestion ---
  {
    id: 'gastroenteritis',
    keywords: ['stomach flu', 'gastroenteritis', 'vomiting', 'diarrhea'],
    category: { en: 'Stomach & Digestion' },
    title: { en: 'Gastroenteritis (Stomach Flu)' },
    emergency: { en: 'Seek care if you cannot keep water down for 24 hours, have severe belly pain, or notice blood in your stool.' },
    whatIsIt: { en: 'Severe vomiting and diarrhea from bad food or bugs.' },
    lifestyle: { en: ['<strong>Sip Water Slowly:</strong> Prevents dehydration without upsetting the stomach.', '<strong>Eat Bland Foods:</strong> Try toast, rice, or bananas when you feel ready.'] }
  },
  {
    id: 'gerd',
    keywords: ['acid reflux', 'gerd', 'heartburn'],
    category: { en: 'Stomach & Digestion' },
    title: { en: 'Acid Reflux (GERD)' },
    emergency: { en: 'Go to the ER if heartburn is accompanied by severe chest pressure or arm pain (to rule out a heart attack).' },
    whatIsIt: { en: 'Stomach acid burning the throat after eating.' },
    lifestyle: { en: ['<strong>Stay Upright:</strong> Do not lie down for 2 hours after eating.', '<strong>Eat Smaller Meals:</strong> A very full stomach pushes acid upward.'] }
  },
  {
    id: 'ulcers',
    keywords: ['stomach ulcers', 'ulcer', 'burning stomach'],
    category: { en: 'Stomach & Digestion' },
    title: { en: 'Stomach Ulcers' },
    emergency: { en: 'Seek emergency care if you vomit blood or your stool looks black and tarry.' },
    whatIsIt: { en: 'Open sores inside the stomach causing burning pain.' },
    lifestyle: { en: ['<strong>Avoid Ibuprofen/Advil:</strong> These pain relievers can make ulcers worse.', '<strong>Limit Spicy Foods & Alcohol:</strong> Reduces irritation.'] }
  },
  {
    id: 'gallstones',
    keywords: ['gallstones', 'gallbladder', 'right side pain'],
    category: { en: 'Stomach & Digestion' },
    title: { en: 'Gallstones' },
    emergency: { en: 'Seek immediate care for intense pain in the upper right belly that lasts for hours, or if your skin turns yellow (jaundice).' },
    whatIsIt: { en: 'Small stones blocking digestive juices, causing right-side pain.' },
    lifestyle: { en: ['<strong>Eat Low-Fat Meals:</strong> Greasy food forces the gallbladder to squeeze and causes pain.'] }
  },
  {
    id: 'constipation',
    keywords: ['constipation', 'cant poop', 'bloating'],
    category: { en: 'Stomach & Digestion' },
    title: { en: 'Constipation' },
    emergency: { en: 'Seek care if you have severe abdominal pain, vomiting, or haven\'t passed gas/stool in several days.' },
    whatIsIt: { en: 'Difficulty pooping, leading to severe bloating and discomfort.' },
    lifestyle: { en: ['<strong>Eat More Fiber:</strong> Fruits, veggies, and whole grains.', '<strong>Drink More Water:</strong> Fiber needs water to work properly.'] }
  },
  {
    id: 'hemorrhoids',
    keywords: ['hemorrhoids', 'piles', 'bleeding'],
    category: { en: 'Stomach & Digestion' },
    title: { en: 'Hemorrhoids' },
    emergency: { en: 'See a doctor if you experience large amounts of bleeding or severe, continuous pain.' },
    whatIsIt: { en: 'Swollen, painful veins down below that can bleed during bowel movements.' },
    lifestyle: { en: ['<strong>Don\'t Strain:</strong> Avoid pushing hard on the toilet.', '<strong>Warm Baths:</strong> Soaking in a warm bath relieves pain and swelling.'] }
  },

  // --- 🦠 Common Infections & Skin ---
  {
    id: 'strep',
    keywords: ['strep throat', 'sore throat', 'bacterial'],
    category: { en: 'Common Infections & Skin' },
    title: { en: 'Strep Throat' },
    emergency: { en: 'Seek immediate care if you have severe difficulty breathing or swallowing.' },
    whatIsIt: { en: 'Severe bacterial throat infection that needs antibiotics.' },
    lifestyle: { en: ['<strong>See a Doctor:</strong> Requires a prescription to prevent heart/kidney complications.', '<strong>Change Your Toothbrush:</strong> Do this after you start antibiotics so you don\'t re-infect yourself.'] }
  },
  {
    id: 'pink_eye',
    keywords: ['pink eye', 'conjunctivitis', 'red eye'],
    category: { en: 'Common Infections & Skin' },
    title: { en: 'Pink Eye (Conjunctivitis)' },
    emergency: { en: 'See a doctor if you experience intense eye pain, severe blurry vision, or extreme light sensitivity.' },
    whatIsIt: { en: 'Highly contagious, itchy, red eye infection.' },
    lifestyle: { en: ['<strong>Wash Hands Frequently:</strong> Do not touch your face or rub your eyes.', '<strong>Use Warm Compresses:</strong> Helps clean the crust off your eyelashes.'] }
  },
  {
    id: 'cellulitis',
    keywords: ['cellulitis', 'skin infection', 'red skin'],
    category: { en: 'Common Infections & Skin' },
    title: { en: 'Cellulitis' },
    emergency: { en: 'Go to the ER if the red area spreads rapidly, or if you develop a high fever and chills.' },
    whatIsIt: { en: 'A deep, spreading skin infection that feels hot and red.' },
    lifestyle: { en: ['<strong>Seek Medical Treatment:</strong> You will likely need antibiotics.', '<strong>Keep the Area Clean and Elevated:</strong> Helps reduce swelling.'] }
  },
  {
    id: 'eczema',
    keywords: ['eczema', 'dry skin', 'itchy'],
    category: { en: 'Common Infections & Skin' },
    title: { en: 'Eczema' },
    emergency: { en: 'See a doctor if the skin starts oozing yellow pus, which means it\'s infected.' },
    whatIsIt: { en: 'Very dry, itchy skin patches that crack and bleed.' },
    lifestyle: { en: ['<strong>Moisturize Constantly:</strong> Use thick, unscented creams right after a shower.', '<strong>Avoid Hot Showers:</strong> Hot water strips oil from your skin.'] }
  },
  {
    id: 'shingles',
    keywords: ['shingles', 'rash', 'chickenpox'],
    category: { en: 'Common Infections & Skin' },
    title: { en: 'Shingles' },
    emergency: { en: 'Seek urgent care if the rash is anywhere near your eyes, as it can cause blindness.' },
    whatIsIt: { en: 'A painful, blistering rash caused by an old chickenpox virus.' },
    lifestyle: { en: ['<strong>See a Doctor Quickly:</strong> Medication works best if started within 72 hours.', '<strong>Keep the Rash Covered:</strong> So you don\'t spread the virus to others.'] }
  },
  {
    id: 'fungal',
    keywords: ['fungal infection', 'ringworm', 'athletes foot'],
    category: { en: 'Common Infections & Skin' },
    title: { en: 'Fungal Infections (Ringworm/Athlete\'s Foot)' },
    emergency: { en: 'See a doctor if it doesn\'t improve with over-the-counter creams or if it gets severely red and hot.' },
    whatIsIt: { en: 'Itchy, scaly skin circles or cracked skin between toes.' },
    lifestyle: { en: ['<strong>Keep the Area Dry:</strong> Fungus loves dark, damp places.', '<strong>Don\'t Share Towels:</strong> Fungal infections are highly contagious.'] }
  },

  // --- 🚨 Everyday Emergencies & Injuries ---
  {
    id: 'dehydration',
    keywords: ['dehydration', 'thirsty', 'fainting'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Dehydration' },
    emergency: { en: 'Go to the ER if you feel extremely dizzy when standing, are confused, or stop urinating completely.' },
    whatIsIt: { en: 'Dangerous lack of water causing dizziness or passing out.' },
    lifestyle: { en: ['<strong>Sip Water/Electrolytes:</strong> Drink slowly so you don\'t upset your stomach.', '<strong>Rest in a Cool Place:</strong> Avoid the sun and heat.'] }
  },
  {
    id: 'burns',
    keywords: ['severe burns', 'burn', 'fire'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Severe Burns' },
    emergency: { en: 'Go to the ER for burns that cover a large area, look white/charred, or are on the face, hands, or genitals.' },
    whatIsIt: { en: 'Skin damage from fire, hot water, or cooking oil.' },
    lifestyle: { en: ['<strong>Run Cool Water:</strong> Hold the burn under cool (not ice cold) water for 10-15 mins.', '<strong>Do Not Pop Blisters:</strong> Blisters protect the healing skin underneath.'] }
  },
  {
    id: 'anaphylaxis',
    keywords: ['allergic reaction', 'anaphylaxis', 'hives'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Allergic Reactions (Anaphylaxis)' },
    emergency: { en: 'CALL 911 IMMEDIATELY if you have trouble breathing, swelling of the lips/tongue, or throat closing.' },
    whatIsIt: { en: 'Throat closing or hives from food, bugs, or medication.' },
    lifestyle: { en: ['<strong>Use an EpiPen:</strong> If you have one, use it immediately and still call 911.'] }
  },
  {
    id: 'heat_stroke',
    keywords: ['heat stroke', 'overheating', 'sun'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Heat Stroke' },
    emergency: { en: 'CALL 911 if the person stops sweating, becomes confused, or passes out in extreme heat.' },
    whatIsIt: { en: 'Body overheating dangerously under the hot sun.' },
    lifestyle: { en: ['<strong>Cool Down Fast:</strong> Move to shade/AC and apply cold, wet cloths to the neck and armpits.'] }
  },
  {
    id: 'bites',
    keywords: ['animal bite', 'insect bite', 'dog bite'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Animal or Insect Bites' },
    emergency: { en: 'Go to the ER if a dog/wild animal bites through the skin, or if a bite gets severely red, swollen, or streaks up your arm/leg.' },
    whatIsIt: { en: 'Infected wounds from dogs, cats, ticks, or spiders.' },
    lifestyle: { en: ['<strong>Wash with Soap and Water:</strong> Clean the wound thoroughly right away.', '<strong>Watch for Infection:</strong> Monitor for redness, heat, or pus.'] }
  },
  {
    id: 'appendicitis',
    keywords: ['appendicitis', 'appendix', 'belly pain'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Appendicitis' },
    emergency: { en: 'GO TO THE ER IMMEDIATELY. This requires urgent surgery.' },
    whatIsIt: { en: 'Bursting internal organ causing severe bottom-right belly pain.' },
    lifestyle: { en: ['<strong>Do Not Eat or Drink:</strong> If you suspect appendicitis, keep your stomach empty in case you need emergency surgery.'] }
  },
  {
    id: 'food_allergy',
    keywords: ['food allergy', 'peanuts', 'shellfish'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Food Allergies' },
    emergency: { en: 'Call 911 for throat tightness, lip swelling, or difficulty breathing (Anaphylaxis).' },
    whatIsIt: { en: 'Dangerous body reactions to foods like peanuts, dairy, or shellfish.' },
    lifestyle: { en: ['<strong>Read Labels:</strong> Always check ingredients.', '<strong>Carry Medication:</strong> Keep Benadryl or an EpiPen with you at all times.'] }
  },
  {
    id: 'poison_ivy',
    keywords: ['poison ivy', 'poison oak', 'rash'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Poison Ivy / Oak' },
    emergency: { en: 'Seek care if the rash spreads to your face, genitals, or if you breathe in smoke from burning poison ivy.' },
    whatIsIt: { en: 'Severe, blistering rash from touching wild plants.' },
    lifestyle: { en: ['<strong>Wash with Dish Soap:</strong> Wash the skin immediately with a grease-cutting soap to remove plant oils.', '<strong>Wash Clothes:</strong> The oil can stay on clothing and shoes for months.'] }
  },
  {
    id: 'lyme_disease',
    keywords: ['lyme disease', 'tick', 'bullseye'],
    category: { en: 'Everyday Emergencies & Injuries' },
    title: { en: 'Lyme Disease' },
    emergency: { en: 'See a doctor immediately if you develop a "bullseye" shaped rash, fever, or severe joint pain after a tick bite.' },
    whatIsIt: { en: 'A serious bacterial infection passed by tiny ticks.' },
    lifestyle: { en: ['<strong>Remove Ticks Quickly:</strong> Use tweezers to grab the tick close to the skin and pull straight up.', '<strong>Check Your Body:</strong> After walking in tall grass or woods.'] }
  }
];

// --- Search and UI Logic Below ---

// Pure JS Search Function
function runSearch() {
  const queryInput = document.getElementById('search-input');
  if (!queryInput) return;
  
  const query = queryInput.value.toLowerCase().trim();
  const card = document.getElementById('results-card');
  
  if (!query) return;

  // Search through IDs, keywords, and localized titles
  const matched = medicalDatabase.find(item => {
    const inId = item.id.toLowerCase().includes(query);
    const inKeywords = item.keywords.some(k => k.toLowerCase().includes(query));
    const inTitles = Object.values(item.title).some(t => t.toLowerCase().includes(query));
    return inId || inKeywords || inTitles;
  });

  if (matched) {
    activeConditionId = matched.id;
    renderCard();
  } else {
    // Show clean, cute empty state without unneeded extra labels
    card.style.display = 'block';
    
    const badge = document.getElementById('res-badge');
    if (badge) badge.innerText = '✨ Stay Healthy';
    
    const title = document.getElementById('res-title');
    if (title) title.innerText = 'Condition Not Found 🌸';
    
    // Hide extra section headers when not found
    const whatLabel = document.getElementById('res-what-label');
    if (whatLabel) whatLabel.style.display = 'none';
    
    const lifestyleLabel = document.getElementById('res-lifestyle-label');
    if (lifestyleLabel) lifestyleLabel.style.display = 'none';
    
    const whatText = document.getElementById('res-what-text');
    if (whatText) {
      whatText.innerText = `We don't have an entry for "${query}" in our database yet! Try searching for terms like Heart Attack, Asthma, Migraine, or Arthritis.`;
    }
    
    const actionGrid = document.getElementById('res-action-grid');
    if (actionGrid) actionGrid.innerHTML = '';
    
    const emergencyBox = document.getElementById('emergency-box');
    if (emergencyBox) emergencyBox.style.display = 'none';
  }
}

// Category Filter Chip Logic
function filterByCategory(categoryKey, element) {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => chip.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }

  if (categoryKey === 'all') {
    const card = document.getElementById('results-card');
    if (card) card.style.display = 'none';
    activeConditionId = '';
    return;
  }

  const match = medicalDatabase.find(item => {
    // Search the English category name to match the HTML buttons
    return item.category.en.toLowerCase().includes(categoryKey.toLowerCase());
  });

  if (match) {
    activeConditionId = match.id;
    renderCard();
  } else {
    const card = document.getElementById('results-card');
    if (card) card.style.display = 'none';
  }
}

function quickSearch(conditionId) {
  activeConditionId = conditionId;
  renderCard();
}

function changeLanguage() {
  const langSelect = document.getElementById('lang-select');
  if (langSelect) currentLang = langSelect.value;
  updateUIText();
  if (activeConditionId) {
    renderCard();
  }
}

function updateUIText() {
  const langData = uiTranslations[currentLang] || uiTranslations.en;
  
  const title = document.getElementById('search-title');
  if (title) title.innerText = langData.title;
  
  const subtitle = document.getElementById('search-subtitle');
  if (subtitle) subtitle.innerText = langData.subtitle;
  
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.placeholder = langData.placeholder;
  
  const searchBtn = document.getElementById('search-btn');
  if (searchBtn) searchBtn.innerText = langData.button;
  
  const whatLabel = document.getElementById('res-what-label');
  if (whatLabel) whatLabel.innerText = langData.whatLabel;
  
  const lifestyleLabel = document.getElementById('res-lifestyle-label');
  if (lifestyleLabel) lifestyleLabel.innerText = langData.lifestyleLabel;
  
  const emergencyLabel = document.getElementById('res-emergency-label');
  if (emergencyLabel) emergencyLabel.innerText = langData.emergencyLabel;
}

function renderCard() {
  const condition = medicalDatabase.find(item => item.id === activeConditionId);
  if (!condition) return;

  // Make sure labels are visible for found conditions
  const whatLabel = document.getElementById('res-what-label');
  if (whatLabel) whatLabel.style.display = 'block';
  
  const lifestyleLabel = document.getElementById('res-lifestyle-label');
  if (lifestyleLabel) lifestyleLabel.style.display = 'block';

  // Smart fallback: If translation is missing, fallback to English
  const badge = document.getElementById('res-badge');
  if (badge) badge.innerText = condition.category[currentLang] || condition.category.en;
  
  const title = document.getElementById('res-title');
  if (title) title.innerText = condition.title[currentLang] || condition.title.en;
  
  const whatText = document.getElementById('res-what-text');
  if (whatText) whatText.innerText = condition.whatIsIt[currentLang] || condition.whatIsIt.en;

  // Emergency Box
  const emergencyBox = document.getElementById('emergency-box');
  const emergencyText = document.getElementById('res-emergency-text');
  if (condition.emergency && emergencyBox && emergencyText) {
    emergencyText.innerText = condition.emergency[currentLang] || condition.emergency.en;
    emergencyBox.style.display = 'flex';
  } else if (emergencyBox) {
    emergencyBox.style.display = 'none';
  }

  // Lifestyle Tips Grid
  const actionGrid = document.getElementById('res-action-grid');
  if (actionGrid) {
    actionGrid.innerHTML = '';
    const items = condition.lifestyle[currentLang] || condition.lifestyle.en;
    items.forEach(text => {
      const div = document.createElement('div');
      div.className = 'action-item';
      div.innerHTML = text;
      actionGrid.appendChild(div);
    });
  }

  const card = document.getElementById('results-card');
  if (card) card.style.display = 'block';
}

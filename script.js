let currentLang = 'en';
let activeConditionId = '';

const uiTranslations = {
  en: {
    title: "Medical information, simplified.",
    subtitle: "Understand your health in simple, everyday language.",
    placeholder: "Search a condition (e.g., Diabetes, Anemia, Gout)...",
    button: "Search",
    whatLabel: "What is it?",
    lifestyleLabel: "Simple Daily Tips:",
    emergencyLabel: "When to Seek Immediate Care:"
  },
  es: {
    title: "Información médica simplificada.",
    subtitle: "Comprenda su salud en un lenguaje sencillo y cotidiano.",
    placeholder: "Busque una condición (ej., Diabetes, Anemia)...",
    button: "Buscar",
    whatLabel: "¿Qué es?",
    lifestyleLabel: "Consejos diarios simples:",
    emergencyLabel: "Cuándo buscar atención inmediata:"
  },
  zh: {
    title: "医学信息，简而言之。",
    subtitle: "用简单日常的语言了解您的健康。",
    placeholder: "搜索疾病（例如：糖尿病、贫血、痛风）...",
    button: "搜索",
    whatLabel: "这是什么？",
    lifestyleLabel: "简单日常建议：",
    emergencyLabel: "何时寻求紧急护理："
  }
};

const medicalDatabase = {
  en: [
    {
      id: 'blood_pressure',
      keywords: ['high blood pressure', 'hypertension', 'blood pressure', 'bp'],
      category: 'Heart & Blood',
      title: 'High Blood Pressure (Hypertension)',
      emergency: 'Seek emergency care if you experience severe chest pain, sudden vision changes, severe headache, or trouble breathing.',
      whatIsIt: 'Heart works too hard pumping blood, putting extra pressure on your blood vessels.',
      lifestyle: [
        '<strong>Cut Back on Salt:</strong> Helps lower blood volume and pressure.',
        '<strong>Daily Walks:</strong> Keeps heart muscles strong and relaxed.'
      ]
    },
    {
      id: 'anemia',
      keywords: ['anemia', 'iron', 'weakness', 'low iron', 'fatigue'],
      category: 'Heart & Blood',
      title: 'Anemia (Low Iron)',
      emergency: 'Seek emergency care if you faint or experience severe shortness of breath.',
      whatIsIt: 'Low iron in the blood making you feel constantly weak, tired, and cold.',
      lifestyle: [
        '<strong>Eat Iron-Rich Foods:</strong> Spinach, beans, and red meat.',
        '<strong>Add Vitamin C:</strong> Helps your body absorb iron.'
      ]
    },
    {
      id: 'gout',
      keywords: ['gout', 'uric acid', 'toe pain', 'joints'],
      category: 'Joints & Bones',
      title: 'Gout',
      emergency: 'Seek medical care if a joint is extremely painful, hot, and swollen, especially with a fever.',
      whatIsIt: 'A type of arthritis caused by a buildup of uric acid crystals in the joints, often starting in the big toe.',
      lifestyle: [
        '<strong>Stay Hydrated:</strong> Drink plenty of water to help flush out uric acid.',
        '<strong>Limit Purine-Rich Foods:</strong> Reduce red meat, shellfish, and alcohol.'
      ]
    },
    {
      id: 'diabetes',
      keywords: ['diabetes', 'sugar', 'high sugar', 'type 2', 'glucose'],
      category: 'Kidney & Sugar',
      title: 'Diabetes (Type 2)',
      emergency: 'Seek immediate care for extreme confusion, fruity-smelling breath, or fainting.',
      whatIsIt: 'The body cannot process sugar properly, leading to elevated blood sugar levels.',
      lifestyle: [
        '<strong>Cut Sugary Drinks:</strong> Switch from soda to plain water.',
        '<strong>Walk After Meals:</strong> Helps muscles use up blood sugar.'
      ]
    },
    {
      id: 'asthma',
      keywords: ['asthma', 'wheezing', 'breathing', 'shortness of breath'],
      category: 'Lungs & Breathing',
      title: 'Asthma',
      emergency: 'Seek emergency care immediately if your rescue inhaler does not work or if you cannot finish a sentence due to breathlessness.',
      whatIsIt: 'Airways narrow and swell, producing extra mucus which makes breathing difficult.',
      lifestyle: [
        '<strong>Identify Triggers:</strong> Avoid dust, smoke, and pollen.',
        '<strong>Keep Inhaler Close:</strong> Always carry your prescribed rescue inhaler.'
      ]
    },
    {
      id: 'migraine',
      keywords: ['migraine', 'headache', 'head pain', 'throbbing head'],
      category: 'Brain & Mental',
      title: 'Migraine',
      emergency: 'Seek emergency care for the "worst headache of your life," sudden numbness, or difficulty speaking.',
      whatIsIt: 'A neurological condition causing severe throbbing pain, usually on one side of the head, often accompanied by sensitivity to light and sound.',
      lifestyle: [
        '<strong>Rest in a Dark Room:</strong> Minimize light and sound stimuli during an attack.',
        '<strong>Stay Consistent:</strong> Maintain regular sleep and meal schedules.'
      ]
    },
    {
      id: 'reflux',
      keywords: ['acid reflux', 'heartburn', 'gerd', 'stomach acid'],
      category: 'Stomach & Digestion',
      title: 'Acid Reflux (Heartburn)',
      emergency: 'Seek emergency care if chest pain radiates to your arm or jaw, as this could signal a heart attack rather than heartburn.',
      whatIsIt: 'Stomach acid flows back up into the tube connecting your mouth and stomach, causing a burning sensation in the chest.',
      lifestyle: [
        '<strong>Avoid Trigger Foods:</strong> Limit spicy, fatty foods, caffeine, and citrus.',
        '<strong>Stay Upright:</strong> Avoid lying down for 2 to 3 hours after eating.'
      ]
    },
    {
      id: 'cold_flu',
      keywords: ['flu', 'cold', 'common cold', 'cough', 'fever', 'runny nose'],
      category: 'Lungs & Breathing',
      title: 'Common Cold & Flu',
      emergency: 'Seek medical care if you experience persistent high fever, chest pain, or severe difficulty breathing.',
      whatIsIt: 'Viral infections affecting the upper respiratory tract, causing congestion, fatigue, and coughing.',
      lifestyle: [
        '<strong>Rest and Recover:</strong> Give your immune system energy to fight the virus.',
        '<strong>Drink Warm Fluids:</strong> Tea, broth, and water help soothe a sore throat.'
      ]
    },
    {
      id: 'arthritis',
      keywords: ['arthritis', 'joint pain', 'stiff joints', 'knee pain'],
      category: 'Joints & Bones',
      title: 'Osteoarthritis',
      emergency: 'Seek medical evaluation if joint pain is accompanied by sudden severe swelling, redness, or inability to move the joint.',
      whatIsIt: 'The protective cartilage cushioning the ends of your bones wears down over time, causing joint stiffness and pain.',
      lifestyle: [
        '<strong>Low-Impact Exercise:</strong> Swimming or walking helps keep joints flexible.',
        '<strong>Maintain a Healthy Weight:</strong> Reduces stress on weight-bearing joints like knees and hips.'
      ]
    },
    {
      id: 'allergies',
      keywords: ['allergies', 'seasonal allergies', 'hay fever', 'sneezing', 'pollen'],
      category: 'Lungs & Breathing',
      title: 'Seasonal Allergies (Hay Fever)',
      emergency: 'Seek emergency care immediately if you experience throat swelling or difficulty breathing (signs of anaphylaxis).',
      whatIsIt: 'An immune system reaction to outdoor allergens like pollen, grass, or mold, causing sneezing and watery eyes.',
      lifestyle: [
        '<strong>Keep Windows Closed:</strong> Use air conditioning during high pollen seasons.',
        '<strong>Shower Before Bed:</strong> Washes away pollen collected on your skin and hair.'
      ]
    },
    {
      id: 'cholesterol',
      keywords: ['high cholesterol', 'cholesterol', 'lipids', 'fat in blood'],
      category: 'Heart & Blood',
      title: 'High Cholesterol',
      emergency: 'Seek emergency help if you experience chest pain, shortness of breath, or signs of a stroke.',
      whatIsIt: 'Too much fatty substance in your blood, which can build up inside your arteries and block blood flow.',
      lifestyle: [
        '<strong>Eat Healthy Fats:</strong> Choose olive oil, avocado, and nuts instead of saturated fats.',
        '<strong>Increase Fiber:</strong> Eat more oats, beans, and whole grains.'
      ]
    },
    {
      id: 'eczema',
      keywords: ['eczema', 'dry skin', 'itchy skin', 'rash', 'dermatitis'],
      category: 'Skin',
      title: 'Eczema (Atopic Dermatitis)',
      emergency: 'Seek medical attention if the skin becomes infected, oozes pus, or is accompanied by a fever.',
      whatIsIt: 'A chronic skin condition that makes your skin red, dry, cracked, and very itchy.',
      lifestyle: [
        '<strong>Moisturize Daily:</strong> Apply thick creams or ointments right after bathing.',
        '<strong>Avoid Harsh Soaps:</strong> Use fragrance-free, gentle cleansers.'
      ]
    },
    {
      id: 'acne',
      keywords: ['acne', 'pimples', 'breakouts', 'zits', 'skin blemishes'],
      category: 'Skin',
      title: 'Acne',
      emergency: 'Consult a doctor if painful, deep cysts form that leave permanent scars.',
      whatIsIt: 'Hair follicles become clogged with oil and dead skin cells, causing pimples, blackheads, or whiteheads.',
      lifestyle: [
        '<strong>Wash Gently:</strong> Cleanse your face twice daily with a mild cleanser and warm water.',
        '<strong>Do Not Pop:</strong> Picking at pimples can spread bacteria and cause scarring.'
      ]
    },
    {
      id: 'anxiety',
      keywords: ['anxiety', 'panic', 'stress', 'worry', 'nervousness'],
      category: 'Brain & Mental',
      title: 'Generalized Anxiety',
      emergency: 'Seek immediate help if you experience a severe panic attack with chest pain or thoughts of self-harm.',
      whatIsIt: 'Persistent, excessive worry and fear about everyday situations, often accompanied by physical tension.',
      lifestyle: [
        '<strong>Deep Breathing:</strong> Practice slow, controlled breathing exercises to calm the nervous system.',
        '<strong>Limit Caffeine:</strong> Reduce coffee and energy drinks which can spike nervousness.'
      ]
    },
    {
      id: 'depression',
      keywords: ['depression', 'sadness', 'low mood', 'hopelessness'],
      category: 'Brain & Mental',
      title: 'Clinical Depression',
      emergency: 'Seek immediate professional help or call a crisis hotline if you experience thoughts of self-harm.',
      whatIsIt: 'A mood disorder causing a persistent feeling of sadness, emptiness, and loss of interest in activities.',
      lifestyle: [
        '<strong>Stay Connected:</strong> Reach out to trusted friends, family, or counselors.',
        '<strong>Establish a Routine:</strong> Keep a regular sleep schedule and try light daily movement.'
      ]
    },
    {
      id: 'insomnia',
      keywords: ['insomnia', 'cant sleep', 'sleeplessness', 'trouble sleeping'],
      category: 'Brain & Mental',
      title: 'Insomnia',
      emergency: 'Consult a doctor if chronic lack of sleep causes severe daytime impairment or dangerous microsleeps.',
      whatIsIt: 'A common sleep disorder that can make it hard to fall asleep, hard to stay asleep, or cause you to wake up too early.',
      lifestyle: [
        '<strong>Screen Curfew:</strong> Turn off phones and laptops at least 1 hour before bedtime.',
        '<strong>Consistent Schedule:</strong> Go to bed and wake up at the exact same time every day.'
      ]
    },
    {
      id: 'back_pain',
      keywords: ['back pain', 'lower back pain', 'spine pain', 'sore back'],
      category: 'Joints & Bones',
      title: 'Lower Back Pain',
      emergency: 'Seek emergency care if back pain is accompanied by numbness in the legs or loss of bladder/bowel control.',
      whatIsIt: 'Stiffness, soreness, or sharp discomfort in the muscles and vertebrae of the lower back.',
      lifestyle: [
        '<strong>Stay Active:</strong> Gentle walking is often better for recovery than total bed rest.',
        '<strong>Improve Posture:</strong> Ensure your workspace supports your spine properly.'
      ]
    },
    {
      id: 'sinusitis',
      keywords: ['sinusitis', 'sinus infection', 'blocked nose', 'facial pressure'],
      category: 'Lungs & Breathing',
      title: 'Sinus Infection (Sinusitis)',
      emergency: 'Seek medical care if you experience severe headache, vision changes, or high fever.',
      whatIsIt: 'Inflammation or swelling of the tissue lining the sinuses, causing facial pressure and nasal congestion.',
      lifestyle: [
        '<strong>Use Saline Rinses:</strong> Flush out nasal passages with a saline spray or neti pot.',
        '<strong>Stay Hydrated:</strong> Drinking plenty of water helps thin out mucus.'
      ]
    },
    {
      id: 'uti',
      keywords: ['uti', 'urinary tract infection', 'burning pee', 'bladder infection'],
      category: 'Kidney & Sugar',
      title: 'Urinary Tract Infection (UTI)',
      emergency: 'Seek immediate care if you develop high fever, chills, or back pain, which can signal a kidney infection.',
      whatIsIt: 'An infection in any part of your urinary system, most commonly causing a burning sensation during urination.',
      lifestyle: [
        '<strong>Drink Plenty of Water:</strong> Helps flush bacteria out of your urinary tract.',
        '<strong>Urinate Frequently:</strong> Do not hold your urine for long periods.'
      ]
    },
    {
      id: 'ear_infection',
      keywords: ['ear infection', 'earache', 'ear pain', 'muffled hearing'],
      category: 'Brain & Mental',
      title: 'Ear Infection',
      emergency: 'Seek medical care immediately if you notice fluid draining from the ear or severe dizziness.',
      whatIsIt: 'An infection of the middle ear, often causing pain, inflammation, and temporary hearing difficulty.',
      lifestyle: [
        '<strong>Apply Warm Compress:</strong> Hold a warm, dry cloth against the ear for comfort.',
        '<strong>Keep Dry:</strong> Keep water out of the ear canal while swimming or showering.'
      ]
    },
    {
      id: 'bronchitis',
      keywords: ['bronchitis', 'chest cold', 'mucus cough', 'hacking cough'],
      category: 'Lungs & Breathing',
      title: 'Acute Bronchitis',
      emergency: 'Seek emergency care if you cough up blood or experience severe chest pain and high fever.',
      whatIsIt: 'Inflammation of the bronchial tubes that carry air to and from your lungs, leading to a persistent cough.',
      lifestyle: [
        '<strong>Use a Humidifier:</strong> Adds moisture to the air to help loosen mucus.',
        '<strong>Avoid Smoke:</strong> Stay away from cigarette smoke and air pollution.'
      ]
    },
    {
      id: 'stomach_flu',
      keywords: ['stomach flu', 'gastroenteritis', 'stomach bug', 'vomiting', 'diarrhea'],
      category: 'Stomach & Digestion',
      title: 'Stomach Flu (Gastroenteritis)',
      emergency: 'Seek medical care if you cannot keep fluids down for 24 hours or show signs of severe dehydration.',
      whatIsIt: 'An intestinal infection marked by watery diarrhea, abdominal cramps, nausea, or vomiting.',
      lifestyle: [
        '<strong>Sip Clear Liquids:</strong> Drink small sips of water, broth, or electrolyte drinks.',
        '<strong>Bland Foods:</strong> Gradually reintroduce bland foods like crackers, toast, and rice.'
      ]
    },
    {
      id: 'sprained_ankle',
      keywords: ['sprained ankle', 'ankle injury', 'twisted ankle', 'swollen ankle'],
      category: 'Joints & Bones',
      title: 'Sprained Ankle',
      emergency: 'Seek medical evaluation if you cannot bear any weight on the foot or notice an obvious deformity.',
      whatIsIt: 'An injury that occurs when the strong ligaments supporting the ankle stretch beyond their normal limits or tear.',
      lifestyle: [
        '<strong>R.I.C.E. Method:</strong> Rest, Ice, Compression, and Elevation to reduce swelling.',
        '<strong>Avoid Strenuous Activity:</strong> Give the ligament time to fully heal before exercising.'
      ]
    },
    {
      id: 'sunburn',
      keywords: ['sunburn', 'sun burn', 'burned skin', 'red skin from sun'],
      category: 'Skin',
      title: 'Sunburn',
      emergency: 'Seek immediate care if you develop blistering over a large area, high fever, or confusion.',
      whatIsIt: 'Red, painful skin that appears after overexposure to ultraviolet (UV) rays from the sun.',
      lifestyle: [
        '<strong>Cool Compresses:</strong> Apply cool, damp cloths to the affected skin.',
        '<strong>Aloe Vera:</strong> Apply soothing aloe vera lotion to keep the skin hydrated.'
      ]
    },
    {
      id: 'constipation',
      keywords: ['constipation', 'trouble pooping', 'hard stool', 'irregularity'],
      category: 'Stomach & Digestion',
      title: 'Constipation',
      emergency: 'Seek medical help if constipation is accompanied by severe abdominal pain, vomiting, or rectal bleeding.',
      whatIsIt: 'Infrequent bowel movements or difficult passage of stools that persists for several weeks or longer.',
      lifestyle: [
        '<strong>High-Fiber Diet:</strong> Eat plenty of fruits, vegetables, beans, and whole grains.',
        '<strong>Stay Hydrated:</strong> Drinking plenty of water softens stool for easier passage.'
      ]
    }
  ],
  es: [
    {
      id: 'blood_pressure',
      keywords: ['presión arterial alta', 'hipertensión', 'presión arterial', 'pa'],
      category: 'Corazón y Sangre',
      title: 'Presión Arterial Alta (Hipertensión)',
      emergency: 'Busque atención de emergencia si experimenta dolor severo en el pecho, cambios repentinos en la visión, dolor de cabeza severo o dificultad para respirar.',
      whatIsIt: 'El corazón trabaja demasiado bombeando sangre, ejerciendo presión adicional sobre los vasos sanguíneos.',
      lifestyle: [
        '<strong>Reduzca la sal:</strong> Ayuda a disminuir el volumen y la presión arterial.',
        '<strong>Caminatas diarias:</strong> Mantiene los músculos del corazón fuertes y relajados.'
      ]
    },
    {
      id: 'anemia',
      keywords: ['anemia', 'hierro', 'debilidad', 'bajo hierro', 'fatiga'],
      category: 'Corazón y Sangre',
      title: 'Anemia (Bajo Hierro)',
      emergency: 'Busque atención de emergencia si se desmaya o experimenta falta de aire severa.',
      whatIsIt: 'Bajo nivel de hierro en la sangre que lo hace sentir constantemente débil, cansado y con frío.',
      lifestyle: [
        '<strong>Coma alimentos ricos en hierro:</strong> Espinacas, frijoles y carne roja.',
        '<strong>Agregue vitamina C:</strong> Ayuda a su cuerpo a absorber el hierro.'
      ]
    },
    {
      id: 'gout',
      keywords: ['gota', 'ácido úrico', 'dolor en el dedo', 'articulaciones'],
      category: 'Articulaciones y Huesos',
      title: 'Gota',
      emergency: 'Busque atención médica si una articulación está extremadamente dolorosa, caliente e hinchada, especialmente con fiebre.',
      whatIsIt: 'Un tipo de artritis causada por la acumulación de cristales de ácido úrico en las articulaciones, que a menudo comienza en el dedo gordo del pie.',
      lifestyle: [
        '<strong>Manténgase hidratado:</strong> Beba mucha agua para ayudar a eliminar el ácido úrico.',
        '<strong>Limite los alimentos ricos en purinas:</strong> Reduzca la carne roja, los mariscos y el alcohol.'
      ]
    },
    {
      id: 'diabetes',
      keywords: ['diabetes', 'azúcar', 'azúcar alta', 'tipo 2', 'glucosa'],
      category: 'Riñón y Azúcar',
      title: 'Diabetes (Tipo 2)',
      emergency: 'Busque atención inmediata por confusión extrema, aliento con olor a fruta o desmayos.',
      whatIsIt: 'El cuerpo no puede procesar el azúcar correctamente, lo que provoca niveles elevados de azúcar en la sangre.',
      lifestyle: [
        '<strong>Reduzca las bebidas azucaradas:</strong> Cambie los refrescos por agua pura.',
        '<strong>Camine después de las comidas:</strong> Ayuda a que los músculos utilicen el azúcar en la sangre.'
      ]
    },
    {
      id: 'asthma',
      keywords: ['asma', 'sibilancias', 'respiración', 'falta de aire'],
      category: 'Pulmones y Respiración',
      title: 'Asma',
      emergency: 'Busque atención de emergencia inmediatamente si su inhalador de rescate no funciona o si no puede terminar una frase debido a la falta de aire.',
      whatIsIt: 'Las vías respiratorias se estrechan y se hinchan, produciendo moco adicional que dificulta la respiración.',
      lifestyle: [
        '<strong>Identifique los desencadenantes:</strong> Evite el polvo, el humo y el polen.',
        '<strong>Mantenga el inhalador cerca:</strong> Lleve siempre su inhalador de rescate recetado.'
      ]
    },
    {
      id: 'migraine',
      keywords: ['migraña', 'dolor de cabeza', 'jaqueca', 'cabeza'],
      category: 'Cerebro y Mente',
      title: 'Migraña',
      emergency: 'Busque atención de emergencia por el "peor dolor de cabeza de su vida", entumecimiento repentino o dificultad para hablar.',
      whatIsIt: 'Una condición neurológica que causa un dolor punzante severo, generalmente en un lado de la cabeza, a menudo acompañado de sensibilidad a la luz y al sonido.',
      lifestyle: [
        '<strong>Descanse en una habitación oscura:</strong> Minimice los estímulos de luz y sonido durante un ataque.',
        '<strong>Mantenga la constancia:</strong> Mantenga horarios regulares de sueño y comidas.'
      ]
    },
    {
      id: 'reflux',
      keywords: ['reflujo ácido', 'acidez', 'gerd', 'ácido estomacal'],
      category: 'Estómago y Digestion',
      title: 'Reflujo Ácido (Acidez Estomacal)',
      emergency: 'Busque atención de emergencia si el dolor en el pecho se irradia al brazo o a la mandíbula, ya que esto podría indicar un ataque cardíaco en lugar de acidez estomacal.',
      whatIsIt: 'El ácido del estómago regresa al tubo que conecta la boca y el estómago, causando una sensación de ardor en el pecho.',
      lifestyle: [
        '<strong>Evite alimentos desencadenantes:</strong> Limite los alimentos picantes, grasosos, cafeína y cítricos.',
        '<strong>Manténgase erguido:</strong> Evite acostarse durante 2 a 3 horas después de comer.'
      ]
    },
    {
      id: 'cold_flu',
      keywords: ['gripe', 'resfriado', 'resfriado común', 'tos', 'fiebre', 'congestión'],
      category: 'Pulmones y Respiración',
      title: 'Resfriado Común y Gripe',
      emergency: 'Busque atención médica si experimenta fiebre alta persistente, dolor en el pecho o dificultad severa para respirar.',
      whatIsIt: 'Infecciones virales que afectan el tracto respiratorio superior, causando congestión, fatiga y tos.',
      lifestyle: [
        '<strong>Descanse y recupérese:</strong> Déle energía a su sistema inmunológico para combatir el virus.',
        '<strong>Beba líquidos tibios:</strong> El té, el caldo y el agua ayudan a calmar el dolor de garganta.'
      ]
    },
    {
      id: 'arthritis',
      keywords: ['artritis', 'dolor articular', 'articulaciones rígidas', 'dolor de rodilla'],
      category: 'Articulaciones y Huesos',
      title: 'Osteoartritis',
      emergency: 'Busque evaluación médica si el dolor articular se acompaña de hinchazón severa repentina, enrojecimiento o incapacidad para mover la articulación.',
      whatIsIt: 'El cartílago protector que amortigua los extremos de los huesos se desgasta con el tiempo, causando rigidez y dolor en las articulaciones.',
      lifestyle: [
        '<strong>Ejercicio de bajo impacto:</strong> Nadar o caminar ayuda a mantener las articulaciones flexibles.',
        '<strong>Mantenga un peso saludable:</strong> Reduce el estrés en las articulaciones que soportan peso como las rodillas y las caderas.'
      ]
    },
    {
      id: 'allergies',
      keywords: ['alergias', 'alergias estacionales', 'fiebre del heno', 'estornudos', 'polen'],
      category: 'Pulmones y Respiración',
      title: 'Alergias Estacionales (Fiebre del Heno)',
      emergency: 'Busque atención de emergencia inmediatamente si experimenta hinchazón de garganta o dificultad para respirar (signos de anafilaxia).',
      whatIsIt: 'Una reacción del sistema inmunológico a alérgenos al aire libre como el polen, el césped o el moho, causando estornudos y ojos acuosos.',
      lifestyle: [
        '<strong>Mantenga las ventanas cerradas:</strong> Use aire acondicionado durante las temporadas de alto polen.',
        '<strong>Dúchese antes de dormir:</strong> Elimina el polen acumulado en la piel y el cabello.'
      ]
    },
    {
      id: 'cholesterol',
      keywords: ['colesterol alto', 'colesterol', 'lípidos', 'grasa en sangre'],
      category: 'Corazón y Sangre',
      title: 'Colesterol Alto',
      emergency: 'Busque ayuda de emergencia si experimenta dolor en el pecho, dificultad para respirar o signos de un derrame cerebral.',
      whatIsIt: 'Demasiada sustancia grasa en la sangre, que puede acumularse dentro de las arterias y bloquear el flujo sanguíneo.',
      lifestyle: [
        '<strong>Coma grasas saludables:</strong> Elija aceite de oliva, aguacate y nueces en lugar de grasas saturadas.',
        '<strong>Aumente la fibra:</strong> Coma más avena, frijoles y granos enteros.'
      ]
    },
    {
      id: 'eczema',
      keywords: ['eczema', 'piel seca', 'piel con picazón', 'erupción', 'dermatitis'],
      category: 'Piel',
      title: 'Eczema (Dermatitis Atópica)',
      emergency: 'Busque atención médica si la piel se infecta, exuda pus o se acompaña de fiebre.',
      whatIsIt: 'Una condición crónica de la piel que hace que su piel esté roja, seca, agrietada y muy con picazón.',
      lifestyle: [
        '<strong>Hidrate diariamente:</strong> Aplique cremas espesas o ungüentos justo después de bañarse.',
        '<strong>Evite jabones agresivos:</strong> Use limpiadores suaves sin fragancia.'
      ]
    },
    {
      id: 'acne',
      keywords: ['acné', 'espinillas', 'brotes', 'granos'],
      category: 'Piel',
      title: 'Acné',
      emergency: 'Consulte a un médico si se forman quistes profundos y dolorosos que dejan cicatrices permanentes.',
      whatIsIt: 'Los folículos pilosos se tapan con grasa y células muertas de la piel, causando espinillas, puntos negros o puntos blancos.',
      lifestyle: [
        '<strong>Lave suavemente:</strong> Límpiese la cara dos veces al día con un limpiador suave y agua tibia.',
        '<strong>No los reviente:</strong> Picar los granos puede propagar bacterias y causar cicatrices.'
      ]
    },
    {
      id: 'anxiety',
      keywords: ['ansiedad', 'pánico', 'estrés', 'preocupación', 'nerviosismo'],
      category: 'Cerebro y Mente',
      title: 'Ansiedad Generalizada',
      emergency: 'Busque ayuda inmediata si experimenta un ataque de pánico severo con dolor en el pecho o pensamientos de autolesión.',
      whatIsIt: 'Preocupación y miedo persistentes y excesivos sobre situaciones cotidianas, a menudo acompañados de tensión física.',
      lifestyle: [
        '<strong>Respiración profunda:</strong> Practique ejercicios de respiración lenta y controlada para calmar el sistema nervioso.',
        '<strong>Limite la cafeína:</strong> Reduzca el café y las bebidas energéticas que pueden aumentar el nerviosismo.'
      ]
    },
    {
      id: 'depression',
      keywords: ['depresión', 'tristeza', 'mal humor', 'desesperanza'],
      category: 'Cerebro y Mente',
      title: 'Depresión Clínica',
      emergency: 'Busque ayuda profesional inmediata o llame a una línea de crisis si experimenta pensamientos de autolesión.',
      whatIsIt: 'Un trastorno del estado de ánimo que causa un sentimiento persistente de tristeza, vacío y pérdida de interés en las actividades.',
      lifestyle: [
        '<strong>Manténgase conectado:</strong> Comuníquese con amigos, familiares o consejeros de confianza.',
        '<strong>Establezca una rutina:</strong> Mantenga un horario de sueño regular y pruebe con movimiento diario ligero.'
      ]
    },
    {
      id: 'insomnia',
      keywords: ['insomnio', 'no puedo dormir', 'falta de sueño', 'problemas para dormir'],
      category: 'Cerebro y Mente',
      title: 'Insomnio',
      emergency: 'Consulte a un médico si la falta crónica de sueño causa un deterioro diurno severo o microsueños peligrosos.',
      whatIsIt: 'Un trastorno del sueño común que puede dificultar conciliar el sueño, mantenerse dormido o hacer que se despierte demasiado temprano.',
      lifestyle: [
        '<strong>Toque de queda de pantallas:</strong> Apague teléfonos y computadoras portátiles al menos 1 hora antes de acostarse.',
        '<strong>Horario constante:</strong> Acuérdese y levántese exactamente a la misma hora todos los días.'
      ]
    },
    {
      id: 'back_pain',
      keywords: ['dolor de espalda', 'dolor lumbar', 'dolor de columna'],
      category: 'Articulaciones y Huesos',
      title: 'Dolor Lumbar (Dolor de Espalda Baja)',
      emergency: 'Busque atención de emergencia si el dolor de espalda se acompaña de entumecimiento en las piernas o pérdida de control de la vejiga o los intestinos.',
      whatIsIt: 'Rigidez, dolor o incomodidad aguda en los músculos y vértebras de la espalda baja.',
      lifestyle: [
        '<strong>Manténgase activo:</strong> Caminar suavemente suele ser mejor para la recuperación que el reposo total en cama.',
        '<strong>Mejore la postura:</strong> Asegúrese de que su espacio de trabajo apoye su columna correctamente.'
      ]
    },
    {
      id: 'sinusitis',
      keywords: ['sinusitis', 'infección sinusal', 'nariz tapada', 'presión facial'],
      category: 'Lungs & Breathing',
      title: 'Infección Sinusal (Sinusitis)',
      emergency: 'Busque atención médica si experimenta dolor de cabeza severo, cambios en la visión o fiebre alta.',
      whatIsIt: 'Inflamación o hinchazón del tejido que recubre los senos paranasales, causando presión facial y congestión nasal.',
      lifestyle: [
        '<strong>Use enjuagues salinos:</strong> Enjuague las fosas nasales con un spray salino o neti pot.',
        '<strong>Manténgase hidratado:</strong> Beber mucha agua ayuda a diluir la mucosidad.'
      ]
    },
    {
      id: 'uti',
      keywords: ['itu', 'infección urinaria', 'ardor al orinar', 'infección de vejiga'],
      category: 'Riñón y Azúcar',
      title: 'Infección del Tracto Urinario (ITU)',
      emergency: 'Busque atención inmediata si desarrolla fiebre alta, escalofríos o dolor de espalda, lo que puede indicar una infección renal.',
      whatIsIt: 'Una infección en cualquier parte de su sistema urinario, que comúnmente causa una sensación de ardor al orinar.',
      lifestyle: [
        '<strong>Beba mucha agua:</strong> Ayuda a eliminar las bacterias del tracto urinario.',
        '<strong>Orine con frecuencia:</strong> No aguante la orina por largos periodos.'
      ]
    },
    {
      id: 'ear_infection',
      keywords: ['infección de oído', 'dolor de oído', 'oído adolorido'],
      category: 'Cerebro y Mente',
      title: 'Infección de Oído',
      emergency: 'Busque atención médica inmediatamente si nota líquido saliendo del oído o mareos severos.',
      whatIsIt: 'Una infección del oído medio, que a menudo causa dolor, inflamación y dificultad temporal para oír.',
      lifestyle: [
        '<strong>Aplique compresa tibia:</strong> Coloque un paño tibio y seco contra la oreja para mayor comodidad.',
        '<strong>Manténgase seco:</strong> Mantenga el agua fuera del canal auditivo al nadar o ducharse.'
      ]
    },
    {
      id: 'bronchitis',
      keywords: ['bronquitis', 'resfriado de pecho', 'tos con flema'],
      category: 'Lungs & Breathing',
      title: 'Bronquitis Aguda',
      emergency: 'Busque atención de emergencia si tos con sangre o experimenta dolor severo en el pecho y fiebre alta.',
      whatIsIt: 'Inflamación de los bronquios que llevan aire hacia y desde sus pulmones, lo que provoca una tos persistente.',
      lifestyle: [
        '<strong>Use un humidificador:</strong> Agrega humedad al aire para ayudar a aflojar la mucosidad.',
        '<strong>Evite el humo:</strong> Manténgase alejado del humo del cigarrillo y la contaminación del aire.'
      ]
    },
    {
      id: 'stomach_flu',
      keywords: ['gripe estomacal', 'gastroenteritis', 'virus estomacal', 'vómitos', 'diarrea'],
      category: 'Stomach & Digestion',
      title: 'Gripe Estomacal (Gastroenteritis)',
      emergency: 'Busque atención médica si no puede retener líquidos durante 24 horas o muestra signos de deshidratación severa.',
      whatIsIt: 'Una infección intestinal marcada por diarrea acuosa, calambres abdominales, náuseas o vómitos.',
      lifestyle: [
        '<strong>Beba líquidos claros en pequeños sorbos:</strong> Agua, caldo o bebidas con electrolitos.',
        '<strong>Alimentos blandos:</strong> Reintroduzca gradualmente alimentos blandos como galletas saladas, tostadas y arroz.'
      ]
    },
    {
      id: 'sprained_ankle',
      keywords: ['esguince de tobillo', 'lesión de tobillo', 'tobillo torcido', 'tobillo hinchado'],
      category: 'Articulaciones y Huesos',
      title: 'Esguince de Tobillo',
      emergency: 'Busque evaluación médica si no puede soportar ningún peso en el pie o nota una deformidad obvia.',
      whatIsIt: 'Una lesión que ocurre cuando los fuertes ligamentos que sostienen el tobillo se estiran más allá de sus límites normales o se desgarran.',
      lifestyle: [
        '<strong>Método R.I.C.E.:</strong> Reposo, Hielo, Compresión y Elevación para reducir la hinchazón.',
        '<strong>Evite actividades extenuantes:</strong> Déle tiempo al ligamento para sanar por completo antes de hacer ejercicio.'
      ]
    },
    {
      id: 'sunburn',
      keywords: ['quemadura solar', 'quemadura de sol', 'piel quemada'],
      category: 'Piel',
      title: 'Quemadura Solar',
      emergency: 'Busque atención inmediata si desarrolla ampollas en un área grande, fiebre alta o confusión.',
      whatIsIt: 'Piel roja y dolorosa que aparece después de una sobreexposición a los rayos ultravioleta (UV) del sol.',
      lifestyle: [
        '<strong>Compresas frías:</strong> Aplique paños fríos y húmedos sobre la piel afectada.',
        '<strong>Aloe vera:</strong> Aplique loción calmante de aloe vera para mantener la piel hidratada.'
      ]
    },
    {
      id: 'constipation',
      keywords: ['estreñimiento', 'problemas para defecar', 'heces duras'],
      category: 'Stomach & Digestion',
      title: 'Estreñimiento',
      emergency: 'Busque ayuda médica si el estreñimiento se acompaña de dolor abdominal severo, vómitos o sangrado rectal.',
      whatIsIt: 'Movimientos intestinales infrecuentes o paso difícil de heces que persiste durante varias semanas o más.',
      lifestyle: [
        '<strong>Dieta alta en fibra:</strong> Coma muchas frutas, verduras, frijoles y granos enteros.',
        '<strong>Manténgase hidratado:</strong> Beber mucha agua ablanda las heces para un paso más fácil.'
      ]
    }
  ],
  zh: [
    {
      id: 'blood_pressure',
      keywords: ['高血压', '血压高', '血压', 'bp'],
      category: '心脏与血液',
      title: '高血压',
      emergency: '如果出现严重胸痛、视力突然改变、剧烈头痛或呼吸困难，请立即就医。',
      whatIsIt: '心脏泵血时过于用力，给血管施加了额外的压力。',
      lifestyle: [
        '<strong>减少盐分摄入：</strong>有助于降低血容量和血压。',
        '<strong>每日散步：</strong>保持心肌强健放松。'
      ]
    },
    {
      id: 'anemia',
      keywords: ['贫血', '缺铁', '体虚', '低铁', '疲劳'],
      category: '心脏与血液',
      title: '贫血（缺铁性）',
      emergency: '如果您晕厥或出现严重气短，请立即就医。',
      whatIsIt: '血液中铁质不足，使您经常感到虚弱、疲倦和寒冷。',
      lifestyle: [
        '<strong>多吃富含铁的食物：</strong>菠菜、豆类和红肉。',
        '<strong>补充维生素C：</strong>有助于身体吸收铁质。'
      ]
    },
    {
      id: 'gout',
      keywords: ['痛风', '尿酸', '脚趾痛', '关节痛'],
      category: '关节与骨骼',
      title: '痛风',
      emergency: '如果关节极度疼痛、发热、红肿，尤其是伴随发烧时，请就医。',
      whatIsIt: '由于尿酸结晶在关节积聚而引起的一种关节炎，通常从大脚趾开始。',
      lifestyle: [
        '<strong>保持充足水分：</strong>多喝水以帮助排出尿酸。',
        '<strong>限制高嘌呤食物：</strong>减少红肉、贝类和酒精的摄入。'
      ]
    },
    {
      id: 'diabetes',
      keywords: ['糖尿病', '血糖', '高血糖', '2型', '葡萄糖'],
      category: '肾脏与血糖',
      title: '糖尿病（2型）',
      emergency: '如果出现极度神志不清、呼吸有烂苹果味或昏迷，请立即就医。',
      whatIsIt: '身体无法正常处理糖分，导致血糖水平升高。',
      lifestyle: [
        '<strong>减少含糖饮料：</strong>用白水代替苏打水。',
        '<strong>餐后散步：</strong>帮助肌肉消耗血糖。'
      ]
    },
    {
      id: 'asthma',
      keywords: ['哮喘', '喘息', '呼吸困难', '气短'],
      category: '肺部与呼吸',
      title: '哮喘',
      emergency: '如果急救吸入器无效，或因气短无法说完一句话，请立即寻求紧急护理。',
      whatIsIt: '气道变窄肿胀并产生额外粘液，使呼吸变得困难。',
      lifestyle: [
        '<strong>识别诱因：</strong>避免灰尘、烟雾和花粉。',
        '<strong>随身携带吸入器：</strong>务必携带医生开具的急救吸入器。'
      ]
    },
    {
      id: 'migraine',
      keywords: ['偏头痛', '头痛', '头部疼痛', '搏动性头痛'],
      category: '大脑与心理',
      title: '偏头痛',
      emergency: '如果出现“一生中最严重的头痛”、突然麻木或说话困难，请寻求紧急医疗护理。',
      whatIsIt: '一种导致头部剧烈搏动性疼痛的神经系统疾病，通常发生在一侧，常伴有对光线和声音的敏感。',
      lifestyle: [
        '<strong>在黑暗的房间休息：</strong>在发作期间尽量减少光线和声音刺激。',
        '<strong>保持规律：</strong>保持规律的睡眠和饮食时间表。'
      ]
    },
    {
      id: 'reflux',
      keywords: ['胃酸反流', '烧心', '胃食管反流', '胃酸'],
      category: '胃部与消化',
      title: '胃酸反流（烧心）',
      emergency: '如果胸痛扩散到手臂或下巴，请立即就医，因为这可能是心脏病发作而不是烧心。',
      whatIsIt: '胃酸回流到连接嘴和胃的管道中，在胸部引起灼烧感。',
      lifestyle: [
        '<strong>避免诱发食物：</strong>限制辛辣、油腻食物、咖啡因和柑橘类。',
        '<strong>保持直立：</strong>进食后2到3小时内避免躺下。'
      ]
    },
    {
      id: 'cold_flu',
      keywords: ['流感', '感冒', '普通感冒', '咳嗽', '发烧', '流鼻涕'],
      category: '肺部与呼吸',
      title: '普通感冒与流感',
      emergency: '如果持续高烧、胸痛或呼吸严重困难，请就医。',
      whatIsIt: '影响上呼吸道的病毒感染，会导致鼻塞、疲劳和咳嗽。',
      lifestyle: [
        '<strong>休息与恢复：</strong>为免疫系统提供能量来对抗病毒。',
        '<strong>喝温热液体：</strong>茶、肉汤和水有助于舒缓喉咙痛。'
      ]
    },
    {
      id: 'arthritis',
      keywords: ['关节炎', '关节痛', '关节僵硬', '膝盖痛'],
      category: '关节与骨骼',
      title: '骨关节炎',
      emergency: '如果关节疼痛伴随突然严重的肿胀、发红或无法活动，请进行医疗评估。',
      whatIsIt: '缓冲骨骼末端的保护性软骨随着时间推移而磨损，导致关节僵硬和疼痛。',
      lifestyle: [
        '<strong>低冲击运动：</strong>游泳或散步有助于保持关节灵活性。',
        '<strong>保持健康体重：</strong>减轻膝盖和臀部等承重关节的压力。'
      ]
    },
    {
      id: 'allergies',
      keywords: ['过敏', '季节性过敏', '花粉症', '打喷嚏', '花粉'],
      category: '肺部与呼吸',
      title: '季节性过敏（花粉症）',
      emergency: '如果出现喉咙肿胀或呼吸困难（过敏性休克的征兆），请立即寻求紧急护理。',
      whatIsIt: '免疫系统对户外过敏原（如花粉、草或霉菌）的反应，会导致打喷嚏和流泪。',
      lifestyle: [
        '<strong>关闭窗户：</strong>在高花粉季节使用空调。',
        '<strong>睡前洗澡：</strong>洗去皮肤和头发上积聚的花粉。'
      ]
    },
    {
      id: 'cholesterol',
      keywords: ['高胆固醇', '胆固醇', '血脂', '血液脂肪'],
      category: '心脏与血液',
      title: '高胆固醇',
      emergency: '如果出现胸痛、气短或中风迹象，请寻求紧急帮助。',
      whatIsIt: '血液中脂肪物质过多，会在动脉内部积聚并阻塞血流。',
      lifestyle: [
        '<strong>吃健康脂肪：</strong>选择橄榄油、牛油果和坚果，而不是饱和脂肪。',
        '<strong>增加纤维：</strong>多吃燕麦、豆类和全谷物。'
      ]
    },
    {
      id: 'eczema',
      keywords: ['湿疹', '皮肤干燥', '皮肤痒', '皮疹', '皮炎'],
      category: '皮肤',
      title: '湿疹（特应性皮炎）',
      emergency: '如果皮肤受到感染、流脓或伴有发烧，请就医。',
      whatIsIt: '一种长期的皮肤病，会使皮肤变红、干燥、龟裂且非常瘙痒。',
      lifestyle: [
        '<strong>每日保湿：</strong>沐浴后立即涂抹厚重的乳霜或软膏。',
        '<strong>避免刺激性肥皂：</strong>使用无香味的温和洁面乳。'
      ]
    },
    {
      id: 'acne',
      keywords: ['痤疮', '青春痘', '粉刺', '皮肤瑕疵', '长痘'],
      category: '皮肤',
      title: '痤疮（青春痘）',
      emergency: '如果形成痛苦的深层囊肿并留下永久疤痕，请咨询医生。',
      whatIsIt: '毛囊被油脂和死皮细胞堵塞，导致粉刺、黑头或白头。',
      lifestyle: [
        '<strong>温和清洗：</strong>每天用温和的洁面乳和温水洗脸两次。',
        '<strong>不要挤压：</strong>挤压粉刺会传播细菌并导致疤痕。'
      ]
    },
    {
      id: 'anxiety',
      keywords: ['焦虑', '恐慌', '压力', '担忧', '紧张'],
      category: '大脑与心理',
      title: '广泛性焦虑症',
      emergency: '如果经历伴随胸痛或自残想法的严重惊恐发作，请立即寻求帮助。',
      whatIsIt: '对日常情况的持续、过度担忧和恐惧，通常伴随着身体紧张。',
      lifestyle: [
        '<strong>深呼吸：</strong>练习缓慢、可控的呼吸练习来平静神经系统。',
        '<strong>限制咖啡因：</strong>减少会加剧神经过敏的咖啡和能量饮料。'
      ]
    },
    {
      id: 'depression',
      keywords: ['抑郁症', '悲伤', '情绪低落', '绝望'],
      category: '大脑与心理',
      title: '临床抑郁症',
      emergency: '如果出现自残想法，请立即寻求专业帮助或拨打危机热线。',
      whatIsIt: '一种情绪障碍，会导致持续的悲伤、空虚感以及对活动失去兴趣。',
      lifestyle: [
        '<strong>保持联系：</strong>向信任的朋友、家人或咨询师倾诉。',
        '<strong>建立规律：</strong>保持规律的睡眠时间表，并尝试轻度日常运动。'
      ]
    },
    {
      id: 'insomnia',
      keywords: ['失眠', '睡不着', '失眠症', '睡眠问题'],
      category: '大脑与心理',
      title: '失眠',
      emergency: '如果长期睡眠不足导致严重的日间功能受损或危险的微睡眠，请咨询医生。',
      whatIsIt: '一种常见的睡眠障碍，可能导致难以入睡、难以维持睡眠或醒得太早。',
      lifestyle: [
        '<strong>屏幕宵禁：</strong>睡前至少1小时关闭手机和笔记本电脑。',
        '<strong>规律作息：</strong>每天在完全相同的时间上床睡觉和起床。'
      ]
    },
    {
      id: 'back_pain',
      keywords: ['背痛', '下背痛', '腰痛', '脊椎痛'],
      category: '关节与骨骼',
      title: '下背痛（腰痛）',
      emergency: '如果背痛伴随腿部麻木或大小便失禁，请寻求紧急护理。',
      whatIsIt: '下背部肌肉和脊椎的僵硬、酸痛或刺痛不适。',
      lifestyle: [
        '<strong>保持活跃：</strong>温和的散步通常比完全卧床休息更有利于恢复。',
        '<strong>改善姿势：</strong>确保您的工作空间能正确支撑您的脊椎。'
      ]
    },
    {
      id: 'sinusitis',
      keywords: ['鼻窦炎', '鼻窦感染', '鼻塞', '面部压迫感'],
      category: '肺部与呼吸',
      title: '鼻窦炎（鼻窦感染）',
      emergency: '如果出现剧烈头痛、视力改变或高烧，请就医。',
      whatIsIt: '鼻窦内壁组织的炎症或肿胀，导致面部压力和鼻塞。',
      lifestyle: [
        '<strong>使用盐水冲洗：</strong>用盐水喷雾或洗鼻壶冲洗鼻腔。',
        '<strong>保持充足水分：</strong>多喝水有助于稀释粘液。'
      ]
    },
    {
      id: 'uti',
      keywords: ['尿路感染', '尿道炎', '小便灼痛', '膀胱感染'],
      category: '肾脏与血糖',
      title: '尿路感染（UTI）',
      emergency: '如果出现高烧、寒战或背痛（可能预示肾部感染），请立即就医。',
      whatIsIt: '泌尿系统任何部位的感染，通常在排尿时引起灼烧感。',
      lifestyle: [
        '<strong>多喝水：</strong>有助于将细菌冲出泌尿道。',
        '<strong>经常排尿：</strong>不要长时间憋尿。'
      ]
    },
    {
      id: 'ear_infection',
      keywords: ['耳部感染', '耳痛', '耳朵痛', '听力闷'],
      category: '大脑与心理',
      title: '耳部感染',
      emergency: '如果注意到耳朵流液或严重头晕，请立即就医。',
      whatIsIt: '中耳感染，通常会导致疼痛、发炎和暂时性听力困难。',
      lifestyle: [
        '<strong>热敷：</strong>将温暖干燥的毛巾敷在耳部以获得舒适感。',
        '<strong>保持干燥：</strong>游泳或淋浴时防止水分进入耳道。'
      ]
    },
    {
      id: 'bronchitis',
      keywords: ['支气管炎', '胸部感冒', '有痰咳嗽'],
      category: '肺部与呼吸',
      title: '急性支气管炎',
      emergency: '如果咳血或出现严重胸痛和高烧，请寻求紧急护理。',
      whatIsIt: '将空气输送到肺部的支气管发炎，导致持续咳嗽。',
      lifestyle: [
        '<strong>使用加湿器：</strong>增加空气湿度以帮助稀释粘液。',
        '<strong>避免烟雾：</strong>远离香烟烟雾和空气污染。'
      ]
    },
    {
      id: 'stomach_flu',
      keywords: ['胃肠炎', '胃流感', '胃病', '呕吐', '腹泻'],
      category: 'Stomach & Digestion',
      title: '胃肠炎（胃流感）',
      emergency: '如果24小时内无法留住液体或出现严重脱水迹象，请就医。',
      whatIsIt: '以水样腹泻、腹部绞痛、恶心或呕吐为特征的肠道感染。',
      lifestyle: [
        '<strong>小口喝清流质：</strong>水、肉汤或电解质饮料。',
        '<strong>清淡食物：</strong>逐渐恢复食用苏打饼干、吐司和米饭等清淡食物。'
      ]
    },
    {
      id: 'sprained_ankle',
      keywords: ['脚踝扭伤', '脚踝受伤', '扭伤脚踝', '脚踝肿胀'],
      category: '关节与骨骼',
      title: '脚踝扭伤',
      emergency: '如果足部无法承重或出现明显畸形，请进行医疗评估。',
      whatIsIt: '当支撑脚踝的强韧韧带拉伸超出正常极限或撕裂时发生的损伤。',
      lifestyle: [
        '<strong>R.I.C.E.原则：</strong>休息、冰敷、加压和抬高以减少肿胀。',
        '<strong>避免剧烈运动：</strong>在运动前给韧带充分的愈合时间。'
      ]
    },
    {
      id: 'sunburn',
      keywords: ['晒伤', '太阳灼伤', '皮肤晒红'],
      category: '皮肤',
      title: '晒伤',
      emergency: '如果在广阔区域出现水泡、高烧或意识模糊，请立即就医。',
      whatIsIt: '皮肤过度暴露于太阳紫外线(UV)后出现的红肿疼痛。',
      lifestyle: [
        '<strong>冷敷：</strong>将阴凉的湿布敷在受影响的皮肤上。',
        '<strong>芦荟：</strong>涂抹舒缓的芦荟乳液以保持皮肤水分。'
      ]
    },
    {
      id: 'constipation',
      keywords: ['便秘', '排便困难', '大便干燥'],
      category: 'Stomach & Digestion',
      title: '便秘',
      emergency: '如果便秘伴随剧烈腹痛、呕吐或直肠出血，请寻求医疗帮助。',
      whatIsIt: '排便次数少或大便排出困难，持续几周或更长时间。',
      lifestyle: [
        '<strong>高纤维饮食：</strong>多吃水果、蔬菜、豆类和全谷物。',
        '<strong>保持充足水分：</strong>多喝水使大便变软以便于排出。'
      ]
    }
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');

  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') runSearch();
    });
  }

  if (searchBtn) {
    searchBtn.addEventListener('click', runSearch);
  }
});

function changeLanguage() {
  const langSelect = document.getElementById('lang-select');
  if (!langSelect) return;
  
  currentLang = langSelect.value;
  const t = uiTranslations[currentLang] || uiTranslations.en;

  const titleEl = document.querySelector('.hero h1');
  const subtitleEl = document.querySelector('.hero p');
  const inputEl = document.getElementById('search-input');
  const btnEl = document.getElementById('search-btn');
  const whatLabelEl = document.getElementById('res-what-label');
  const lifestyleLabelEl = document.getElementById('res-lifestyle-label');

  if (titleEl) titleEl.innerText = t.title;
  if (subtitleEl) subtitleEl.innerText = t.subtitle;
  if (inputEl) inputEl.placeholder = t.placeholder;
  if (btnEl) btnEl.innerText = t.button;
  if (whatLabelEl) whatLabelEl.innerText = t.whatLabel;
  if (lifestyleLabelEl) lifestyleLabelEl.innerText = t.lifestyleLabel;

  if (activeConditionId) {
    renderCard();
  }
}

function runSearch() {
  const queryInput = document.getElementById('search-input');
  const card = document.getElementById('results-card');
  
  if (!queryInput || !card) return;
  
  const query = queryInput.value.toLowerCase().trim();
  if (!query) return;

  const currentDb = medicalDatabase[currentLang] || medicalDatabase.en;
  const matched = currentDb.find(item => {
    const inId = item.id.toLowerCase().includes(query);
    const inTitle = item.title.toLowerCase().includes(query);
    const inKeywords = item.keywords.some(k => k.toLowerCase().includes(query));
    return inId || inTitle || inKeywords;
  });

  if (matched) {
    activeConditionId = matched.id;
    renderCard();
  } else {
    card.style.display = 'block';
    document.getElementById('res-badge').innerText = '✨ ClearHealth';
    document.getElementById('res-title').innerText = currentLang === 'es' ? 'Condición no encontrada' : currentLang === 'zh' ? '未找到相关疾病' : 'Condition Not Found';
    document.getElementById('res-what-label').style.display = 'none';
    document.getElementById('res-lifestyle-label').style.display = 'none';
    
    let notFoundText = `We couldn't find "${query}".`;
    if (currentLang === 'es') notFoundText = `No pudimos encontrar "${query}".`;
    if (currentLang === 'zh') notFoundText = `未找到 "${query}"。`;
    
    document.getElementById('res-what-text').innerText = notFoundText;
    document.getElementById('res-action-grid').innerHTML = '';
    document.getElementById('emergency-box').style.display = 'none';
  }
}

function renderCard() {
  const currentDb = medicalDatabase[currentLang] || medicalDatabase.en;
  const condition = currentDb.find(item => item.id === activeConditionId);
  if (!condition) return;

  document.getElementById('res-what-label').style.display = 'block';
  document.getElementById('res-lifestyle-label').style.display = 'block';

  document.getElementById('res-badge').innerText = condition.category;
  document.getElementById('res-title').innerText = condition.title;
  document.getElementById('res-what-text').innerText = condition.whatIsIt;

  const emergencyBox = document.getElementById('emergency-box');
  const emergencyText = document.getElementById('res-emergency-text');
  if (condition.emergency && emergencyBox && emergencyText) {
    emergencyText.innerText = condition.emergency;
    emergencyBox.style.display = 'flex';
  } else if (emergencyBox) {
    emergencyBox.style.display = 'none';
  }

  const actionGrid = document.getElementById('res-action-grid');
  if (actionGrid) {
    actionGrid.innerHTML = '';
    condition.lifestyle.forEach(text => {
      const div = document.createElement('div');
      div.className = 'action-item';
      div.innerHTML = text;
      actionGrid.appendChild(div);
    });
  }

  document.getElementById('results-card').style.display = 'block';
}

function filterByCategory(categoryName, btnElement) {
  document.querySelectorAll('.chip-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const card = document.getElementById('results-card');
  if (categoryName === 'all') {
    card.style.display = 'none';
    return;
  }

  const currentDb = medicalDatabase[currentLang] || medicalDatabase.en;
  const found = currentDb.find(item => item.category.toLowerCase().includes(categoryName.toLowerCase()));
  if (found) {
    activeConditionId = found.id;
    renderCard();
  }
}

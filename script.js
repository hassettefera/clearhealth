let currentLang = 'en';
let activeConditionId = '';
let activeCategoryFilter = 'all';

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
  
  // Save preference
  localStorage.setItem('theme', newTheme);
}

// Load saved theme choice
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  initSearchEngine();
});

// Interface Translations
const uiTranslations = {
  en: {
    title: "Medical information, simplified.",
    subtitle: "Understand your health in simple, everyday language.",
    placeholder: "Search a condition (e.g., Diabetes, Asthma)...",
    button: "Search",
    whatLabel: "What is it?",
    lifestyleLabel: "Simple Daily Tips:",
    emergencyLabel: "When to Seek Immediate Care:"
  },
  es: {
    title: "Información médica, simplificada.",
    subtitle: "Comprenda su salud en un lenguaje sencillo y cotidiano.",
    placeholder: "Busque una condición (ej. Diabetes)...",
    button: "Buscar",
    whatLabel: "¿Qué es?",
    lifestyleLabel: "Consejos diarios sencillos:",
    emergencyLabel: "Cuándo buscar atención inmediata:"
  },
  zh: {
    title: "医学信息，通俗易懂。",
    subtitle: "用最简单的日常语言了解您的健康状况。",
    placeholder: "输入疾病名称 (例如：糖尿病)...",
    button: "搜索",
    whatLabel: "简单来说是什么？",
    lifestyleLabel: "日常小贴士：",
    emergencyLabel: "何时需要立即就医："
  },
  am: {
    title: "የሕክምና መረጃ፣ በቀላሉ የቀረበ።",
    subtitle: "ስለ ጤናዎ በቀላል የዕለት ተዕለት ቋንቋ ይረዱ።",
    placeholder: "የበሽታውን ስም ያስገቡ (ምሳሌ፦ ስኳር በሽታ)...",
    button: "ፈልግ",
    whatLabel: "ምንድን ነው?",
    lifestyleLabel: "ቀላል የዕለት ተዕለት ምክሮች፦",
    emergencyLabel: "ወዲያውኑ ወደ ህክምና መሄድ የሚገባዎት መቼ ነው፦"
  },
  vi: {
    title: "Thông tin y tế, đơn giản hóa.",
    subtitle: "Hiểu sức khỏe của bạn bằng ngôn ngữ bình dân dễ hiểu.",
    placeholder: "Nhập tên bệnh (ví dụ: Tiểu Đường)...",
    button: "Tìm kiếm",
    whatLabel: "Nó là gì?",
    lifestyleLabel: "Mẹo nhỏ hàng ngày:",
    emergencyLabel: "Khi nào cần đi cấp cứu ngay:"
  }
};

// Full Medical Database
const medicalDatabase = [
  {
    id: 'blood_pressure',
    keywords: ['high blood pressure', 'hypertension', 'blood pressure', 'presion alta', '高血压', 'ደም ግፊት', 'cao huyết áp'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'High Blood Pressure', es: 'Presión Arterial Alta', zh: '高血压', am: 'ከፍተኛ የደም ግፊት', vi: 'Cao Huyết Áp' },
    emergency: {
      en: "Seek emergency care if you experience severe chest pain, sudden vision changes, severe headache, or trouble breathing.",
      es: "Busque atención de emergencia si tiene dolor de pecho intenso, cambios repentinos en la vista, dolor de cabeza muy fuerte o dificultad para respirar.",
      zh: "如果出现剧烈胸痛、突然视力改变、剧烈头痛或呼吸困难，请立即就医。",
      am: "ከባድ የደረት ህመም፣ የብዥታ ስሜት፣ ከፍተኛ የራስ ምታት ወይም የመተንፈስ ችግር ካጋጠመዎት ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu bị đau ngực dữ dội, mờ mắt đột ngột, đau đầu dữ dội hoặc khó thở."
    },
    whatIsIt: {
      en: "Think of your blood vessels like a garden hose. High blood pressure means the fluid inside is pushing way too hard against the hose walls, which wears out your heart over time.",
      es: "Piense en sus venas como una manguera de jardín. La presión alta significa que la sangre empuja demasiado fuerte las paredes de la manguera, lo que cansa a su corazón.",
      zh: "把您的血管想象成水管。高血压意味着里面的血液对水管壁的推力过大，时间久了会让心脏吃不消。",
      am: "የደም ሥሮችዎን እንደ ውሃ ቱቦ ያስቡ። ከፍተኛ የደም ግፊት ማለት በውስጡ ያለው ደም በቱቦው ግድግዳ ላይ በጣም በኃይል እየገፋ ነው ማለት ነው፡",
      vi: "Hãy tưởng tượng mạch máu như vòi nước. Cao huyết áp là khi dòng máu đẩy quá mạnh vào thành ống, làm tim mệt mỏi theo thời gian."
    },
    lifestyle: {
      en: ["<strong>Cut Back on Salt:</strong> Too much salt makes your body hold onto extra water, raising pressure.", "<strong>Daily Walk:</strong> A simple 20 to 30 minute walk helps your heart relax."],
      es: ["<strong>Menos sal:</strong> La sal hace que el cuerpo retenga agua y suba la presión.", "<strong>Caminata diaria:</strong> Caminar 20 o 30 minutos ayuda a relajar el corazón."],
      zh: ["<strong>少吃盐：</strong> 盐分太多数体会积聚多余水分，推高血压。", "<strong>每天散步：</strong> 散步20到30分钟有助于让心脏放松。"],
      am: ["<strong>ጨው መቀነስ፦</strong> ብዙ ጨው በሰውነት ውስጥ ውሃ እንዲከማች በማድረግ ግፊትን ይጨምራል።", "<strong>የቀን ጉዞ፦</strong> በቀን ለ20-30 ደቂቃ መራመድ ልብን ያረጋጋል።"],
      vi: ["<strong>Giảm ăn muối:</strong> Ăn nhiều muối làm cơ thể tích nước, làm tăng áp lực.", "<strong>Đi bộ hàng ngày:</strong> Đi bộ 20-30 phút giúp tim thư giãn hơn."]
    }
  },
  {
    id: 'diabetes',
    keywords: ['diabetes', 'high blood sugar', 'azucar alta', '糖尿病', 'ስኳር በሽታ', 'tiểu đường'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'Diabetes (High Sugar)', es: 'Diabetes (Azúcar Alta)', zh: '糖尿病', am: 'ስኳር በሽታ', vi: 'Bệnh Tiểu Đường' },
    emergency: {
      en: "Seek immediate care if you experience confusion, fruity-smelling breath, extreme drowsiness, or rapid breathing.",
      es: "Busque atención inmediata si siente confusión, aliento con olor a fruta, somnolencia extrema o respiración muy rápida.",
      zh: "如果出现神志不清、呼吸有水果味、极度嗜睡或呼吸急促，请立即就医。",
      am: "የመደናገጥ ስሜት፣ የአፍ ሽታ መለወጥ፣ ከፍተኛ እንቅልፍ ማጣጣፍ ወይም ፈጣን ትንፋሽ ካለዎት ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu bạn bị lú lẫn, hơi thở có mùi trái cây, quá buồn ngủ hoặc thở dồn dập."
    },
    whatIsIt: {
      en: "When you eat, food turns into sugar for energy. Diabetes means your body loses its ability to move that sugar into your muscle cells, leaving it trapped floating in your blood.",
      es: "Al comer, la comida se convierte en azúcar para dar energía. La diabetes pasa cuando el cuerpo no puede mover ese azúcar a los músculos, dejándolo atrapado en la sangre.",
      zh: "吃东西时，食物会变成糖来提供能量。糖尿病意味着身体没办法把糖送进肌肉里，导致糖卡在血液中。",
      am: "ምግብ ሲመገቡ ወደ ስኳር ተለውጦ ጉልበት ይሰጣል። ስኳር በሽታ ማለት ሰውነትዎ ያንን ስኳር ወደ ህዋሳት ማስገባት ሲያቅተው ነው።",
      vi: "Khi ăn, thức ăn biến thành đường để tạo năng lượng. Bệnh tiểu đường là khi cơ thể không đưa được đường vào tế bào, khiến đường bị kẹt lại trong máu."
    },
    lifestyle: {
      en: ["<strong>Watch Soda & Juice:</strong> Drink water or tea instead of sugary drinks.", "<strong>Move After Eating:</strong> A quick walk after meals helps clear sugar out of your blood."],
      es: ["<strong>Cuidado con los refrescos:</strong> Tome agua en lugar de bebidas dulces.", "<strong>Muévase tras comer:</strong> Caminar un poco después de comer ayuda a bajar el azúcar."],
      zh: ["<strong>少喝甜饮：</strong> 用白开水或茶代替含糖饮料和果汁。", "<strong>饭后走走：</strong> 饭后散散步能帮助消耗血液中的糖分。"],
      am: ["<strong>ለጣፋጭ መጠጦች ጥንቃቄ፦</strong> በጣፋጭ መጠጦች பதிலாக ውሃ ይጠጡ።", "<strong>ከተመገቡ በኋላ መራመድ፦</strong> ከምግብ በኋላ መራመድ በደም ውስጥ ያለውን ስኳር ለመቀነስ ይረዳል።"],
      vi: ["<strong>Hạn chế nước ngọt:</strong> Uống nước lọc thay vì đồ uống có đường.", "<strong>Vận động sau khi ăn:</strong> Đi bộ nhẹ sau bữa ăn giúp giảm đường trong máu."]
    }
  },
  {
    id: 'flu',
    keywords: ['flu', 'influenza', 'fever', 'cough', 'gripe', '感冒', '流感', 'ጉንፋን', 'cúm'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'Flu (Influenza)', es: 'Gripe (Influenza)', zh: '流感', am: 'ጉንፋን (Flu)', vi: 'Bệnh Cúm' },
    emergency: {
      en: "Seek emergency care if you experience persistent chest pain, difficulty breathing, bluish lips, or confusion.",
      es: "Busque atención médica de emergencia si siente dolor de pecho constante, dificultad para respirar o confusión.",
      zh: "如果出现持续性胸痛、呼吸困难、嘴唇发青或神志不清，请立即就医。",
      am: "የደረት ህመም፣ የመተንፈስ ችግር ወይም መደናገጥ ካጋጠመዎት ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu bị đau ngực kéo dài, khó thở, môi tím tái hoặc lú lẫn."
    },
    whatIsIt: {
      en: "The flu is a contagious viral infection that attacks your nose, throat, and lungs. Unlike a regular cold, it strikes suddenly and brings high fever, chills, and full-body aches.",
      es: "La gripe es una infección viral contagiosa que ataca la nariz, garganta y pulmones. Da fiebre alta, escalofríos y dolor en todo el cuerpo.",
      zh: "流感是一种具有传染性的病毒感染，会侵袭您的鼻、咽喉和肺部。它通常突然发作，带来高烧、发冷和浑身酸痛。",
      am: "ጉንፋን በቫይረስ የሚመጣ የመተንፈሻ አካላት ህመም ነው። በድንገት የሚመጣ ሲሆን ከፍተኛ ትኩሳት እና የመላ ሰውነት ህመም ያመጣል።",
      vi: "Cúm là bệnh nhiễm trùng do vi-rút lây lan, tấn công mũi, họng và phổi. Nó xuất hiện đột ngột gây sốt cao, rét run và đau nhức toàn thân."
    },
    lifestyle: {
      en: ["<strong>Rest Completely:</strong> Stay home so your body can channel all energy into fighting the virus.", "<strong>Drink Warm Fluids:</strong> Tea, broth, and water prevent dehydration and ease sore throats."],
      es: ["<strong>Descanse totalmente:</strong> Quédese en casa para que su cuerpo luche contra el virus.", "<strong>Tome líquidos tibios:</strong> Té o caldos evitan la deshidratación y calman la garganta."],
      zh: ["<strong>充分休息：</strong> 待在家中，以便身体能集中精力对抗病毒。", "<strong>补充温热流质：</strong> 茶水和汤水能防止脱水并缓解咽喉不适。"],
      am: ["<strong>በቂ እረፍት ማድረግ፦</strong> ሰውነትዎ ቫይረሱን እንዲዋጋ ቤትዎ ያርፉ።", "<strong>ሞቅ ያለ ፈሳሽ መጠጣት፦</strong> ሻይ እና ሾርባ መጠጣት ድርቀትን ይከላከላል።"],
      vi: ["<strong>Nghỉ ngơi tuyệt đối:</strong> Ở nhà để cơ thể dồn sức chống lại vi-rút.", "<strong>Uống nhiều nước ấm:</strong> Nước ấm, trà hoặc canh giúp chống mất nước và dịu cổ họng."]
    }
  },
  {
    id: 'asthma',
    keywords: ['asthma', 'breathing trouble', 'asma', '哮喘', 'አስም', 'hen suyễn'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'Asthma', es: 'Asma', zh: '哮喘', am: 'አስም', vi: 'Bệnh Hen Suyễn' },
    emergency: {
      en: "Go to ER immediately if your inhaler doesn't help, your lips/fingernails turn blue, or you are struggling to speak complete sentences.",
      es: "Vaya a emergencias si su inhalador no ayuda, sus labios se ponen azules o no puede hablar frases completas.",
      zh: "如果吸入剂无效、唇字或指甲发青、或者无法说出完整句子，请立即前往急诊室。",
      am: "መድኃኒቱ ካልረዳዎት፣ ከንፈርዎ ወይም ጥፍርዎ ወደ ሰማያዊ ከተቀየረ ወይም ሙሉ ዓረፍተ ነገር መናገር ካልቻሉ ወዲያውኑ ወደ ድንገተኛ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu bình xịt không có tác dụng, môi/móng tay bị tím tái, hoặc không thể nói tròn câu."
    },
    whatIsIt: {
      en: "Asthma makes the breathing tubes in your lungs get tight and swollen. During a flare-up, it feels like trying to breathe through a skinny coffee straw.",
      es: "El asma hace que los tubos por donde respira se aprieten e hinchen. Se siente como tratar de tomar aire a través de un popote muy delgado.",
      zh: "哮喘会让肺部里的气管变紧、变肿。发作时，感觉就像在尝试用一根细小的咖啡吸管来呼吸。",
      am: "አስም የመተንፈሻ ቱቦዎችዎ እንዲጠቡ ያደርጋል። ህመሙ ሲነሳ በጠባብ ቱቦ ለመተንፈስ እንደመሞከር ያህል ይከብዳል።",
      vi: "Hen suyễn làm các ống thở trong phổi bị thắt chặt và sưng lên. Khi lên cơn hen, bạn cảm thấy như đang cố thở qua một chiếc ống hút nhỏ."
    },
    lifestyle: {
      en: ["<strong>Avoid Dust & Smoke:</strong> Stay away from cigarette smoke and dust.", "<strong>Keep Inhaler Nearby:</strong> Always know where your rescue inhaler is."],
      es: ["<strong>Evite humo y polvo:</strong> Aléjese del humo de cigarro y polvo.", "<strong>Inhalador a la mano:</strong> Tenga siempre cerca su inhalador."],
      zh: ["<strong>远离灰尘烟雾：</strong> 远离二手烟和重灰尘。", "<strong>随身带吸入剂：</strong> 确保随时能拿到急救喷雾。"],
      am: ["<strong>ከጢስ መራቅ፦</strong> ከሲጋራ ጢስ እና ከአቧራ እራስዎን ይጠብቁ።", "<strong>መድኃኒት መያዝ፦</strong> የመተንፈሻ መድኃኒትዎን ቅርብ ያድርጉ።"],
      vi: ["<strong>Tránh bụi & khói:</strong> Tránh xa khói thuốc và bụi bẩn.", "<strong>Mang theo bình xịt:</strong> Luôn mang theo bình xịt cấp cứu."]
    }
  },
  {
    id: 'pneumonia',
    keywords: ['pneumonia', 'lung infection', 'neumonia', '肺炎', 'የሳንባ ምች', 'viêm phổi'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'Pneumonia', es: 'Neumonía', zh: '肺炎', am: 'የሳንባ ምች', vi: 'Viêm Phổi' },
    emergency: {
      en: "Seek emergency care immediately if you have trouble breathing, persistent high fever, or severe chest pain when coughing.",
      es: "Busque atención médica inmediata si le cuesta respirar, tiene fiebre alta persistente o dolor severo al toser.",
      zh: "如果出现呼吸困难、持续高烧或咳嗽时胸部剧痛，请立即就医。",
      am: "ለመተንፈስ ከከበደዎት፣ ከፍተኛ ትኩሳት ካልወረደ ወይም በሚስሉበት ጊዜ ከባድ የደረት ህመም ካለዎት ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu bạn khó thở, sốt cao không hạ hoặc đau ngực dữ dội khi ho."
    },
    whatIsIt: {
      en: "Pneumonia is an infection that fills the tiny air sacks inside your lungs with fluid or gunk. It causes painful coughing, high fevers, and makes it tough to catch your breath.",
      es: "Es una infección que llena de líquido los sacos de aire de los pulmones. Causa tos con dolor, fiebre alta y dificultad para respirar.",
      zh: "肺炎是一种让肺里的小气囊填满液体或黏液的感染。它会导致咳嗽时胸痛、发高烧，并且让人喘不过气来。",
      am: "የሳንባ ምች በሳንባ ውስጥ ያሉ አየር ከረጢቶችን በፈሳሽ የሚሞላ ኢንፌክሽን ነው። ህመም ያለው ሳል፣ ትኩሳት እና የመተንፈስ ችግር ያመጣል።",
      vi: "Viêm phổi là nhiễm trùng làm các túi khí trong phổi bị đập đầy dịch hoặc đờm. Nó gây ho đau ngực, sốt cao và vô cùng khó thở."
    },
    lifestyle: {
      en: ["<strong>Get Bed Rest:</strong> Your body needs energy to fight off germs.", "<strong>Sip Warm Liquids:</strong> Warm water or broth thins out chest gunk."],
      es: ["<strong>Mucho reposo:</strong> El cuerpo necesita energía para vencer los gérmenes.", "<strong>Líquidos tibios:</strong> El agua tibia o caldos ayudan a aflojar las flemas."],
      zh: ["<strong>卧床休息：</strong> 身体需要节省体力来与病菌抗争。", "<strong>喝点温热液体：</strong> 喝温水或热汤有助于化解胸口黏液。"],
      am: ["<strong>በቂ እረፍት ማድረግ፦</strong> ሰውነትዎ በሽታውን ለመዋጋት ጉልበት ያስፈልገዋል።", "<strong>ሞቅ ያለ ፈሳሽ መጠጣት፦</strong> ሞቅ ያለ ውሃ ወይም ሾርባ አክታን ለማስወገድ ይረዳል።"],
      vi: ["<strong>Nghỉ ngơi trên giường:</strong> Cơ thể cần dồn năng lượng để chống lại vi khuẩn.", "<strong>Uống nước ấm:</strong> Nước ấm giúp làm loãng đờm trong ngực."]
    }
  },
  {
    id: 'sleep_apnea',
    keywords: ['sleep apnea', 'snoring', 'apnea del sueño', 'ronquidos', '睡眠呼吸暂停', 'የእንቅልፍ ችግር', 'ngưng thở khi ngủ'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'Sleep Apnea (Snoring)', es: 'Apnea del Sueño (Ronquidos)', zh: '睡眠打鼾 (暂停)', am: 'የእንቅልፍ አፕኒያ', vi: 'Ngưng Thở Khi Ngủ' },
    emergency: {
      en: "Seek medical help if you gasp for air while sleeping or wake up feeling choked and short of breath.",
      es: "Consulte al médico si despierta ahogándose, buscando aire o con falta de aliento intensa.",
      zh: "如果在睡觉时突然呛醒、感怠窒息或严重喘不上气，请寻求医疗帮助。",
      am: "በእንቅልፍዎ ወቅት አየር አጥሮዎት የሚነቁ ከሆነ ወዲያውኑ ሐኪም ያማክሩ።",
      vi: "Đi khám bác sĩ nếu bạn tỉnh dậy trong tình trạng nghẹt thở, hụt hơi hoặc ngạt khí."
    },
    whatIsIt: {
      en: "Sleep apnea happens when your throat muscles relax too much while sleeping, momentarily closing off your airway. It causes loud snoring and leaves you feeling exhausted all day.",
      es: "Pasa cuando los músculos de la garganta se relajan tanto al dormir que tapan el aire. Causa ronquidos fuertes y mucho cansancio de día.",
      zh: "睡眠呼吸暂停是在睡觉时，喉咙肌肉过于放松，短暂堵住了气道。这会导致大声打鼾，而且即使睡很久白天也很累。",
      am: "ይህ የሚከሰተው በእንቅልፍ ወቅት የጉሮሮ ጡንቻዎች በጣም ስለሚላሉ አየር እንዳይገባ ሲከለክሉ ነው። ከፍተኛ ማንኮራፋት እና በቀን ውስጥ ድካም ያመጣል።",
      vi: "Xảy ra khi cơ họng quá thư giãn lúc ngủ, làm nghẽn đường thở tạm thời. Nó gây ngáy to và khiến bạn kiệt sức vào ban ngày."
    },
    lifestyle: {
      en: ["<strong>Sleep on Your Side:</strong> Sleeping on your back lets your tongue block your throat easily.", "<strong>Avoid Late Drinks:</strong> Alcohol right before bed relaxes throat muscles too much."],
      es: ["<strong>Duerma de lado:</strong> Dormir boca arriba facilita que se tape la garganta.", "<strong>Evite alcohol de noche:</strong> El alcohol relaja demasiado la garganta."],
      zh: ["<strong>尝试侧睡：</strong> 平躺着睡觉会让舌头很容易堵住喉咙。", "<strong>睡前不喝酒：</strong> 睡前喝酒会让喉咙肌肉过分松弛。"],
      am: ["<strong>በጎን መተኛት፦</strong> በጀርባ መተኛት ጉሮሮ በቀላሉ እንዲዘጋ ያደርጋል።", "<strong>ማታ አልኮል አለመጠጣት፦</strong> ማታ አልኮል መጠጣት የጉሮሮ ጡንቻዎችን በጣም ያላልያል።"],
      vi: ["<strong>Tập nằm nghiêng:</strong> Nằm ngửa khiến lưỡi dễ trôi về sau làm chèn họng.", "<strong>Tránh uống rượu muộn:</strong> Rượu trước khi ngủ làm cơ họng bị nhão quá mức."]
    }
  },
  {
    id: 'gout',
    keywords: ['gout', 'uric acid', 'gota', '痛风', 'ጋውት', 'bệnh gút'],
    category: { en: 'Joint Pain', es: 'Dolor de Articulaciones', zh: '关节疼痛', am: 'መገጣጠሚያ', vi: 'Đau Khớp' },
    title: { en: 'Gout', es: 'Gota', zh: '痛风', am: 'ጋውት', vi: 'Bệnh Gút' },
    emergency: {
      en: "Seek medical care if joint pain is accompanied by high fever or skin that is breaking open and warm to the touch.",
      es: "Consulte al médico si el dolor viene acompañado de fiebre alta o si la piel sobre la articulación se rompe.",
      zh: "如果关节疼痛伴有高烧或关节周围皮肤破损、发热，请及时就医。",
      am: "የመገጣጠሚያ ህመሙ ከከፍተኛ ትኩሳት ጋር ከሆነ ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi khám ngay nếu đau khớp đi kèm sốt cao hoặc da vùng khớp bị lở loét, nóng đỏ."
    },
    whatIsIt: {
      en: "Gout is a sudden, intense joint pain that usually strikes your big toe, ankle, or knee. It happens when tiny crystals build up inside a joint, making it red, hot, and painful.",
      es: "La gota es un dolor repentino y muy fuerte en las articulaciones. Pasa cuando se forman cristales filosos por dentro, dejando la zona roja y muy sensible.",
      zh: "痛风是一种突如其来的剧烈关节痛，通常发生在脚大拇指。这是因为关节里堆积了微小结晶，让关节变红、发烫、极度疼痛。",
      am: "ጋውት በእግር እጣቢ ወይም ቁርጭምጭሚት ላይ በድንገት የሚመጣ ከፍተኛ ህመም ነው። በመገጣጠሚያ ውስጥ ትንንሽ ነገሮች ስለሚከማቹ ቦታው እንዲቀላ እና እንዲቃጠል ያደርጋል።",
      vi: "Gút là cơn đau khớp đột ngột, dữ dội, thường ở ngón chân cái. Nó xảy ra khi các tinh thể tích tụ trong khớp, khiến khớp đỏ, nóng và cực kỳ đau."
    },
    lifestyle: {
      en: ["<strong>Drink Water:</strong> Water washes out sharp crystals before they settle.", "<strong>Limit Red Meat & Alcohol:</strong> Steak and beer trigger these painful attacks."],
      es: ["<strong>Tome mucha agua:</strong> El agua ayuda a expulsar los cristales.", "<strong>Menos carne y cerveza:</strong> La carne roja y el alcohol provocan estos ataques."],
      zh: ["<strong>大量喝水：</strong> 多喝水能把微小的结晶冲走。", "<strong>少吃红肉与饮酒：</strong> 红肉和啤酒很容易诱发剧烈疼痛。"],
      am: ["<strong>ብዙ ውሃ መጠጣት፦</strong> ውሃ ህመም የሚያመጡትን ነገሮች ከሰውነት ያጥባል።", "<strong>ስጋ እና አልኮል መቀነስ፦</strong> ቀይ ስጋ እና ቢራ ህመሙን ያባብሱታል።"],
      vi: ["<strong>Uống nhiều nước:</strong> Nước giúp cuốn trôi các tinh thể ra ngoài.", "<strong>Hạn chế thịt đỏ & rượu:</strong> Thịt bò và bia rất dễ gây ra cơn đau này."]
    }
  },
  {
    id: 'arthritis',
    keywords: ['arthritis', 'joint pain', 'osteoarthritis', 'dolor articular', '关节炎', 'የአጥንት መገጣጠሚያ ህመም', 'viêm khớp'],
    category: { en: 'Joint Pain', es: 'Dolor de Articulaciones', zh: '关节疼痛', am: 'መገጣጠሚያ', vi: 'Đau Khớp' },
    title: { en: 'Joint Pain (Arthritis)', es: 'Dolor de Articulaciones (Artritis)', zh: '关节炎', am: 'የመገጣጠሚያ ህመም', vi: 'Viêm Khớp' },
    emergency: {
      en: "Seek care if a joint suddenly becomes swollen, red, hot, and completely impossible to move.",
      es: "Busque atención si una articulación se hincha, se pone roja, muy caliente y no la puede mover.",
      zh: "如果关节突然红肿、发热并且完全无法移动，请立即就医。",
      am: "መገጣጠሚያዎ በድንገት ካበጠ፣ ከቀላ እና ማንቀሳቀስ ካልቻሉ ወደ ህክምና ይሂዱ።",
      vi: "Đi khám ngay nếu một khớp đột ngột bị sưng, đỏ, nóng và hoàn toàn không thể cử động."
    },
    whatIsIt: {
      en: "Your joints have smooth cushions so bones don't rub together. Arthritis is when those cushions wear down over time, making joints feel stiff, swollen, and creaky.",
      es: "Las articulaciones tienen cojinetes suaves para que los huesos no rocen. La artritis pasa cuando esos cojinetes se desgastan, dejando las coyunturas tiesas.",
      zh: "关节里有平滑的天然“垫片”防止骨头相互摩擦。关节炎就是这些垫片磨损了，导致关节僵硬、肿胀。",
      am: "መገጣጠሚያዎችዎ አጥንቶች እንዳይፋጩ የሚያደርግ ለስላሳ ነገር አላቸው። አርትራይተስ ማለት ይህ ለስላሳ ነገር ሲያልቅ እና መገጣጠሚያዎች ሲጠናከሩ ነው።",
      vi: "Các khớp có lớp đệm tự nhiên để xương không cọ vào nhau. Viêm khớp là khi lớp đệm đó bị mòn, làm khớp bị cứng và sưng."
    },
    lifestyle: {
      en: ["<strong>Gentle Water Exercises:</strong> Swimming keeps joints loose without strain.", "<strong>Warm Compresses:</strong> A warm towel calms morning stiffness."],
      es: ["<strong>Ejercicios en agua:</strong> Nadar no lastima las coyunturas.", "<strong>Calor suave:</strong> Una compresa caliente alivia la rigidez."],
      zh: ["<strong>水中运动：</strong> 游泳能在不加重负担的情况下保持关节灵活。", "<strong>热敷缓解：</strong> 温毛巾热敷能减轻关节僵硬感。"],
      am: ["<strong>የውሃ እንቅስቃሴ፦</strong> ዋና መዋኘት መገጣጠሚያዎችን ሳይጎዳ እንዲላሉ ያደርጋል።", "<strong>ሞቅ ያለ ጨርቅ፦</strong> ሞቅ ያለ ጨርቅ ማድረግ ጥንካሬን ይቀንሳል።"],
      vi: ["<strong>Tập thể dục dưới nước:</strong> Bơi lội giúp khớp linh hoạt mà không bị áp lực.", "<strong>Chườm ấm:</strong> Dùng khăn ấm chườm giúp giảm cứng khớp."]
    }
  },
  {
    id: 'kidney_stones',
    keywords: ['kidney stones', 'calculos renales', 'renales', '肾结石', 'የኩላሊት ድንጋይ', 'sỏi thận'],
    category: { en: 'Kidney & Urinary', es: 'Riñones y Orina', zh: '肾脏与排尿', am: 'ሽንት', vi: 'Thận & Tiết Niệu' },
    title: { en: 'Kidney Stones', es: 'Cálculos Renales (Piedras)', zh: '肾结石', am: 'የኩላሊት ድንጋይ', vi: 'Sỏi Thận' },
    emergency: {
      en: "Seek immediate care if back pain is unbearable, or if you have blood in your urine, fever, or severe vomiting.",
      es: "Busque atención inmediata si el dolor de espalda es insoportable, o si ve sangre en la orina o tiene fiebre.",
      zh: "如果背痛剧烈难以忍受，或者出现血尿、发烧、严重呕吐，请立即就医。",
      am: "የጀርባ ህመሙ ከባድ ከሆነ፣ ወይም በሽንትዎ ውስጥ ደም ካዩ ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu đau lưng không thể chịu nổi, hoặc thấy có máu trong nước tiểu, sốt, nôn mửa."
    },
    whatIsIt: {
      en: "Kidney stones are small, hard pebble-like clumps that form inside your kidneys when you don't drink enough water. When they move, they can cause sharp pain in your back or lower belly.",
      es: "Son pequeñas piedritas duras que se forman por no tomar suficiente agua. Al moverse, causan un dolor muy agudo en la espalda o el abdomen.",
      zh: "肾结石是没喝够水时在肾脏里形成的小硬块。当它们在体内移动时，会在后背或下腹部引起剧痛。",
      am: "የኩላሊት ድንጋይ በቂ ውሃ ባለመጠጣት በኩላሊት ውስጥ የሚፈጠሩ ትንንሽ ድንጋዮች ናቸው። በሚንቀሳቀሱበት ጊዜ በጀርባ ላይ ከፍተኛ ህመም ያመጣሉ።",
      vi: "Sỏi thận là những viên sỏi nhỏ, cứng hình thành khi bạn uống không đủ nước. Khi di chuyển, chúng gây đau nhói ở lưng hoặc bụng."
    },
    lifestyle: {
      en: ["<strong>Guzzle Water:</strong> Drink water throughout the day so your pee stays clear.", "<strong>Go Easy on Salt:</strong> High salt foods cause stone-forming stuff in your urine."],
      es: ["<strong>Tome agua constantemente:</strong> Su orina debe verse clara.", "<strong>Baje la sal:</strong> La sal favorece la formación de estas piedritas."],
      zh: ["<strong>多补充水分：</strong> 让尿液保持清澈或淡黄色。", "<strong>少吃咸食：</strong> 盐分太高的食物更容易生成石头。"],
      am: ["<strong>ውሃ ማበዛት፦</strong> ሽንትዎ መልክ የሌለው እስኪሆን ድረስ በቂ ውሃ ይጠጡ።", "<strong>ጨው መቀነስ፦</strong> ጨዋማ ምግቦች ለድንጋይ መፈጠር ምክንያት ይሆናሉ።"],
      vi: ["<strong>Uống nước liên tục:</strong> Giữ cho nước tiểu luôn có màu nhạt hoặc trong.", "<strong>Ăn nhạt đi:</strong> Thức ăn mặn làm tăng nguy cơ hình thành sỏi."]
    }
  },
  {
    id: 'uti',
    keywords: ['uti', 'urinary tract infection', 'infeccion urinaria', '尿路感染', 'የሽንት ቧንቧ ኢንፌክሽን', 'viêm đường tiết niệu'],
    category: { en: 'Kidney & Urinary', es: 'Riñones y Orina', zh: '肾脏与排尿', am: 'ሽንት', vi: 'Thận & Tiết Niệu' },
    title: { en: 'Urinary Infection (UTI)', es: 'Infección Urinaria', zh: '尿路感染', am: 'የሽንት ቧንቧ ኢንፌክሽን', vi: 'Viêm Đường Tiết Niệu' },
    emergency: {
      en: "Seek urgent care if you develop lower back/flank pain, shaking chills, high fever, or nausea.",
      es: "Busque atención urgente si siente dolor en la espalda baja, escalofríos con temblor, fiebre alta o náuseas.",
      zh: "如果出现腰背部/侧腹疼痛、发抖发冷、高烧或恶心，请立即就医（这可能意味着肾脏感染）。",
      am: "የጀርባ ህመም፣ ከፍተኛ ትኩሳት ወይም የማስመለስ ስሜት ካለዎት ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi khám ngay nếu bạn bị đau lưng/hông, sốt cao run người hoặc nôn mửa."
    },
    whatIsIt: {
      en: "A UTI happens when unwanted bacteria sneak into your urinary tract. It makes you feel like you have to pee constantly, and it stings or burns when you go.",
      es: "Ocurre cuando entran bacterias a las vías urinarias. Da la sensación de querer ir al baño a cada rato y causa un ardor molesto.",
      zh: "当细菌溜进尿道时就会发生尿路感染。它会让你一直想上厕所，而且排尿时会有刺痛或热辣感。",
      am: "የሽንት ቧንቧ ኢንፌክሽን የሚከሰተው ባክቴሪያ ወደ ሽንት ቱቦ ሲገባ ነው። በየደቂቃው እንዲሸኑ ያደርጋል እና በሚሸኑበት ጊዜ ያቃጥላል።",
      vi: "Viêm đường tiết niệu xảy ra khi vi khuẩn xâm nhập vào đường tiểu. Nó khiến bạn muốn đi tiểu liên tục và thấy buốt rát khi đi."
    },
    lifestyle: {
      en: ["<strong>Flush it Out with Water:</strong> Drinking water helps wash germs out.", "<strong>Don't Hold Your Pee:</strong> Go to the bathroom as soon as you feel the urge."],
      es: ["<strong>Tome mucha agua:</strong> Beber agua ayuda a expulsar los gérmenes.", "<strong>No se aguante:</strong> Vaya al baño en cuanto sienta ganas."],
      zh: ["<strong>多喝水冲走细菌：</strong> 多喝水能帮助把细菌冲刷出去。", "<strong>千万不要憋尿：</strong> 一有尿意就立刻上厕所。"],
      am: ["<strong>በውሃ ማጽዳት፦</strong> ብዙ ውሃ መጠጣት ጀርሞች እንዲወጡ ይረዳል።", "<strong>ሽንት አለመያዝ፦</strong> ሽንት ሲመጣዎት ወዲያውኑ ይሸኑ።"],
      vi: ["<strong>Uống nhiều nước:</strong> Uống nước giúp dội sạch vi khuẩn ra ngoài.", "<strong>Không nhịn tiểu:</strong> Đi tiểu ngay khi bạn thấy buồn đi."]
    }
  },
  {
    id: 'gerd',
    keywords: ['gerd', 'acid reflux', 'heartburn', 'reflujo', '胃食管反流', 'የሆድ ቃጠሎ', 'trào ngược axit'],
    category: { en: 'Stomach & Digestion', es: 'Estómago y Digestión', zh: '肠胃与消化', am: 'ሆድ', vi: 'Dạ Dày & Tiêu Hóa' },
    title: { en: 'Acid Reflux (Heartburn)', es: 'Reflujo Ácido (Ardor)', zh: '胃酸反流', am: 'የሆድ ቃጠሎ', vi: 'Trào Ngược Axit' },
    emergency: {
      en: "Seek emergency care if heartburn feels like a crushing chest pain spreading to your arm or jaw.",
      es: "Busque atención de emergencia si el ardor se siente como un dolor opresivo que se extiende al brazo o la mandíbula.",
      zh: "如果胃烧心伴有胸部压迫感并扩散至手臂或下巴，请立即就医（这可能是心脏问题）。",
      am: "የሆድ ቃጠሎው ወደ እጅዎ ወይም ወደ መንገጭላዎ የሚሄድ ከባድ ህመም ከሆነ ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu cảm giác nóng rát lan ra tay hoặc hàm kèm đau thắt ngực."
    },
    whatIsIt: {
      en: "The valve at the top of your stomach is supposed to stay closed. Acid reflux happens when strong stomach juices leak back up into your throat, creating a burning feeling in your chest.",
      es: "La tapa del estómago debe quedarse cerrada. El reflujo pasa cuando el jugo del estómago se regresa a la garganta, causando un ardor caliente.",
      zh: "胃顶部的“门”本该是关紧的。胃酸反流就是胃酸往上漏到了食道里，导致胸口产生灼烧感。",
      am: "የሆድዎ በር ተዘጋጅቶ መቆየት አለበት። የሆድ ቃጠሎ የሚከሰተው የሆድ አሲድ ወደ ጉሮሮዎ ተመልሶ ሲፈስ እና ሲያቃጥልዎት ነው።",
      vi: "Nắp dạ dày đáng lẽ phải đóng kín. Trào ngược xảy ra khi dịch axit rò rỉ ngược lên họng, gây cảm giác nóng rát ở ngực."
    },
    lifestyle: {
      en: ["<strong>Don't Lie Down After Eating:</strong> Stay upright for 2 to 3 hours after meals.", "<strong>Eat Smaller Meals:</strong> Stuffing your stomach forces the valve open."],
      es: ["<strong>No se acueste rápido:</strong> Espere 2 o 3 horas después de comer.", "<strong>Coma platos pequeños:</strong> Llenarse demasiado empuja el ácido hacia arriba."],
      zh: ["<strong>饭后不要立刻躺下：</strong> 饭后保持坐立2到3小时。", "<strong>少食多餐：</strong> 吃得太饱会把胃顶部的“门”顶开。"],
      am: ["<strong>ከተመገቡ በኋላ አለመተኛት፦</strong> ከተመገቡ በኋላ ለ2-3 ሰዓታት ሳይተኙ ይቆዩ።", "<strong>ትንሽ መመገብ፦</strong> ሆድን በጣም መሙላት አሲዱ ወደ ላይ እንዲወጣ ያደርገዋል።"],
      vi: ["<strong>Không nằm ngay sau khi ăn:</strong> Giữ tư thế ngồi/đứng 2-3 tiếng sau ăn.", "<strong>Chia nhỏ bữa ăn:</strong> Ăn quá no sẽ đẩy nắp dạ dày mở ra."]
    }
  },
  {
    id: 'anemia',
    keywords: ['anemia', 'iron', 'hierro', '贫血', 'አኔሚያ', 'thiếu máu'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'Anemia (Low Iron)', es: 'Anemia (Hierro Bajo)', zh: '贫血', am: 'አኔሚያ (የደም ማነስ)', vi: 'Thiếu Máu' },
    emergency: {
      en: "Seek urgent medical attention if you faint, pass out, or experience extreme shortness of breath with a racing heart.",
      es: "Busque atención médica urgente si se desmaya, pierde el conocimiento o siente falta de aire extrema.",
      zh: "如果发昏昏厥、昏倒、或伴有心率过快和严重呼吸困难，请立即就医。",
      am: "ራሱን ካሳተዎት ወይም የመተንፈስ እጥረት ካጋጠመዎት ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi khám ngay nếu bạn bị ngất xỉu, mất trí nhớ tạm thời hoặc hụt hơi dữ dội."
    },
    whatIsIt: {
      en: "Red blood cells carry oxygen like delivery trucks. Anemia means you don't have enough of these trucks, making your body feel weak, dizzy, and short of breath.",
      es: "Los glóbulos rojos llevan oxígeno como camiones. La anemia significa que no tiene suficientes camiones, sintiéndose débil y mareado.",
      zh: "红细胞就像在体内运送氧气的卡车。贫血意味着卡车数量不够，导致身体感到虚弱、头晕、喘不上气。",
      am: "የደም ሕዋሳት ኦክስጅንን እንደሚያጓጉዙ መኪናዎች ናቸው። አኔሚያ ማለት በቂ መኪናዎች ስለሌሉዎት አካልዎ ይደክማል እና ያዞርዎታል።",
      vi: "Tế bào máu giống như xe chở oxy. Thiếu máu là khi không có đủ xe, khiến bạn thấy yếu, chóng mặt và mệt."
    },
    lifestyle: {
      en: ["<strong>Eat Iron Foods:</strong> Spinach, beans, and red meat help build new blood cells.", "<strong>Pair with Vitamin C:</strong> Oranges help your tummy absorb iron better."],
      es: ["<strong>Coma hierro:</strong> La espinaca, frijoles y carne ayudan a crear sangre.", "<strong>Sume Vitamina C:</strong> Las naranjas ayudan a absorber el hierro."],
      zh: ["<strong>多吃含铁食物：</strong> 菠菜、豆类和红肉有助于制造新的血液。", "<strong>搭配维C：</strong> 吃橙子能让肠胃更好地吸收铁质。"],
      am: ["<strong>በብረት የበለፀጉ ምግቦች፦</strong> ቆስጣ፣ ምስር እና ስጋ ደም ለመተካት ይረዳሉ።", "<strong>ቪታሚን ሲ መጠቀም፦</strong> ብርቱካን መመገብ ብረቱን በቀላሉ እንዲወስድ ይረዳል።"],
      vi: ["<strong>Ăn thực phẩm giàu sắt:</strong> Rau chân vịt, đậu và thịt giúp tạo máu.", "<strong>Kết hợp Vitamin C:</strong> Ăn cam giúp dạ dày hấp thu sắt tốt hơn."]
    }
  },
  {
    id: 'thyroid',
    keywords: ['hypothyroidism', 'thyroid', 'tiroides', '甲状腺功能减退', 'ታይሮይድ', 'suy giáp'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'Underactive Thyroid', es: 'Tiroides Lenta', zh: '甲状腺偏低 (甲减)', am: 'የታይሮይድ እጥረት', vi: 'Suy Giáp' },
    emergency: {
      en: "Seek care if you experience severe confusion, an unusually slow heart rate, or extreme intolerance to cold.",
      es: "Consulte al médico si siente confusión severa, ritmo cardíaco muy lento o frío insoportable.",
      zh: "如果出现严重神志不清、心率异常缓慢或极其怕冷，请寻求医疗帮助。",
      am: "ከፍተኛ የመደናገጥ ስሜት ወይም በጣም ዝቅተኛ የልብ ምት ካለዎት ወደ ህክምና ይሂዱ።",
      vi: "Đi khám ngay nếu bạn bị lú lẫn nặng, nhịp tim chậm bất thường hoặc quá sợ lạnh."
    },
    whatIsIt: {
      en: "Think of your thyroid like your body's internal battery. When it runs on 'low battery,' your whole body slows down—making you feel exhausted, cold, and slow.",
      es: "Su tiroides es como la batería de su cuerpo. Si funciona en 'batería baja', todo su cuerpo se alenta, haciéndolo sentir cansado y con frío.",
      zh: "把甲状腺想象成身体的电池。当它“电量低”时，整个身体的运转都会变慢——让您感到疲劳、怕冷。",
      am: "ታይሮይድዎን እንደ ሰውነትዎ ባትሪ ያስቡት። ባትሪው ሲያልቅ ሰውነትዎ ይደክማል፡ ሁልጊዜ ቅዝቃዜ እና ድካም ይሰማዎታል።",
      vi: "Hãy tưởng tượng tuyến giáp như cục pin cơ thể. Khi 'yếu pin', toàn bộ cơ thể sẽ chạy chậm lại—khiến bạn mệt mỏi và lạnh."
    },
    lifestyle: {
      en: ["<strong>Pace Yourself:</strong> Take breaks so you don't drain all energy.", "<strong>Keep Doctor Appointments:</strong> Daily medication helps recharge your internal battery."],
      es: ["<strong>Tómelo con calma:</strong> Descanse a lo largo del día.", "<strong>Consulte a su médico:</strong> Una pastilla diaria ayuda a recargar su energía."],
      zh: ["<strong>注意休息：</strong> 白天留出休息时间，不要耗尽精力。", "<strong>按时看医生：</strong> 按时吃药能帮身体重新充满电。"],
      am: ["<strong>እረፍት ማድረግ፦</strong> ጉልበትዎ እንዳያልቅ በቀኑ ውስጥ እረፍት ያድርጉ።", "<strong>ሐኪም ማየት፦</strong> በየቀኑ መድኃኒት መውሰድ ባትሪውን ለመሙላት ይረዳል።"],
      vi: ["<strong>Phân bổ sức lực:</strong> Nghỉ ngơi hợp lý trong ngày.", "<strong>Uống thuốc đều đặn:</strong> Thuốc hàng ngày giúp sạc lại năng lượng."]
    }
  },
  {
    id: 'migraine',
    keywords: ['migraine', 'headache', 'dolor de cabeza', 'migraña', '偏头痛', 'የራስ ምታት', 'đau nửa đầu'],
    category: { en: 'Joint Pain', es: 'Dolor de Articulaciones', zh: '关节疼痛', am: 'መገጣጠሚያ', vi: 'Đau Khớp' },
    title: { en: 'Migraine', es: 'Migraña', zh: '偏头痛', am: 'የራስ ምታት (Migraine)', vi: 'Đau Nửa Đầu' },
    emergency: {
      en: "Seek emergency care if a headache comes on suddenly like a thunderclap, or is accompanied by fever, stiff neck, or numbness.",
      es: "Busque atención de emergencia si el dolor es repentino y fulminante, o viene con cuello rígido o entumecimiento.",
      zh: "如果头痛突如其来且剧烈无比，或伴有发烧、颈部僵硬、面部麻木，请立即就医。",
      am: "የራስ ምታቱ በድንገት እና በኃይል የመጣ ከሆነ፣ ወይም ከአንገት ጥንካሬ ጋር ከሆነ ወዲያውኑ ወደ ህክምና ይሂዱ።",
      vi: "Đi cấp cứu ngay nếu đau đầu xuất hiện đột ngột dữ dội, hoặc kèm sốt, cứng cổ, tê người."
    },
    whatIsIt: {
      en: "A migraine is a severe, pounding throbbing usually on one side of your head that makes bright light, noise, and smells feel painful.",
      es: "Es un latido intenso en un lado de la cabeza que hace que la luz y el ruido sean insoportables.",
      zh: "偏头痛不只是普通头痛——它是头部一侧剧烈的跳痛，会让光线和噪音变得难以忍受。",
      am: "ይህ ተራ የራስ ምታት አይደለም፤ በጭንቅላትዎ በአንድ በኩል የሚመታ ከፍተኛ ህመም ሲሆን ለብርሃን እና ድምፅ ተጎጂ ያደርጋል።",
      vi: "Đau nửa đầu là cơn đau nhói dữ dội ở một bên đầu, khiến bạn sợ ánh sáng và tiếng ồn."
    },
    lifestyle: {
      en: ["<strong>Rest in a Dark Room:</strong> Turn off lights and screens when throbbing starts.", "<strong>Drink Water Early:</strong> Dehydration is a major migraine trigger."],
      es: ["<strong>Descanse en lo oscuro:</strong> Apague luces y pantallas en cuanto empiece el dolor.", "<strong>Tome agua pronto:</strong> La falta de agua es la causa principal."],
      zh: ["<strong>在暗处休息：</strong> 感觉头痛开始时，立刻关掉灯光和屏幕。", "<strong>及时喝水：</strong> 脱水是引发偏头痛的常见原因。"],
      am: ["<strong>ጨለማ ክፍል ማረፍ፦</strong> ህመሙ ሲጀምር መብራት እና ስልክ ያጥፉ።", "<strong>ውሃ መጠጣት፦</strong> የውሃ እጥረት ለራስ ምታት ዋነኛ ምክንያት ነው።"],
      vi: ["<strong>Nghỉ ngơi trong phòng tối:</strong> Tắt đèn và màn hình ngay khi đau.", "<strong>Uống nước sớm:</strong> Thiếu nước là nguyên nhân hàng đầu gây đau nửa đầu."]
    }
  },
  {
    id: 'anxiety',
    keywords: ['anxiety', 'stress', 'ansiedad', 'estres', '焦虑', 'ጭንቀት', 'lo âu'],
    category: { en: 'Joint Pain', es: 'Dolor de Articulaciones', zh: '关节疼痛', am: 'መገጣጠሚያ', vi: 'Đau Khớp' },
    title: { en: 'Anxiety & Worry', es: 'Ansiedad y Estrés', zh: '焦虑与紧张', am: 'ጭንቀት', vi: 'Lo Âụ & Căng Thẳng' },
    emergency: {
      en: "Seek medical assessment if severe panic attacks make you feel like you are losing control or having a heart attack.",
      es: "Busque ayuda médica si ataques de pánico severos le hacen sentir que pierde el control o sufre un ataque al corazón.",
      zh: "如果严重的恐慌发作让您觉得无法控制自己或感到心脏病发作，请寻求医生帮助。",
      am: "ከፍተኛ የጭንቀት ስሜት የልብ ምትዎን በጣም ካፋጠነው እና መቆጣጠር ካልቻሉ ወደ ህክምና ይሂዱ።",
      vi: "Đi khám ngay nếu cơn hoảng loạn dữ dội khiến bạn cảm thấy mất kiểm soát hoặc giống như lên cơn đau tim."
    },
    whatIsIt: {
      en: "Anxiety triggers your body's emergency alarm even when there is no real danger nearby. It makes your heart race, your stomach twist, and your head spin.",
      es: "La ansiedad activa la alarma de emergencia del cuerpo sin haber peligro real. Hace que el corazón lata rápido y la mente no pare.",
      zh: "即使周围没有危险，焦虑也会拉响身体的“紧急警报”。它会让人心跳加速、胃里翻江倒海。",
      am: "ጭንቀት ምንም አደጋ በሌለበት ጊዜ እንኳን የሰውነትዎን የማስጠንቀቂያ ደወል ያበራል። የልብ ምት እንዲፋጠን እና እንዲጨነቁ ያደርጋል።",
      vi: "Lo âu kích hoạt báo động khẩn cấp của cơ thể ngay cả khi không có nguy hiểm. Nó làm tim đập nhanh và đầu óc lo lắng không ngừng."
    },
    lifestyle: {
      en: ["<strong>Slow Breathing:</strong> Inhale slowly for 4 seconds, hold for 4, exhale slowly.", "<strong>Cut Back on Coffee:</strong> Too much caffeine acts like gasoline on an anxious mind."],
      es: ["<strong>Respire despacio:</strong> Inhale en 4 segundos, sostenga 4 y exhale lento.", "<strong>Menos café:</strong> La cafeína empeora los nervios."],
      zh: ["<strong>缓慢深呼吸：</strong> 吸气4秒，憋气4秒，然后慢慢呼出。", "<strong>少喝咖啡：</strong> 摄入过多咖啡因就像给焦虑“火上浇油”。"],
      am: ["<strong>ቀስ ብሎ መተንፈስ፦</strong> ለ4 ሰከንድ አየር ወደ ውስጥ ማስገባት እና ቀስ ብሎ ማውጣት።", "<strong>ቡና መቀነስ፦</strong> ቡና ማበዛት ጭንቀቱን ያባብሰዋል።"],
      vi: ["<strong>Hít thở sâu:</strong> Hít vào 4 giây, giữ 4 giây, rồi thở ra thật chậm.", "<strong>Bớt cà phê:</strong> Quá nhiều caffeine sẽ làm tâm trạng lo âu tệ hơn."]
    }
  }
];

let fuseInstance;

function initSearchEngine() {
  if (typeof Fuse !== 'undefined') {
    fuseInstance = new Fuse(medicalDatabase, {
      includeScore: true,
      threshold: 0.4,
      keys: ['keywords', 'id']
    });
  }
}

// Fixed Filter Chips Functionality
function filterByCategory(categoryName, element) {
  activeCategoryFilter = categoryName;

  // Update active chip styling
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => chip.classList.remove('active'));
  if (element) {
    element.classList.add('active');
  }

  if (categoryName === 'all') {
    document.getElementById('results-card').style.display = 'none';
    activeConditionId = '';
    return;
  }

  // Find condition matching selected category
  const match = medicalDatabase.find(item => item.category.en === categoryName);
  if (match) {
    activeConditionId = match.id;
    renderCard();
  } else {
    document.getElementById('results-card').style.display = 'none';
  }
}

function runSearch() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const card = document.getElementById('results-card');
  if (!query) return;

  if (!fuseInstance) initSearchEngine();

  const results = fuseInstance ? fuseInstance.search(query) : [];
  if (results.length > 0) {
    activeConditionId = results[0].item.id;
    renderCard();
  } else {
    card.style.display = 'block';
    document.getElementById('res-badge').innerText = 'Notice';
    document.getElementById('res-title').innerText = 'Condition Not Found';
    document.getElementById('res-what-text').innerText = `We couldn't find anything for "${query}". Try searching for terms like "Diabetes", "Flu", or "Asthma".`;
    document.getElementById('res-action-grid').innerHTML = '';
    document.getElementById('emergency-box').style.display = 'none';
  }
}

function quickSearch(conditionId) {
  activeConditionId = conditionId;
  renderCard();
}

function changeLanguage() {
  currentLang = document.getElementById('lang-select').value;
  updateUIText();
  if (activeConditionId) {
    renderCard();
  }
}

function updateUIText() {
  const langData = uiTranslations[currentLang] || uiTranslations.en;
  document.getElementById('search-title').innerText = langData.title;
  document.getElementById('search-subtitle').innerText = langData.subtitle;
  document.getElementById('search-input').placeholder = langData.placeholder;
  document.getElementById('search-btn').innerText = langData.button;
  document.getElementById('res-what-label').innerText = langData.whatLabel;
  document.getElementById('res-lifestyle-label').innerText = langData.lifestyleLabel;
  document.getElementById('res-emergency-label').innerText = langData.emergencyLabel;
}

function renderCard() {
  const condition = medicalDatabase.find(item => item.id === activeConditionId);
  if (!condition) return;

  document.getElementById('res-badge').innerText = condition.category[currentLang] || condition.category.en;
  document.getElementById('res-title').innerText = condition.title[currentLang] || condition.title.en;
  document.getElementById('res-what-text').innerText = condition.whatIsIt[currentLang] || condition.whatIsIt.en;

  // Emergency Alert Box
  const emergencyBox = document.getElementById('emergency-box');
  if (condition.emergency) {
    document.getElementById('res-emergency-text').innerText = condition.emergency[currentLang] || condition.emergency.en;
    emergencyBox.style.display = 'flex';
  } else {
    emergencyBox.style.display = 'none';
  }

  // Lifestyle Grid
  const actionGrid = document.getElementById('res-action-grid');
  actionGrid.innerHTML = '';
  const items = condition.lifestyle[currentLang] || condition.lifestyle.en;
  items.forEach(text => {
    const div = document.createElement('div');
    div.className = 'action-item';
    div.innerHTML = text;
    actionGrid.appendChild(div);
  });

  document.getElementById('results-card').style.display = 'block';
}

let currentLang = 'en';
let activeConditionId = '';

// Register Service Worker for Offline Functionality
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

// UI Setup
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

// UI Text Translations
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
  },
  zh: {
    title: "简化医疗信息。",
    subtitle: "用简单通俗的语言了解您的健康状况。",
    placeholder: "搜索疾病（如：糖尿病、流感、痛风）...",
    button: "搜索",
    whatLabel: "这是什么？",
    lifestyleLabel: "日常简单建议：",
    emergencyLabel: "何时需要立即就医："
  },
  am: {
    title: "የሕክምና መረጃ፣ በቀላል መንገድ።",
    subtitle: "ጤናዎን በቀላል እና በዕለት ተዕለት ቋንቋ ይረዱ።",
    placeholder: "በሽታ ይፈልጉ (ምሳሌ፦ ስኳር፣ ጉንፋን)...",
    button: "ፈልግ",
    whatLabel: "ምንድን ነው?",
    lifestyleLabel: "ቀላል የዕለት ተዕለት ምክሮች፦",
    emergencyLabel: "ወዲያውኑ ሕክምና ማግኘት ያለብዎት መቼ ነው፦"
  },
  vi: {
    title: "Thông tin y tế, đơn giản hóa.",
    subtitle: "Hiểu về sức khỏe của bạn bằng ngôn ngữ dễ hiểu hàng ngày.",
    placeholder: "Tìm kiếm bệnh (ví dụ: Tiểu đường, Cúm)...",
    button: "Tìm kiếm",
    whatLabel: "Nó là gì?",
    lifestyleLabel: "Mẹo đơn giản hàng ngày:",
    emergencyLabel: "Khi nào cần đi cấp cứu ngay:"
  }
};

// Medical Database (25 Conditions)
const medicalDatabase = [
  // --- Heart, Blood, & Circulation ---
  {
    id: 'blood_pressure',
    keywords: ['high blood pressure', 'hypertension', 'blood pressure', 'presion alta', '高血压', 'ደም ግፊት', 'cao huyết áp'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'High Blood Pressure (Hypertension)', es: 'Presión Arterial Alta', zh: '高血压', am: 'ከፍተኛ የደም ግፊት', vi: 'Cao Huyết Áp' },
    emergency: { 
      en: 'Seek emergency care if you experience severe chest pain, sudden vision changes, severe headache, or trouble breathing.',
      es: 'Busque atención de emergencia si tiene dolor de pecho intenso, cambios en la vista o dificultad para respirar.',
      zh: '如果出现剧烈胸痛、突发视力变化、剧烈头痛或呼吸困难，请立即就医。',
      am: 'ከባድ የደረት ህመም፣ የዕይታ መታወክ፣ ከባድ ራስ ምታት ወይም የመተንፈስ ችግር ካለብዎት ወዲያውኑ ወደ ህክምና ይሂዱ።',
      vi: 'Đi cấp cứu ngay nếu bị đau ngực dữ dội, mờ mắt đột ngột, đau đầu dữ dội hoặc khó thở.'
    },
    whatIsIt: { 
      en: 'Heart works too hard pumping blood, putting extra pressure on your blood vessels.',
      es: 'El corazón trabaja demasiado para bombear sangre, aumentando la presión en las arterias.',
      zh: '心脏泵血过于费力，对血管壁造成额外压力。',
      am: 'ልብ ደምን ለመግፋት በጣም ስለሚጥር በደም ሥሮች ላይ ከመጠን በላይ ጫና ይፈጥራል።',
      vi: 'Tim phải hoạt động quá sức để bơm máu, gây áp lực lên thành mạch.'
    },
    lifestyle: { 
      en: ['<strong>Cut Back on Salt:</strong> Helps lower blood volume and pressure.', '<strong>Daily Walks:</strong> Keeps heart muscles strong and relaxed.'],
      es: ['<strong>Reduzca la sal:</strong> Ayuda a bajar la presión.', '<strong>Caminatas diarias:</strong> Mantiene el corazón fuerte.'],
      zh: ['<strong>减少盐分摄入：</strong> 有助降低血压。', '<strong>每天散步：</strong> 保持心肌强壮。'],
      am: ['<strong>ጨው መቀነስ፦</strong> የደም ግፊትን ለመቀነስ ይረዳል።', '<strong>የእለት ተእለት እርምጃ፦</strong> የልብ ጡንቻን ያጠናክራል።'],
      vi: ['<strong>Giảm ăn muối:</strong> Giúp hạ huyết áp.', '<strong>Đi bộ hàng ngày:</strong> Giúp cơ tim khỏe mạnh.']
    }
  },
  {
    id: 'cholesterol',
    keywords: ['high cholesterol', 'fat', 'cholesterol', 'colesterol', '高胆固醇', 'ኮሌስትሮል', 'cholesterol cao'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'High Cholesterol', es: 'Colesterol Alto', zh: '高胆固醇', am: 'ከፍተኛ ኮሌስትሮል', vi: 'Cholesterol Cao' },
    emergency: { 
      en: 'Seek urgent medical attention if you experience sudden chest tightness or left arm pain.',
      es: 'Busque ayuda médica si siente opresión repentina en el pecho o dolor en el brazo izquierdo.',
      zh: '如果突发胸闷或左臂疼痛，请立即就医。',
      am: 'ድንገተኛ የደረት ወጋ ወይም የግራ እጅ ህመም ካጋጠመዎት ወዲያውኑ ህክምና ያግኙ።',
      vi: 'Đi khám ngay nếu bị tức ngực đột ngột hoặc đau tay trái.'
    },
    whatIsIt: { 
      en: 'Fat buildup in the blood tubes that slows down healthy blood flow.',
      es: 'Acumulación de grasa en las arterias que frena la circulación sanguínea.',
      zh: '血管内脂肪堆积，导致血液流动变慢。',
      am: 'በደም ሥሮች ውስጥ ስብ ስለሚከማች የደም ዝውውርን ያደናቅፋል።',
      vi: 'Mỡ tích tụ trong lòng mạch làm chậm dòng máu.'
    },
    lifestyle: { 
      en: ['<strong>Eat More Fiber:</strong> Oats and beans help clear out fat.', '<strong>Limit Fried Foods:</strong> Protects your blood vessels.'],
      es: ['<strong>Coma más fibra:</strong> La avena ayuda a eliminar grasa.', '<strong>Evite fritos:</strong> Protege sus arterias.'],
      zh: ['<strong>多吃高纤食物：</strong> 燕麦和豆类有助于清除脂肪。', '<strong>油炸食物少吃：</strong> 保护血管。'],
      am: ['<strong>ፋይበር ያላቸውን ምግቦች ይመገቡ፦</strong> አጃ እና ባቄላ ስብን ያስወግዳሉ።', '<strong>የተጠበሱ ምግቦችን ይቀንሱ፦</strong> የደም ሥርዎን ይጠብቁ።'],
      vi: ['<strong>Ăn nhiều chất xơ:</strong> Yến mạch và đậu giúp đào thải mỡ.', '<strong>Hạn chế đồ chiên rán:</strong> Bảo vệ mạch máu.']
    }
  },
  {
    id: 'anemia',
    keywords: ['anemia', 'iron', 'weakness', 'hierro', '贫血', 'አኔሚያ', 'thiếu máu'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'Anemia (Low Iron)', es: 'Anemia (Hierro Bajo)', zh: '贫血（缺铁）', am: 'የደም ማነስ (የብረት እጥረት)', vi: 'Thiếu Máu (Thiếu Sắt)' },
    emergency: { 
      en: 'Seek emergency care if you faint or experience severe shortness of breath.',
      es: 'Busque atención de emergencia si se desmaya o le falta el aire de forma grave.',
      zh: '如果晕厥或严重呼吸困难，请立即就医。',
      am: 'ራሱን ካሳተዎት ወይም የመተንፈስ እጥረት ካጋጠመዎት ወዲያውኑ ወደ ህክምና ይሂዱ።',
      vi: 'Đi cấp cứu ngay nếu ngất xỉu hoặc khó thở nặng.'
    },
    whatIsIt: { 
      en: 'Low iron in the blood making you feel constantly weak, tired, and cold.',
      es: 'Falta de hierro en la sangre que causa debilidad, cansancio y frío constante.',
      zh: '血液中缺铁，导致感到持续虚弱、疲劳和怕冷。',
      am: 'በደም ውስጥ የብረት እጥረት በመኖሩ ምክንያት ሁልጊዜ ድካም እና ብርድ እንዲሰማዎት ያደርጋል።',
      vi: 'Thiếu sắt trong máu khiến bạn luôn cảm thấy yếu ớt, mệt mỏi và lạnh.'
    },
    lifestyle: { 
      en: ['<strong>Eat Iron-Rich Foods:</strong> Spinach, beans, and red meat.', '<strong>Add Vitamin C:</strong> Helps your body absorb iron.'],
      es: ['<strong>Coma alimentos ricos en hierro:</strong> Espinacas y carnes.', '<strong>Vitamina C:</strong> Ayuda a absorber el hierro.'],
      zh: ['<strong>多吃补铁食物：</strong> 菠菜、豆类和红肉。', '<strong>补充维生素C：</strong> 帮助铁质吸收。'],
      am: ['<strong>በብረት የበለፀጉ ምግቦችን ይመገቡ፦</strong> ቆስጣ፣ ባቄላ እና ቀይ ሥጋ።', '<strong>ቪታሚን ሲ ይውሰዱ፦</strong> ብረት ወደ ሰውነት እንዲመጣ ይረዳል።'],
      vi: ['<strong>Ăn thực phẩm giàu sắt:</strong> Rau chân vịt, đậu, thịt đỏ.', '<strong>Bổ sung Vitamin C:</strong> Giúp hấp thụ sắt tốt hơn.']
    }
  },
  {
    id: 'heart_attack',
    keywords: ['heart attack', 'chest pain', 'ataque al corazón', '心脏病发作', 'የልብ ህመም', 'đau tim'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'Heart Attack', es: 'Ataque al Corazón', zh: '心脏病发作', am: 'የልብ ህመም (Heart Attack)', vi: 'Cơn Đau Tim' },
    emergency: { 
      en: 'CALL 911 IMMEDIATELY if you feel crushing chest pain, or pain radiating to your jaw or arm.',
      es: '¡LLAME AL 911 DE INMEDIATO si siente dolor opresivo en el pecho, mandíbula o brazo!',
      zh: '如果感到胸部压迫性剧痛、疼痛放射至手臂或下巴，请立即拨打急救电话！',
      am: 'ከባድ የደረት ህመም፣ ወደ እጅ ወይም መንገጭላ የሚሄድ ህመም ካለ ወዲያውኑ ወደ 911 ይደውሉ!',
      vi: 'GỌI CẤP CỨU NGAY nếu bị đau thắt ngực lan ra tay hoặc hàm!'
    },
    whatIsIt: { 
      en: 'A blocked tube stopping blood from reaching the heart.',
      es: 'Un bloqueo en una arteria que impide que la sangre llegue al corazón.',
      zh: '血管堵塞导致血液无法到达心脏。',
      am: 'የደም ሥር በመደፈኑ ምክንያት ደም ወደ ልብ እንዳይደርስ ሲከለከል የሚከሰት ነው።',
      vi: 'Mạch máu bị tắc khiến máu không thể đến nuôi tim.'
    },
    lifestyle: { 
      en: ['<strong>Call 911:</strong> Do not drive yourself to the hospital.', '<strong>Chew Aspirin:</strong> If advised by emergency dispatchers.'],
      es: ['<strong>Llame al 911:</strong> No maneje usted mismo.', '<strong>Aspirina:</strong> Solo si se lo indica el paramédico.'],
      zh: ['<strong>立即叫救护车：</strong> 切勿自行驾车前往医院。', '<strong>遵医嘱服用阿司匹林。</strong>'],
      am: ['<strong>ወደ ህክምና ይደውሉ፦</strong> እራስዎ መኪና አያሽከረክሩ።', '<strong>አስፕሪን ያመዝምዙ፦</strong> ከህክምና ባለሙያ ካዘዙዎት ብቻ።'],
      vi: ['<strong>Gọi cấp cứu:</strong> Không tự lái xe đến viện.', '<strong>Nhai Aspirin:</strong> Nếu được nhân viên y tế hướng dẫn.']
    }
  },
  {
    id: 'stroke',
    keywords: ['stroke', 'brain attack', 'derrame cerebral', '中风', 'ስትሮክ', 'đột quỵ'],
    category: { en: 'Heart & Blood', es: 'Corazón y Sangre', zh: '心脏与血液', am: 'ልብ እና ደም', vi: 'Tim & Máu' },
    title: { en: 'Stroke', es: 'Derrame Cerebral', zh: '中风', am: 'ስትሮክ (Stroke)', vi: 'Đột Quỵ' },
    emergency: { 
      en: 'CALL 911 IMMEDIATELY. Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911.',
      es: 'LLAME AL 911 DE INMEDIATO. Observe si hay cara caída, debilidad en un brazo o dificultad para hablar.',
      zh: '立即拨打急救电话。注意FAST原则：面部歪斜、手臂无力、言语不清、立即求救！',
      am: 'ወዲያውኑ ወደ ህክምና ይደውሉ፦ የፊት መዛባት፣ የእጅ መዝለል ወይም የመናገር ችግር ካዩ::',
      vi: 'GỌI CẤP CỨU NGAY nếu bị méo miệng, yếu tay hoặc khó nói.'
    },
    whatIsIt: { 
      en: 'A blocked or burst tube stopping blood in the brain.',
      es: 'Una arteria bloqueada o rota que interrumpe la sangre al cerebro.',
      zh: '大脑血管堵塞或破裂，导致脑部供血中断。',
      am: 'በአንጎል ውስጥ የደም ሥር መዘጋት ወይም መፈንዳት ሲከሰት የሚፈጠር ነው።',
      vi: 'Mạch máu não bị tắc hoặc vỡ làm gián đoạn máu nuôi não.'
    },
    lifestyle: { 
      en: ['<strong>Act Fast:</strong> Time is critical to saving brain function.'],
      es: ['<strong>Actúe rápido:</strong> Cada minuto cuenta.'],
      zh: ['<strong>快速行动：</strong> 争取抢救黄金时间。'],
      am: ['<strong>በፍጥነት ይንቀሳቀሱ፦</strong> ጊዜ የአንጎልን ህዋሳት ለማዳን ወሳኝ ነው::'],
      vi: ['<strong>Hành động nhanh:</strong> Thời gian là vàng để cứu não.']
    }
  },

  // --- Lungs & Breathing ---
  {
    id: 'asthma',
    keywords: ['asthma', 'breathing', 'asma', '哮喘', 'አስማ', 'hen suyễn'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ እና መተንፈስ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'Asthma', es: 'Asma', zh: '哮喘', am: 'አስማ (Asthma)', vi: 'Bệnh Hen Suyễn' },
    emergency: { 
      en: 'Go to the ER if your rescue inhaler isn\'t working or you can\'t speak in full sentences.',
      es: 'Vaya a urgencias si su inhalador no funciona o no puede hablar con oraciones completas.',
      zh: '如果急救吸入器无效或无法完整说话，请立即就医。',
      am: 'የአስማ ማስታገሻ መድሃኒቱ ካልሰራ ወይም ሙሉ አረፍተ ነገር መናገር ካልቻሉ ወዲያውኑ ወደ ህክምና ይሂዱ።',
      vi: 'Đi cấp cứu ngay nếu thuốc xịt không có tác dụng hoặc không thể nói tròn câu.'
    },
    whatIsIt: { 
      en: 'Swollen breathing tubes that squeeze shut.',
      es: 'Vías respiratorias inflamadas que se estrechan y dificultan la respiración.',
      zh: '呼吸道发炎肿胀并收缩变窄。',
      am: 'የመተንፈሻ ቱቦዎች ያበጡ እና ጠበብ የሚሉበት ሁኔታ ነው።',
      vi: 'Đường thở bị sưng viêm và co thắt lại.'
    },
    lifestyle: { 
      en: ['<strong>Avoid Triggers:</strong> Keep away from smoke and dust.', '<strong>Keep Inhaler Close:</strong> Always carry your rescue inhaler.'],
      es: ['<strong>Evite desencadenantes:</strong> Aléjese del humo y polvo.', '<strong>Lleve su inhalador:</strong> Téngalo siempre a mano.'],
      zh: ['<strong>远离诱因：</strong> 避开烟雾和灰尘。', '<strong>随身携带吸入器：</strong> 确保随时可用。'],
      am: ['<strong>ቀስቃሽ ነገሮችን ያስወግዱ፦</strong> ከጢስ እና ከአቧራ ይራቁ።', '<strong>መድሃኒትዎን ይያዙ፦</strong> ሁልጊዜ አስማ ማስታገሻዎን አጠገብዎ ያድርጉ።'],
      vi: ['<strong>Tránh chất kích thích:</strong> Tránh xa khói thuốc và bụi bẩn.', '<strong>Luôn mang theo thuốc xịt:</strong> Để sẵn sàng khi cần.']
    }
  },
  {
    id: 'flu',
    keywords: ['flu', 'influenza', 'gripe', '流感', 'ጉንፋን', 'cúm'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ እና መተንፈስ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'The Flu (Influenza)', es: 'Gripe (Influenza)', zh: '流行性感冒（流感）', am: 'የባድ ጉንፋን (Flu)', vi: 'Cúm Mùa' },
    emergency: { 
      en: 'Seek care for severe chest pain, trouble breathing, or high fever that won\'t break.',
      es: 'Busque atención si tiene dolor de pecho grave, dificultad para respirar o fiebre muy alta.',
      zh: '如果经常胸痛、呼吸困难或高烧不退，请及时就医。',
      am: 'ከባድ የደረት ህመም፣ የመተንፈስ እጥረት ወይም የማይወርድ ከፍተኛ ትኩሳት ካለ ወደ ህክምና ይሂዱ።',
      vi: 'Đi khám ngay nếu bị đau ngực severe, khó thở hoặc sốt cao không hạ.'
    },
    whatIsIt: { 
      en: 'A severe viral infection of the nose, throat, and lungs.',
      es: 'Una infección viral grave del sistema respiratorio.',
      zh: '由病毒引起的鼻、咽喉和肺部急性感染。',
      am: 'በቫይረስ ምክንያት የሚመጣ የአፍንጫ፣ የጉሮሮ እና የሳንባ ህመም ነው።',
      vi: 'Bệnh nhiễm trùng đường hô hấp do vi-rút gây ra.'
    },
    lifestyle: { 
      en: ['<strong>Rest Completely:</strong> Stay home and sleep to recover.', '<strong>Hydrate:</strong> Drink water and warm fluids.'],
      es: ['<strong>Descanse:</strong> Quédese en casa y duerma.', '<strong>Hidrátese:</strong> Tome agua y líquidos calientes.'],
      zh: ['<strong>充分休息：</strong> 居家休息以利恢复。', '<strong>补充水分：</strong> 多喝水和温汤。'],
      am: ['<strong>እረፍት ያድርጉ፦</strong>ቤት ውስጥ ሆነው ያረፉ።', '<strong>ፈሳሽ ይውሰዱ፦</strong> ውሃ እና ሞቅ ያሉ ነገሮችን ይጠጡ።'],
      vi: ['<strong>Nghỉ ngơi hoàn toàn:</strong> Ở nhà và ngủ đủ giấc.', '<strong>Uống đủ nước:</strong> Bổ sung nước và nước ấm.']
    }
  },
  {
    id: 'pneumonia',
    keywords: ['pneumonia', 'lung infection', 'neumonia', '肺炎', 'የሳንባ ምች', 'viêm phổi'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ እና መተንፈስ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'Pneumonia', es: 'Neumonía', zh: '肺炎', am: 'የሳንባ ምች (Pneumonia)', vi: 'Viêm Phổi' },
    emergency: { 
      en: 'Seek immediate care for bluish lips, severe shortness of breath, or sharp chest pain when breathing.',
      es: 'Busque atención inmediata si tiene labios azulados, falta de aire grave o dolor punzante al respirar.',
      zh: '如果出现嘴唇发紫、严重呼吸困难或呼吸时胸部剧痛，请立即就医。',
      am: 'ከንፈርዎ ሰማያዊ ቀለም ካመጣ፣ የመተንፈስ ችግር ከባድ ከሆነ ወይም ሲተነፍሱ የደረት ህመም ካለ ወዲያውኑ ይሂዱ።',
      vi: 'Đi cấp cứu ngay nếu môi tím tái, khó thở nặng hoặc đau nhói ngực khi thở.'
    },
    whatIsIt: { 
      en: 'An infection that fills your lungs with fluid or pus, making breathing difficult.',
      es: 'Infección que llena los pulmones de líquido o pus, dificultando la respiración.',
      zh: '肺部充满液体或脓液的感染，导致呼吸困难。',
      am: 'ሳንባዎ በፈሳሽ ወይም በኩስ የሚሞላበት እና ለመተንፈስ አስቸጋሪ የሚያደርግ ኢንፌክሽን ነው።',
      vi: 'Nhiễm trùng khiến phổi đầy dịch hoặc mủ, gây khó thở.'
    },
    lifestyle: { 
      en: ['<strong>Take Prescribed Antibiotics:</strong> Finish the full medication course.', '<strong>Rest and Recover:</strong> Avoid heavy physical activity.'],
      es: ['<strong>Tome antibióticos:</strong> Termine todo el tratamiento.', '<strong>Descanse:</strong> Evite esfuerzo físico.'],
      zh: ['<strong>按时服用抗生素：</strong> 务必完成整个疗程。', '<strong>多休息：</strong> 避免剧烈体力活动。'],
      am: ['<strong>አንቲባዮቲክስ ይውሰዱ፦</strong> መድሃኒቱን እስከመጨረሻው ጨርሱ።', '<strong>እረፍት ያድርጉ፦</strong> ጠንካራ ስራዎችን ያስወግዱ።'],
      vi: ['<strong>Uống kháng sinh đúng chỉ định:</strong> Hoàn thành đủ liệu trình.', '<strong>Nghỉ ngơi:</strong> Tránh vận động nặng.']
    }
  },
  {
    id: 'bronchitis',
    keywords: ['bronchitis', 'cough', 'bronquitis', '支气管炎', 'ብሮንካይተስ', 'viêm phế quản'],
    category: { en: 'Lungs & Breathing', es: 'Pulmones y Respiración', zh: '肺部与呼吸', am: 'ሳንባ እና መተንፈስ', vi: 'Phổi & Hô Hấp' },
    title: { en: 'Bronchitis', es: 'Bronquitis', zh: '支气管炎', am: 'የብሮንካይተስ ህመም', vi: 'Viêm Phế Quản' },
    emergency: { 
      en: 'Seek care if coughing lasts longer than 3 weeks or is accompanied by blood.',
      es: 'Busque atención si la tos dura más de 3 semanas o viene con sangre.',
      zh: '如果咳嗽持续超过3周或伴有血丝，请就医。',
      am: 'ሳልዎ ከሶስት ሳምንት በላይ ከቆየ ወይም ደም ካለው ወደ ህክምና ይሂዱ።',
      vi: 'Đi khám ngay nếu ho kéo dài trên 3 tuần hoặc có lẫn máu.'
    },
    whatIsIt: { 
      en: 'Inflammation of the main air passages leading to your lungs, causing heavy coughing.',
      es: 'Inflamación de los conductos de aire principales hacia los pulmones, provocando tos fuerte.',
      zh: '通往肺部的主要气道发炎，引起剧烈咳嗽。',
      am: 'ወደ ሳንባ የሚወስዱ ዋና ዋና የአየር ቱቦዎች እብጠት ሲሆን ከባድ ሳል ያስከትላል።',
      vi: 'Viêm các ống dẫn khí chính vào phổi, gây ho dữ dội.'
    },
    lifestyle: { 
      en: ['<strong>Use a Humidifier:</strong> Adds moisture to the air to soothe airways.', '<strong>Stay Hydrated:</strong> Loosens mucus in your chest.'],
      es: ['<strong>Use un humidificador:</strong> Suaviza las vías respiratorias.', '<strong>Manténgase hidratado:</strong> Afloja la mucosidad.'],
      zh: ['<strong>使用加湿器：</strong> 增加空气湿度以舒缓呼吸道。', '<strong>多喝水：</strong> 有助稀释胸部黏液。'],
      am: ['<strong>እርጥበት ማሽን ይጠቀሙ፦</strong> አየሩን ለማለስለስ ይረዳል።', '<strong>ፈሳሽ ይጠጡ፦</strong> በደረት ውስጥ ያለውን ንፋጭ ያቀልላል።'],
      vi: ['<strong>Dùng máy tạo độ ẩm:</strong> Làm dịu đường thở.', '<strong>Uống nhiều nước:</strong> Giúp làm loãng đờm ở ngực.']
    }
  },

  // --- Brain & Mental Health ---
  {
    id: 'migraine',
    keywords: ['migraine', 'headache', 'migraña', '偏头痛', 'ራስ ምታት', 'đau nửa đầu'],
    category: { en: 'Brain & Mental', es: 'Cerebro y Salud', zh: '大脑与心理', am: 'አንጎል እና አእምሮ', vi: 'Bộ Não & Tâm Thần' },
    title: { en: 'Migraine', es: 'Migraña', zh: '偏头痛', am: 'ሚግራይን (Migraine)', vi: 'Đau Nửa Đầu (Migraine)' },
    emergency: { 
      en: 'Seek immediate care if it is the worst headache of your life or comes on like a sudden thunderclap.',
      es: 'Busque atención inmediata si es el peor dolor de cabeza de su vida o aparece de golpe.',
      zh: '如果是人生中最剧烈的头痛或突然发作的霹雳样头痛，请立即就医。',
      am: 'በህይወትዎ አጋጥሞዎት የማያውቅ ከባድ ራስ ምታት ከሆነ ወዲያውኑ ወደ ህክምና ይሂዱ።',
      vi: 'Đi cấp cứu ngay nếu đây là cơn đau đầu dữ dội nhất từng gặp.'
    },
    whatIsIt: { 
      en: 'Severe, pulsing headaches often causing nausea and sensitivity to light.',
      es: 'Dolores de cabeza intensos con pulsaciones, náuseas y sensibilidad a la luz.',
      zh: '剧烈的搏动性头痛，常伴有恶心及对光线敏感。',
      am: 'ከባድ፣ የሚወጋ ራስ ምታት ሲሆን ማስታወክ እና የብርሃን ጥላቻን ያስከተላል።',
      vi: 'Cơn đau đầu dữ dội dồn dập, thường gây nôn và sợ ánh sáng.'
    },
    lifestyle: { 
      en: ['<strong>Rest in a Dark Room:</strong> Turn off all lights and screens.', '<strong>Apply Cold Compress:</strong> Put an ice pack on your forehead.'],
      es: ['<strong>Descansar a oscuras:</strong> Apague luces y pantallas.', '<strong>Compresa fría:</strong> Ponga hielo en la frente.'],
      zh: ['<strong>在黑暗处休息：</strong> 关闭灯光和电子屏幕。', '<strong>冷敷：</strong> 额头敷冰袋。'],
      am: ['<strong>ጨለማ ክፍል ውስጥ ያረፉ፦</strong> መብራት እና ስክሪኖችን ያጥፉ።', '<strong>ቀዝቃዛ ጨርቅ ማድረግ፦</strong> በግንባርዎ ላይ ቀዝቃዛ ነገር ያድርጉ።'],
      vi: ['<strong>Nghỉ trong phòng tối:</strong> Tắt hết đèn và thiết bị điện tử.', '<strong>Chườm lạnh:</strong> Đặt túi băng lên trán.']
    }
  },
  {
    id: 'depression',
    keywords: ['depression', 'sadness', 'depresion', '抑郁症', 'ድብርት', 'trầm cảm'],
    category: { en: 'Brain & Mental', es: 'Cerebro y Salud', zh: '大脑与心理', am: 'አንጎል እና አእምሮ', vi: 'Bộ Não & Tâm Thần' },
    title: { en: 'Clinical Depression', es: 'Depresión Clínica', zh: '临床抑郁症', am: 'የድብርት ስሜት (Depression)', vi: 'Trầm Cảm Lâm Sàng' },
    emergency: { 
      en: 'CALL OR TEXT 988 IMMEDIATELY if you are having thoughts of self-harm or suicide.',
      es: 'LLAME O ENVÍE UN MENSAJE AL 988 SI TIENE PENSAMIENTOS DE AUTOLESIÓN.',
      zh: '如果有自残或自杀的想法，请立即拨打或发送短信至988求助热线。',
      am: 'ራስን የማጥፋት ወይም የመጎዳት ሀሳብ ካለዎት ወዲያውኑ ወደ 988 ይደውሉ ወይም ይፃፉ።',
      vi: 'GỌI HOẶC NHẮN TIN 988 NGAY LẬP TỨC nếu có suy nghĩ tự hại.'
    },
    whatIsIt: { 
      en: 'A medical condition causing persistent sadness, low energy, and loss of interest in life.',
      es: 'Condición médica que causa tristeza persistente y pérdida de interés en la vida.',
      zh: '导致持续悲伤、精力低落和对生活失去兴趣的医疗状况。',
      am: 'ቀጣይነት ያለው ሀዘን፣ የሃይል ማነስ እና በህይወት ላይ ፍላጎት ማጣትን የሚያስከትል የጤና ሁኔታ ነው።',
      vi: 'Tình trạng y tế gây buồn bã kéo dài, thiếu năng lượng và mất hứng thú sống.'
    },
    lifestyle: { 
      en: ['<strong>Talk to Someone:</strong> Reach out to a trusted friend, family, or counselor.', '<strong>Gentle Movement:</strong> Short daily walks can boost mood chemicals.'],
      es: ['<strong>Hable con alguien:</strong> Busque apoyo familiar o profesional.', '<strong>Movimiento suave:</strong> Caminatas cortas ayudan.'],
      zh: ['<strong>倾诉心声：</strong> 与信任的朋友、家人或心理咨询师交流。', '<strong>温和运动：</strong> 每天短途散步有助于改善情绪。'],
      am: ['<strong>ያነጋግሩ፦</strong> ከታመነ ጓደኛ፣ ቤተሰብ ወይም ባለሙያ ጋር ያውሩ።', '<strong>ቀላል እንቅስቃሴ፦</strong> አጭር የእለት ተእለት እርምጃ ስሜትዎን ሊያሻሽል ይችላል።'],
      vi: ['<strong>Trò chuyện với người thân:</strong> Chia sẻ với bạn bè hoặc chuyên gia.', '<strong>Vận động nhẹ nhàng:</strong> Đi bộ ngắn giúp cải thiện tâm trạng.']
    }
  },
  {
    id: 'anxiety',
    keywords: ['anxiety', 'panic', 'ansiedad', '焦虑症', 'ጭንቀት', 'lo âu'],
    category: { en: 'Brain & Mental', es: 'Cerebro y Salud', zh: '大脑与心理', am: 'አንጎል እና አእምሮ', vi: 'Bộ Não & Tâm Thần' },
    title: { en: 'Anxiety Disorder', es: 'Trastorno de Ansiedad', zh: '焦虑症', am: 'ከፍተኛ ጭንቀት (Anxiety)', vi: 'Rối Loạn Lo Ắu' },
    emergency: { 
      en: 'Seek medical care if panic attacks cause chest pain that mimics a heart attack or severe dizziness.',
      es: 'Busque atención si los ataques de pánico causan dolor de pecho o mareo severo.',
      zh: '如果恐慌发作引起类似心脏病的胸痛或严重眩晕，请就医。',
      am: 'የድንጋጤ ስሜት የደረት ህመም ወይም ከፍተኛ ራስ መዞር ካመጣ ህክምና ያግኙ።',
      vi: 'Đi khám nếu cơn hoảng loạn gây đau ngực giống đau tim hoặc chóng mặt nặng.'
    },
    whatIsIt: { 
      en: 'Excessive, uncontrollable worry and fear that interferes with daily activities.',
      es: 'Preocupación y miedo excesivo e incontrolable que interfiere con la vida diaria.',
      zh: '过度且无法控制的担忧与恐惧，影响日常活动。',
      am: 'ከመጠን በላይ የሆነ እና መቆጣጠር የማይቻል ስጋት ሲሆን የዕለት ተዕለት እንቅስቃሴዎችን ይረብሻል።',
      vi: 'Lo lắng và sợ hãi thái quá, không kiểm soát được, ảnh hưởng đến sinh hoạt.'
    },
    lifestyle: { 
      en: ['<strong>Deep Breathing:</strong> Inhale for 4 seconds, hold for 4, exhale for 4.', '<strong>Limit Caffeine:</strong> Reduce coffee and energy drinks.'],
      es: ['<strong>Respiración profunda:</strong> Inhale 4 segundos, mantenga 4, exhale 4.', '<strong>Limite la cafeína:</strong> Reduzca café y bebidas energéticas.'],
      zh: ['<strong>深呼吸练习：</strong> 吸气4秒，屏息4秒，呼气4秒。', '<strong>减少咖啡因：</strong> 少喝咖啡和功能饮料。'],
      am: ['<strong>ጥልቅ ትንፋሽ መውሰድ፦</strong> ለ4 ሰከንድ ሳብ፣ ለ4 ያዝ፣ ለ4 አስወጣ።', '<strong>ካፌይን መቀነስ፦</strong> ቡና እና ሃይል ሰጪ መጠጦችን ይቀንሱ።'],
      vi: ['<strong>Hít thở sâu:</strong> Hít vào 4 giây, giữ 4 giây, thở ra 4 giây.', '<strong>Hạn chế caffeine:</strong> Giảm cà phê và nước tăng lực.']
    }
  },
  {
    id: 'concussion',
    keywords: ['concussion', 'head injury', 'conmocion cerebral', '脑震荡', 'የራስ ጉዳት', 'chấn động não'],
    category: { en: 'Brain & Mental', es: 'Cerebro y Salud', zh: '大脑与心理', am: 'አንጎል እና አእምሮ', vi: 'Bộ Não & Tâm Thần' },
    title: { en: 'Concussion', es: 'Conmoción Cerebral', zh: '脑震荡', am: 'የጭንቅላት ጉዳት (Concussion)', vi: 'Chấn Động Não' },
    emergency: { 
      en: 'GO TO THE ER IMMEDIATELY for repeated vomiting, unequal pupils, worsening confusion, or seizures.',
      es: 'VAYA A URGENCIAS SI hay vómitos repetidos, pupilas desiguales, confusión o convulsiones.',
      zh: '如果出现反复呕吐、两侧瞳孔大小不一、意识混乱加重或抽搐，请立即去急诊。',
      am: 'ተደጋጋሚ ማስታወክ፣ የአይን ብርሃን አለመመጣጠን ወይም የሚጥል በሽታ ካለ ወዲያውኑ ድንገተኛ ክፍል ይሂዱ።',
      vi: 'ĐẾN PHÒNG CẤP CỨU NGAY nếu nôn mửa liên tục, đồng tử không đều hoặc co giật.'
    },
    whatIsIt: { 
      en: 'A mild brain injury caused by a blow to the head, altering mental state temporarily.',
      es: 'Lesión cerebral leve por un golpe en la cabeza que altera el estado mental.',
      zh: '头部受击引起的轻微脑损伤，会暂时改变精神状态。',
      am: 'በጭንቅላት ላይ በሚደርስ ድብደባ ምክንያት የሚመጣ ቀላል የአንጎል ጉዳት ነው።',
      vi: 'Chấn thương sọ não nhẹ do va đập đầu, làm thay đổi tạm thời trạng thái tâm thần.'
    },
    lifestyle: { 
      en: ['<strong>Complete Brain Rest:</strong> Avoid screens, reading, and bright lights.', '<strong>No Sports:</strong> Do not return to physical activities until cleared by a doctor.'],
      es: ['<strong>Reposo cerebral:</strong> Evite pantallas y luces brillantes.', '<strong>Sin deportes:</strong> No vuelva a jugar sin autorización médica.'],
      zh: ['<strong>完全大脑休息：</strong> 避免使用屏幕、阅读和强光。', '<strong>禁止运动：</strong> 经医生批准前切勿恢复体育活动。'],
      am: ['<strong>ሙሉ የአዕምሮ እረፍት፦</strong> ስክሪን፣ ንባብ እና ብሩህ መብራቶችን ያስወግዱ።', '<strong>ስፖርት ማቆም፦</strong> በሐኪም ካልተፈቀደ በቀር ወደ ስፖርት አይመለሱ።'],
      vi: ['<strong>Nghỉ ngơi hoàn toàn:</strong> Tránh màn hình, đọc sách và ánh sáng chói.', '<strong>Không chơi thể thao:</strong> Chỉ quay lại khi có sự cho phép của bác sĩ.']
    }
  },

  // --- Urinary, Kidney, & Blood Sugar ---
  {
    id: 'diabetes',
    keywords: ['diabetes', 'sugar', 'diabetes', '糖尿病', 'ስኳር በሽታ', 'tiểu đường'],
    category: { en: 'Kidney & Sugar', es: 'Azúcar y Riñones', zh: '肾脏与血糖', am: 'ኩላሊት እና ስኳር', vi: 'Thận & Đường Huyết' },
    title: { en: 'Diabetes (Type 2)', es: 'Diabetes Tipo 2', zh: '2型糖尿病', am: 'የስኳር በሽታ (Type 2)', vi: 'Tiểu Đường Tuýp 2' },
    emergency: { 
      en: 'Seek immediate care for extreme confusion, fruity-smelling breath, or fainting.',
      es: 'Busque ayuda inmediata si hay confusión extrema, aliento con olor a frutas o desmayo.',
      zh: '出现极度混乱、呼出气体有水果味或晕厥时，请立即就医。',
      am: 'ከፍተኛ ግራ መጋባት፣ የፍራፍሬ ሽታ ያለው እስትንፋስ ወይም ራስን መሳት ካለ ወዲያውኑ ወደ ህክምና ይሂዱ።',
      vi: 'Đi cấp cứu ngay nếu bị mơ hồ severe, hơi thở có mùi trái cây hoặc ngất xỉu.'
    },
    whatIsIt: { 
      en: 'The body cannot process sugar properly, leading to elevated blood sugar levels.',
      es: 'El cuerpo no procesa el azúcar correctamente, elevando sus niveles en sangre.',
      zh: '身体无法正常利用糖分，导致血糖水平过高。',
      am: 'ሰውነት ስኳርን በአግባቡ መጠቀም ስለማይችል በደም ውስጥ ያለው የስኳር መጠን ይጨምራል።',
      vi: 'Cơ thể không chuyển hóa đường hiệu quả, làm tăng đường huyết.'
    },
    lifestyle: { 
      en: ['<strong>Cut Sugary Drinks:</strong> Switch from soda to plain water.', '<strong>Walk After Meals:</strong> Helps muscles use up blood sugar.'],
      es: ['<strong>Corte bebidas azucaradas:</strong> Tome agua en vez de refrescos.', '<strong>Camine tras comer:</strong> Ayuda a procesar el azúcar.'],
      zh: ['<strong>戒除含糖饮料：</strong> 用白开水替代汽水和饮料。', '<strong>饭后散步：</strong> 帮助肌肉消耗血糖。'],
      am: ['<strong>የስኳር መጠጦችን መቀነስ፦</strong> ለስላሳዎችን በውሃ ይተኩ።', '<strong>ከምግብ በኋላ መንገድ መራመድ፦</strong> የስኳር መጠንን ለመቀነስ ይረዳል።'],
      vi: ['<strong>Bỏ đồ uống có đường:</strong> Thay nước ngọt bằng nước lọc.', '<strong>Đi bộ sau bữa ăn:</strong> Giúp cơ thể tiêu thụ đường.']
    }
  },
  {
    id: 'uti',
    keywords: ['uti', 'urinary tract infection', 'infection urinaria', '尿路感染', 'የሽንት ቱቦ ኢንፌክሽን', 'viêm đường tiết niệu'],
    category: { en: 'Kidney & Sugar', es: 'Azúcar y Riñones', zh: '肾脏与血糖', am: 'ኩላሊት እና ስኳር', vi: 'Thận & Đường Huyết' },
    title: { en: 'Urinary Tract Infection (UTI)', es: 'Infección Urinaria', zh: '泌尿道感染', am: 'የሽንት ቱቦ ኢንፌክሽን (UTI)', vi: 'Nhiễm Trùng Đường Tiết Niệu' },
    emergency: { 
      en: 'Seek care if you experience back pain, high fever, or blood in your urine.',
      es: 'Busque atención si tiene dolor de espalda, fiebre alta o sangre en la orina.',
      zh: '如果出现背痛、高烧或血尿，请立即就医。',
      am: 'የጀርባ ህመም፣ ከፍተኛ ትኩሳት ወይም በሽንት ውስጥ ደም ካለ ህክምና ያግኙ።',
      vi: 'Đi khám ngay nếu bị đau lưng, sốt cao hoặc tiểu ra máu.'
    },
    whatIsIt: { 
      en: 'A bacterial infection in your bladder or urine pipes causing a burning sensation when peeing.',
      es: 'Infección bacteriana en la vejiga que causa ardor al orinar.',
      zh: '膀胱或尿道发生细菌感染，导致排尿时有灼痛感。',
      am: 'በሽንት ፎኛ ወይም ቱቦ ውስጥ የሚከሰት የባክቴሪያ ኢንፌክሽን ሲሆን ሽንት ሲሸኑ ማቃጠል ያስከትላል።',
      vi: 'Nhiễm trùng vi khuẩn ở bàng quang hoặc đường tiểu gây cảm giác nóng rát khi đi tiểu.'
    },
    lifestyle: { 
      en: ['<strong>Drink Plenty of Water:</strong> Flushes bacteria out of your system.', '<strong>Cranberry Juice:</strong> May help prevent bacteria from sticking.'],
      es: ['<strong>Tome mucha agua:</strong> Ayuda a expulsar las bacterias.', '<strong>Jugo de arándano:</strong> Puede prevenir infecciones.'],
      zh: ['<strong>多喝水：</strong> 有助于冲洗体内的细菌。', '<strong>蔓越莓汁：</strong> 可能有助于防止细菌附着。'],
      am: ['<strong>ብዙ ውሃ መጠጥ፦</strong> ባክቴሪያዎችን ከሰውነትዎ ያስወግዳል።', '<strong>ክራንቤሪ ጭማቂ፦</strong> ባክቴሪያዎች እንዳይጣበቁ ይረዳል።'],
      vi: ['<strong>Uống nhiều nước:</strong> Giúp đào thải vi khuẩn ra ngoài.', '<strong>Nước ép nam việt quất:</strong> Có thể giúp ngăn vi khuẩn bám dính.']
    }
  },
  {
    id: 'kidney_stones',
    keywords: ['kidney stones', 'stones', 'calculos renales', '肾结石', 'የኩላሊት ጠጠር', 'sỏi thận'],
    category: { en: 'Kidney & Sugar', es: 'Azúcar y Riñones', zh: '肾脏与血糖', am: 'ኩላሊት እና ስኳር', vi: 'Thận & Đường Huyết' },
    title: { en: 'Kidney Stones', es: 'Cálculos Renales', zh: '肾结石', am: 'የኩላሊት ጠጠር', vi: 'Sỏi Thận' },
    emergency: { 
      en: 'Go to the ER for excruciating side/back pain, inability to urinate, or vomiting with fever.',
      es: 'Vaya a urgencias por dolor intenso en la espalda, incapacidad para orinar o vómitos con fiebre.',
      zh: '如果出现剧烈的侧腹/背部疼痛、无法排尿或伴随发烧的呕吐，请去急诊。',
      am: 'ከባድ የጎን ወይም የጀርባ ህመም፣ ሽንት መሸናታት አለመቻል ወይም ከትኩሳት ጋር ማስታወክ ካለ ወደ ድንገተኛ ይሂዱ።',
      vi: 'Đi cấp cứu ngay nếu đau dữ dội vùng lưng/hông, không thể đi tiểu hoặc sốt kèm nôn.'
    },
    whatIsIt: { 
      en: 'Hard mineral deposits that form inside your kidneys and cause sharp pain when passing.',
      es: 'Depósitos minerales duros que se forman en los riñones y causan dolor agudo al pasar.',
      zh: '在肾脏内形成的坚硬矿物质沉积物，排出时会引起剧痛。',
      am: 'በኩላሊት ውስጥ የሚፈጠሩ ጠንካራ ማዕድናት ሲሆኑ በሚወጡበት ጊዜ ከባድ ህመም ያስከትላሉ።',
      vi: 'Các cặn khoáng cứng hình thành trong thận, gây đau nhói khi di chuyển ra ngoài.'
    },
    lifestyle: { 
      en: ['<strong>Hydrate Constantly:</strong> Drink plenty of water throughout the day.', '<strong>Reduce Sodium:</strong> Lower salt intake to prevent mineral buildup.'],
      es: ['<strong>Hidrátese constantemente:</strong> Tome mucha agua todo el día.', '<strong>Reduzca el sodio:</strong> Menos sal para evitar minerales.'],
      zh: ['<strong>持续补充水分：</strong> 全天多喝水。', '<strong>减少钠摄入：</strong> 降低盐分摄入以防矿物质聚积。'],
      am: ['<strong>ቋሚ ፈሳሽ ውሰዱ፦</strong> በቀን ውስጥ ብዙ ውሃ ይጠጡ።', '<strong>ጨው መቀነስ፦</strong> ማዕድናት እንዳይከማቹ ጨው ይቀንሱ።'],
      vi: ['<strong>Uống nước liên tục:</strong> Cung cấp đủ nước trong ngày.', '<strong>Giảm muối:</strong> Hạn chế natri để ngăn tích tụ khoáng chất.']
    }
  },

  // --- Stomach & Digestion ---
  {
    id: 'appendicitis',
    keywords: ['appendicitis', 'appendix', 'apendicitis', '阑尾炎', 'ትርፍ አንጀት', 'viêm ruột thừa'],
    category: { en: 'Stomach & Digestion', es: 'Estómago y Digestión', zh: '胃部与消化', am: 'ሆድ እና መፈጨት', vi: 'Dạ Dày & Tiêu Hóa' },
    title: { en: 'Appendicitis', es: 'Apendicitis', zh: '急性阑尾炎', am: 'የትርፍ አንጀት ህመም', vi: 'Viêm Ruột Thừa' },
    emergency: { 
      en: 'GO TO THE ER IMMEDIATELY. Appendicitis requires urgent emergency evaluation and surgery.',
      es: 'VAYA A URGENCIAS DE INMEDIATO. Requiere evaluación médica y cirugía urgente.',
      zh: '请立即前往急诊室！阑尾炎需要紧急医疗评估和手术治疗。',
      am: 'ወዲያውኑ ወደ ድንገተኛ ህክምና ክፍል ይሂዱ! የቀዶ ጥገና ህክምና ያስፈልገዋል::',
      vi: 'ĐẾN PHÒNG CẤP CỨU NGAY LẬP TỨC. Cần phẫu thuật khẩn cấp.'
    },
    whatIsIt: { 
      en: 'Infection of the appendix causing severe, worsening bottom-right belly pain.',
      es: 'Infección del apéndice que causa dolor intenso en el lado inferior derecho del abdomen.',
      zh: '阑尾发炎引起右下腹剧烈并持续加重的疼痛。',
      am: 'በትርፍ አንጀት ላይ የሚከሰት ኢንፌክሽን ሲሆን በታችኛው ቀኝ የሆድ ክፍል ላይ ከባድ ህመም ያስከትላል።',
      vi: 'Viêm ruột thừa gây đau dữ dội ở vùng bụng dưới bên phải.'
    },
    lifestyle: { 
      en: ['<strong>Do Not Eat or Drink:</strong> Keep stomach empty for potential emergency surgery.', '<strong>Do Not Apply Heat:</strong> Heat can cause the appendix to burst.'],
      es: ['<strong>No coma ni beba nada:</strong> Mantenga el estómago vacío por si requiere cirugía.', '<strong>No aplique calor:</strong> Puede romper el apéndice.'],
      zh: ['<strong>禁食禁水：</strong> 保持空腹以便随时进行紧急手术。', '<strong>切勿热敷：</strong> 热敷可能导致阑尾穿孔破裂。'],
      am: ['<strong>ምግብ ወይም ውሃ አይውሰዱ፦</strong> ለድንገተኛ ቀዶ ጥገና ሆድዎን ባዶ ያድርጉ።', '<strong>ሞቅ ያለ ነገር አያድርጉ፦</strong> ትርፍ አንጀቱ እንዲፈነዳ ሊያደርግ ይችላል::'],
      vi: ['<strong>Không ăn uống gì:</strong> Nhịn ăn để chuẩn bị cho phẫu thuật.', '<strong>Không chườm nóng:</strong> Có thể làm vỡ ruột thừa.']
    }
  },
  {
    id: 'gastritis',
    keywords: ['gastritis', 'stomach pain', 'gastritis', '胃炎', 'የሆድ ቁርጠት', 'viêm dạ dày'],
    category: { en: 'Stomach & Digestion', es: 'Estómago y Digestión', zh: '胃部与消化', am: 'ሆድ እና መፈጨት', vi: 'Dạ Dày & Tiêu Hóa' },
    title: { en: 'Gastritis', es: 'Gastritis', zh: '胃炎', am: 'የሆድ እብጠት (Gastritis)', vi: 'Viêm Dạ Dày' },
    emergency: { 
      en: 'Seek care if you vomit blood or pass black, tarry stools.',
      es: 'Busque atención si vomita sangre o tiene heces negras y oscuras.',
      zh: '如果呕吐出带血物质或排出黑色柏油样大便，请立即就医。',
      am: 'ደም ካስታወኩ ወይም ጥቁር ሰገራ ካለ ወደ ህክምና ይሂዱ።',
      vi: 'Đi khám ngay nếu nôn ra máu hoặc đi cầu phân đen.'
    },
    whatIsIt: { 
      en: 'Inflammation of the protective lining of your stomach causing burning ache or nausea.',
      es: 'Inflamación del revestimiento del estómago que causa dolor o náuseas.',
      zh: '胃黏膜发炎，引起灼痛或恶心。',
      am: 'የሆድ ግድግዳ ማስታገሻ ሽፋን እብጠት ሲሆን የማቃጠል ስሜት ወይም ማስታወክ ያስከትላል።',
      vi: 'Viêm lớp niêm mạc bảo vệ dạ dày gây đau rát hoặc buồn nôn.'
    },
    lifestyle: { 
      en: ['<strong>Avoid Spicy Foods:</strong> Stay away from acidic and spicy meals.', '<strong>Eat Smaller Meals:</strong> Don\'t overload your stomach.'],
      es: ['<strong>Evite comidas picantes:</strong> Aléjese de ácidos y picantes.', '<strong>Coma porciones pequeñas:</strong> No sobrecargue el estomago.'],
      zh: ['<strong>避免辛辣食物：</strong> 少吃酸性或辛辣食物。', '<strong>少食多餐：</strong> 减轻胃部负担。'],
      am: ['<strong>ቅመም የበዛባቸው ምግቦችን ያስወግዱ፦</strong> አሲዳማ እና ቅመም ምግቦችን አይብሉ።', '<strong>ትንሽ በትንሽ ይመገቡ፦</strong> ሆድዎን አያጨናንቁ።'],
      vi: ['<strong>Tránh đồ cay nóng:</strong> Tránh xa thức ăn chua và cay.', '<strong>Chia nhỏ bữa ăn:</strong> Không làm quá tải dạ dày.']
    }
  },
  {
    id: 'gerd',
    keywords: ['gerd', 'acid reflux', 'heartburn', 'reflujo', '胃酸倒流', 'gastroesophageal reflux'],
    category: { en: 'Stomach & Digestion', es: 'Estómago y Digestión', zh: '胃部与消化', am: 'ሆድ እና መፈጨት', vi: 'Dạ Dày & Tiêu Hóa' },
    title: { en: 'Acid Reflux (GERD)', es: 'Reflujo Ácido (GERD)', zh: '胃食管反流（GERD）', am: 'የחረ ካንሰር (GERD)', vi: 'Trào Ngược Dạ Dày' },
    emergency: { 
      en: 'Seek immediate care if heartburn is accompanied by severe chest pressure spreading to your arm or jaw.',
      es: 'Busque atención si el ardor viene acompañado de presión en el pecho o dolor en el brazo.',
      zh: '如果烧心伴随扩散至手臂或下巴的剧烈胸部压迫感，请立即就医。',
      am: 'የልብ ማቃጠል ከባድ የደረት ጫና ካለው ወዲያውኑ ወደ ህክምና ይሂዱ።',
      vi: 'Đi khám ngay nếu ợ nóng kèm theo tức ngực lan ra tay hoặc hàm.'
    },
    whatIsIt: { 
      en: 'Stomach acid flows back up into your feeding tube, causing a burning chest sensation.',
      es: 'El ácido estomacal sube al esófago, causando ardor en el pecho.',
      zh: '胃酸倒流至食管，引起胸口灼热感（烧心）。',
      am: 'የሆድ አሲድ ወደ መዋኛ ቱቦ ተመልሶ በመፍሰስ የደረት ማቃጠል ስሜት ይፈጥራል።',
      vi: 'Axit dạ dày trào ngược lên thực quản, gây cảm giác nóng rát ngực.'
    },
    lifestyle: { 
      en: ['<strong>Don\'t Lie Down After Eating:</strong> Wait at least 2 to 3 hours before bed.', '<strong>Avoid Trigger Foods:</strong> Limit chocolate, caffeine, and fatty foods.'],
      es: ['<strong>No se acueste tras comer:</strong> Espere 2 a 3 horas antes de dormir.', '<strong>Evite ciertos alimentos:</strong> Chocolate y grasas.'],
      zh: ['<strong>饭后请勿立即躺下：</strong> 睡前至少等待2至3小时。', '<strong>避免刺激食物：</strong> 减少巧克力、咖啡因和油腻食物。'],
      am: ['<strong>ከበሉ በኋላ ወዲያውኑ አትተኛ፦</strong> ከመተኛትዎ በፊት ከ 2 እስከ 3 ሰዓታት ይጠብቁ።', '<strong>የተወሰኑ ምግቦችን ያስወግዱ፦</strong> ቸኮሌት እና ስብ የበዛባቸውን ይቀንሱ።'],
      vi: ['<strong>Không nằm ngay sau khi ăn:</strong> Đợi ít nhất 2-3 tiếng trước khi ngủ.', '<strong>Tránh thực phẩm kích thích:</strong> Hạn chế chocolate, đồ béo.']
    }
  },
  {
    id: 'food_poisoning',
    keywords: ['food poisoning', 'stomach flu', 'intoxicacion alimentaria', '食物中毒', 'የምግብ መርዝ', 'ngộ độc thực phẩm'],
    category: { en: 'Stomach & Digestion', es: 'Estómago y Digestión', zh: '胃部与消化', am: 'ሆድ እና መፈጨት', vi: 'Dạ Dày & Tiêu Hóa' },
    title: { en: 'Food Poisoning', es: 'Intoxicación Alimentaria', zh: '食物中毒', am: 'የምግብ መመረዝ (Food Poisoning)', vi: 'Ngộ Độc Thực Phẩm' },
    emergency: { 
      en: 'Seek emergency care for bloody diarrhea, high fever, or signs of severe dehydration.',
      es: 'Busque atención de emergencia si hay diarrea con sangre, fiebre alta o deshidratación.',
      zh: '如果出现血便、高烧或严重脱水迹象，请去急诊。',
      am: 'ደማማ ተቅማጥ፣ ከፍተኛ ትኩሳት ወይም የውሃ እጥረት ምልክቶች ከታዩ ድንገተኛ ህክምና ያግኙ።',
      vi: 'Đi cấp cứu nếu tiêu chảy ra máu, sốt cao hoặc mất nước nặng.'
    },
    whatIsIt: { 
      en: 'Illness caused by eating contaminated food, resulting in vomiting, cramps, and diarrhea.',
      es: 'Enfermedad por comer alimentos contaminados, provocando vómitos y calambres.',
      zh: '食用被污染的食物引起的疾病，导致呕吐、腹痛和腹泻。',
      am: 'በተበከለ ምግብ ምክንያት የሚመጣ ህመም ሲሆን ማስታወክ፣ ሆድ ቁርጠት እና ተቅማጥ ያስከትላል።',
      vi: 'Bệnh do ăn thực phẩm nhiễm bẩn, gây nôn mửa, đau bụng và tiêu chảy.'
    },
    lifestyle: { 
      en: ['<strong>Sip Clear Liquids:</strong> Drink water or electrolyte solutions slowly.', '<strong>Eat Bland Foods:</strong> Try crackers or toast when ready.'],
      es: ['<strong>Tome líquidos claros:</strong> Agua o sueros en pequeños sorbos.', '<strong>Coma alimentos suaves:</strong> Pan tostado o galletas.'],
      zh: ['<strong>小口饮用清流质：</strong> 慢饮水或电解质溶液。', '<strong>吃清淡食物：</strong> 身体好转时吃苏打饼干或吐司。'],
      am: ['<strong>ፈሳሽ በጥቂቱ መጠጥ፦</strong> ውሃ ወይም ኤሌክትሮላይት በጥንቃቄ ውሰድ።', '<strong>ለስላሳ ምግቦች መመገብ፦</strong> ደረቅ ዳቦ መብላት ይቻላል።'],
      vi: ['<strong>Nhấp từng ngụm nước:</strong> Uống nước lọc hoặc nước điện giải.', '<strong>Ăn món nhạt:</strong> Thử bánh mì nướng khi cơ thể ổn hơn.']
    }
  },

  // --- Joints, Bones, & Skin ---
  {
    id: 'arthritis',
    keywords: ['arthritis', 'joint pain', 'artritis', '关节炎', 'የአጥንት ህመም', 'viêm khớp'],
    category: { en: 'Joints & Bones', es: 'Articulaciones y Huesos', zh: '关节与骨骼', am: 'መገጣጠሚያ እና አጥንት', vi: 'Khớp & Xương' },
    title: { en: 'Arthritis (Joint Pain)', es: 'Artritis', zh: '关节炎', am: 'የመገጣጠሚያ ህመም (Arthritis)', vi: 'Viêm Khớp' },
    emergency: { 
      en: 'Seek urgent care if a joint suddenly becomes red, hot, swollen, and extremely painful with a fever.',
      es: 'Busque atención si una articulación se pone roja, caliente, hinchada y con fiebre.',
      zh: '如果关节突然红肿、发热、极度疼痛并伴有发烧，请立即就医。',
      am: 'መገጣጠሚያዎ ድንገት ቀይ፣ ሞቃት፣ ያበጠ እና ከከፍተኛ ህመም ጋር ከትኩሳት ጋር ከታየ ህክምና ያግኙ።',
      vi: 'Đi khám gấp nếu khớp đột nhiên đỏ, sưng nóng, đau dữ dội kèm theo sốt.'
    },
    whatIsIt: { 
      en: 'Swelling and tenderness of one or more joints, causing stiffness and pain with movement.',
      es: 'Inflamación y sensibilidad de las articulaciones, causando rigidez y dolor al moverlas.',
      zh: '一个或多个关节肿胀压痛，导致活动时僵硬和疼痛。',
      am: 'በአንድ ወይም ከዚያ በላይ መገጣጠሚያዎች ላይ እብጠት ሲኖር መንቀሳቀስ ማጠንከር እና ህመም ማምጣት ነው።',
      vi: 'Sưng và đau một hoặc nhiều khớp, gây cứng khớp và đau khi cử động.'
    },
    lifestyle: { 
      en: ['<strong>Low-Impact Exercise:</strong> Try swimming or cycling to protect joints.', '<strong>Apply Warmth:</strong> Use warm compresses to loosen stiff joints.'],
      es: ['<strong>Ejercicio de bajo impacto:</strong> Natación o ciclismo.', '<strong>Aplicar calor:</strong> Use compresas tibias para relajar.'],
      zh: ['<strong>低冲击运动：</strong> 尝试游泳或骑自行车以保护关节。', '<strong>温敷疗法：</strong> 使用热敷缓解关节僵硬。'],
      am: ['<strong>ቀላል እንቅስቃሴ፦</strong> መገጣጠሚያዎችን ለመጠበቅ መዋኘት ወይም ብስክሌት መንዳት።', '<strong>ሙቅ ነገር ማድረግ፦</strong> ጠንካራ መገጣጠሚያዎችን ለማለስለስ ሙቅ ጨርቅ ያድርጉ።'],
      vi: ['<strong>Tập thể dục nhẹ nhàng:</strong> Bơi lội hoặc đạp xe để bảo vệ khớp.', '<strong>Chườm ấm:</strong> Giúp làm lỏng các khớp bị cứng.']
    }
  },
  {
    id: 'osteoporosis',
    keywords: ['osteoporosis', 'weak bones', 'osteoporosis', '骨质疏松', 'አጥንት መቀነስ', 'loãng xương'],
    category: { en: 'Joints & Bones', es: 'Articulaciones y Huesos', zh: '关节与骨骼', am: 'መገጣጠሚያ እና አጥንት', vi: 'Khớp & Xương' },
    title: { en: 'Osteoporosis', es: 'Osteoporosis', zh: '骨质疏松症', am: 'የአጥንት መቀጠን (Osteoporosis)', vi: 'Loãng Xương' },
    emergency: { 
      en: 'Seek immediate care for sudden, severe back pain or any bone fracture from a minor fall.',
      es: 'Busque atención inmediata por dolor de espalda severo o fractura ósea por caída leve.',
      zh: '如果突然出现严重的背部疼痛或因轻微摔倒导致骨折，请立即就医。',
      am: 'ድንገተኛ የጀርባ ህመም ወይም ቀላል ውድቀት አጥንት ሰብሮ ከታየ ወዲያውኑ ህክምና ያግኙ።',
      vi: 'Đi cấp cứu ngay nếu đau lưng đột ngột hoặc gãy xương do ngã nhẹ.'
    },
    whatIsIt: { 
      en: 'Bones become weak and brittle, making them much more likely to break easily.',
      es: 'Los huesos se vuelven débiles y frágiles, aumentando el riesgo de fracturas.',
      zh: '骨骼变得脆弱易碎，极易发生骨折。',
      am: 'አጥንቶች ድርቅ እና የተሰባበሩ ስለሚሆኑ በቀላሉ የመሰበር እድላቸው ከፍ ያለ ነው።',
      vi: 'Xương trở nên yếu và giòn, khiến chúng dễ bị gãy hơn.'
    },
    lifestyle: { 
      en: ['<strong>Get Calcium & Vitamin D:</strong> Eat dairy, leafy greens, and safe sunlight.', '<strong>Weight-Bearing Exercise:</strong> Walking and light resistance training.'],
      es: ['<strong>Calcio y Vitamina D:</strong> Consuma lácteos y vegetales verdes.', '<strong>Ejercicio con peso:</strong> Caminatas y resistencia ligera.'],
      zh: ['<strong>补充钙质与维生素D：</strong> 多吃乳制品、绿叶蔬菜并适度晒太阳。', '<strong>负重运动：</strong> 坚持散步和轻量抗阻训练。'],
      am: ['<strong>ካልሲየም እና ቪታሚን ዲ ማግኘት፦</strong> ወተት፣ አረንጓዴ አትክልቶችን መመገብ።', '<strong>ክብደት ማንሳት እንቅስቃሴ፦</strong> መራመድ እና ቀላል ስልጠናዎች።'],
      vi: ['<strong>Bổ sung Canxi & Vitamin D:</strong> Ăn sữa, rau xanh và phơi nắng an toàn.', '<strong>Tập chịu lực:</strong> Đi bộ và tập tạ nhẹ.']
    }
  },
  {
    id: 'acne',
    keywords: ['acne', 'pimples', 'acne', '青春痘', 'មុን', 'mụn trứng cá'],
    category: { en: 'Joints & Bones', es: 'Articulaciones y Huesos', zh: '关节与骨骼', am: 'መገጣጠሚያ እና አጥንት', vi: 'Khớp & Xương' },
    title: { en: 'Acne', es: 'Acné', zh: '痤疮（青春痘）', am: 'የፊት ቆዳ ላይ የሚወጣ ቆዳ (Acne)', vi: 'Mụn Trứng Cá' },
    emergency: { 
      en: 'Consult a doctor if acne is severe, painful beneath the skin, or causing emotional distress and scarring.',
      es: 'Consulte a un médico si el acné es severo, doloroso o deja cicatrices.',
      zh: '如果痤疮严重、皮下疼痛或导致情绪困扰及留疤，请咨询医生。',
      am: 'የቆዳ ችግሩ ከባድ ከሆነ፣ ከቆዳ ስር የሚያም ከሆነ ወይም ጠባሳ የሚተው ከሆነ ሐኪም ያማክሩ።',
      vi: 'Tham khảo ý kiến bác sĩ nếu mụn nặng, đau dưới da hoặc để lại sẹo.'
    },
    whatIsIt: { 
      en: 'Skin pores getting clogged with oil and dead skin cells, causing pimples and blackheads.',
      es: 'Poros de la piel tapados con grasa y células muertas, causando granos.',
      zh: '毛孔被油脂和死皮细胞堵塞，从而引起粉刺和黑头。',
      am: 'የቆዳ ቀዳዳዎች በዘይት እና በሞቱ የቆዳ ህዋሶች በመዘጋታቸው የሚፈጠር ነው።',
      vi: 'Lỗ chân lông bị tắc bởi dầu và tế bào chết, gây ra mụn nhọt.'
    },
    lifestyle: { 
      en: ['<strong>Wash Gently:</strong> Clean your face twice daily with a mild cleanser.', '<strong>Do Not Pop:</strong> Squeezing pimples spreads bacteria and causes scars.'],
      es: ['<strong>Lave con suavidad:</strong> Limpie su cara dos veces al día.', '<strong>No los reviente:</strong> Esprujir causa cicatrices.'],
      zh: ['<strong>温和洁面：</strong> 每天用温和洁面乳洗脸两次。', '<strong>切勿挤压：</strong> 挤痘痘会扩散细菌并留下疤痕。'],
      am: ['<strong>በጥንቃቄ መታጠብ፦</strong> ፊትዎን በቀን ሁለት ጊዜ ለስላሳ ሳሙና ይታጠቡ።', '<strong>አትንኩ፦</strong> መጨፍለቅ ባክቴሪያን ያስፋፋል ጠባሳም ይተወል።'],
      vi: ['<strong>Rửa mặt nhẹ nhàng:</strong> Rửa mặt hai lần mỗi ngày bằng sữa rửa mặt dịu nhẹ.', '<strong>Không nặn mụn:</strong> Nặn mụn làm lây lan vi khuẩn và để lại sẹo.']
    }
  },
  {
    id: 'eczema',
    keywords: ['eczema', 'skin rash', 'eccema', '湿疹', 'የቆዳ መשלት', 'chàm'],
    category: { en: 'Joints & Bones', es: 'Articulaciones y Huesos', zh: '关节与骨骼', am: 'መገጣጠሚያ እና አጥንት', vi: 'Khớp & Xương' },
    title: { en: 'Eczema (Atopic Dermatitis)', es: 'Eczema', zh: '湿疹', am: 'የቆዳ መቅላት (Eczema)', vi: 'Bệnh Chàm (Eczema)' },
    emergency: { 
      en: 'See a doctor if the skin shows signs of a severe bacterial infection like pus, yellow crusts, or heat.',
      es: 'Consulte a un médico si la piel muestra signos de infección como pus o costras.',
      zh: '如果皮肤出现化脓、黄色结痂或发热等严重细菌感染迹象，请看医生。',
      am: 'ቆዳው የባክቴሪያ ኢንፌክሽን ምልክቶች ካሳየ (ኩስ፣ ቢጫ ቅርፊት) ሐኪም ያማክሩ።',
      vi: 'Đi khám nếu da có dấu hiệu nhiễm trùng nặng như mủ, vảy vàng hoặc nóng rát.'
    },
    whatIsIt: { 
      en: 'A chronic skin condition causing dry, itchy, inflamed, and irritated patches.',
      es: 'Condición cutánea crónica que causa parches de piel secos, con comezón e inflamados.',
      zh: '一种慢性皮肤病，会导致皮肤出现干燥、发痒、发炎和受刺激的斑块。',
      am: 'ደረቅ፣ የሚያሳክክ እና የሚያቃጥል የቆዳ ሁኔታ የሚያስከትል የቆየ የቆዳ ህመም ነው።',
      vi: 'Tình trạng da mãn tính gây khô, ngứa, viêm và kích ứng da.'
    },
    lifestyle: { 
      en: ['<strong>Moisturize Daily:</strong> Apply thick creams or ointments right after bathing.', '<strong>Avoid Harsh Soaps:</strong> Use fragrance-free, gentle skin products.'],
      es: ['<strong>Hidrate a diario:</strong> Use cremas espesas tras el baño.', '<strong>Evite jabones fuertes:</strong> Use productos sin fragancia.'],
      zh: ['<strong>日常保湿：</strong> 沐浴后立即涂抹厚重乳霜或软膏。', '<strong>避免刺激性肥皂：</strong> 使用无香料的温和护肤品。'],
      am: ['<strong>እርጥበት መጠበቅ፦</strong> ከታጠቡ በኋላ ወዲያውኑ ወፍራም ክሬም ይቀቡ።', '<strong>ጠንካራ ሳሙናዎችን ያስወግዱ፦</strong> ሽታ የሌላቸውን ምርቶች ይጠቀሙ።'],
      vi: ['<strong>Dưỡng ẩm hàng ngày:</strong> Bôi kem dưỡng ẩm ngay sau khi tắm.', '<strong>Tránh xà phòng mạnh:</strong> Dùng sản phẩm dịu nhẹ, không mùi.']
    }
  }
];
{
    id: 'gout',
    keywords: ['gout', 'uric acid', 'toe pain', 'gota', '痛风', 'ሪህ', 'gút'],
    category: { en: 'Joints & Bones', es: 'Articulaciones y Huesos', zh: '关节与骨骼', am: 'መገጣጠሚያ እና አጥንት', vi: 'Khớp & Xương' },
    title: { en: 'Gout', es: 'Gota', zh: '痛风', am: 'ሪህ (Gout)', vi: 'Bệnh Gút' },
    emergency: { 
      en: 'Seek medical care if a joint is extremely painful, hot, and swollen, especially with a fever.',
      es: 'Busque atención médica si una articulación está muy dolorosa, caliente e hinchada.',
      zh: '如果关节极度疼痛、发热和红肿，特别是伴有发烧，请就医。',
      am: 'መገጣጠሚያዎ በጣም የሚያመው፣ ሞቃት እና ያበጠ ከሆነ፣ በተለይም ከትኩሳት ጋር ከሆነ ህክምና ያግኙ።',
      vi: 'Đi khám nếu khớp cực kỳ đau, nóng và sưng, đặc biệt là kèm theo sốt.'
    },
    whatIsIt: { 
      en: 'A type of arthritis caused by a buildup of uric acid crystals in the joints, often starting in the big toe.',
      es: 'Un tipo de artritis causado por la acumulación de cristales de ácido úrico en las articulaciones.',
      zh: '一种由尿酸结晶在关节积聚引起的关节炎，通常从大脚趾开始。',
      am: 'በመገጣጠሚያዎች ላይ የዩሪክ አሲድ ክሪስታሎች በመከማቸት የሚመጣ የአርትሪት አይነት ነው።',
      vi: 'Một dạng viêm khớp do tích tụ tinh thể axit uric trong khớp, thường bắt đầu ở ngón chân cái.'
    },
    lifestyle: { 
      en: ['<strong>Stay Hydrated:</strong> Drink plenty of water to help flush out uric acid.', '<strong>Limit Purine-Rich Foods:</strong> Reduce red meat, shellfish, and alcohol.'],
      es: ['<strong>Manténgase hidratado:</strong> Beba mucha agua para eliminar el ácido úrico.', '<strong>Limite alimentos ricos en purinas:</strong> Reduzca carnes rojas y alcohol.'],
      zh: ['<strong>保持水分：</strong> 多喝水以帮助排出尿酸。', '<strong>限制高嘌呤食物：</strong> 减少红肉、贝类和酒精摄入。'],
      am: ['<strong>ፈሳሽ ይጠጡ፦</strong> ዩሪክ አሲድን ለማስወገድ ብዙ ውሃ ይጠጡ።', '<strong>የተወሰኑ ምግቦችን ይገድቡ፦</strong> ቀይ ሥጋ እና አልኮልን ይቀንሱ።'],
      vi: ['<strong>Uống đủ nước:</strong> Uống nhiều nước để đào thải axit uric.', '<strong>Hạn chế thực phẩm giàu purin:</strong> Giảm thịt đỏ, hải sản và rượu bia.']
    }
  },

// Search & Rendering Logic
function runSearch() {
  const queryInput = document.getElementById('search-input');
  if (!queryInput) return;
  
  const query = queryInput.value.toLowerCase().trim();
  const card = document.getElementById('results-card');
  
  if (!query) return;

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
    card.style.display = 'block';
    
    const badge = document.getElementById('res-badge');
    if (badge) badge.innerText = '✨ ClearHealth';
    
    const title = document.getElementById('res-title');
    if (title) title.innerText = 'Condition Not Found';
    
    document.getElementById('res-what-label').style.display = 'none';
    document.getElementById('res-lifestyle-label').style.display = 'none';
    
    const whatText = document.getElementById('res-what-text');
    if (whatText) {
      whatText.innerText = `We don't have an entry for "${query}" yet! Try searching for terms like Diabetes, Asthma, Flu, or Heart Attack.`;
    }
    
    document.getElementById('res-action-grid').innerHTML = '';
    document.getElementById('emergency-box').style.display = 'none';
  }
}

function filterByCategory(categoryKey, element) {
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => chip.classList.remove('active'));
  if (element) element.classList.add('active');

  if (categoryKey === 'all') {
    document.getElementById('results-card').style.display = 'none';
    activeConditionId = '';
    return;
  }

  const match = medicalDatabase.find(item => {
    return item.category.en.toLowerCase().includes(categoryKey.toLowerCase());
  });

  if (match) {
    activeConditionId = match.id;
    renderCard();
  } else {
    document.getElementById('results-card').style.display = 'none';
  }
}

function changeLanguage() {
  const langSelect = document.getElementById('lang-select');
  if (langSelect) currentLang = langSelect.value;
  updateUIText();
  if (activeConditionId) renderCard();
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

  document.getElementById('res-what-label').style.display = 'block';
  document.getElementById('res-lifestyle-label').style.display = 'block';

  document.getElementById('res-badge').innerText = condition.category[currentLang] || condition.category.en;
  document.getElementById('res-title').innerText = condition.title[currentLang] || condition.title.en;
  document.getElementById('res-what-text').innerText = condition.whatIsIt[currentLang] || condition.whatIsIt.en;

  const emergencyBox = document.getElementById('emergency-box');
  const emergencyText = document.getElementById('res-emergency-text');
  if (condition.emergency) {
    emergencyText.innerText = condition.emergency[currentLang] || condition.emergency.en;
    emergencyBox.style.display = 'flex';
  } else {
    emergencyBox.style.display = 'none';
  }

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

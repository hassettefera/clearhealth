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

// Medical Database (Part 1: Conditions 1 - 25)
const medicalDatabase = [
  // --- 🫀 Heart, Blood, & Circulation ---
  {
    id: 'blood_pressure',
    keywords: ['high blood pressure', 'hypertension', 'blood pressure', 'presion alta', '高血压', 'ደም ግፊት', 'cao huyết áp'],
    category: { en: 'Heart, Blood, & Circulation', es: 'Corazón, Sangre y Circulación', zh: '心脏、血液与循环', am: 'ልብ፣ ደም እና የደም ዝውውር', vi: 'Tim, Máu & Tuần Hoàn' },
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
    category: { en: 'Heart, Blood, & Circulation', es: 'Corazón, Sangre y Circulación', zh: '心脏、血液与循环', am: 'ልብ፣ ደም እና የደም ዝውውር', vi: 'Tim, Máu & Tuần Hoàn' },
    title: { en: 'High Cholesterol', es: 'Colesterol Alto', zh: '高胆固醇', am: 'ከፍተኛ ኮሌስትሮል', vi: 'Cholesterol Cao' },
    emergency: { 
      en: 'Seek urgent medical attention if you experience sudden chest tightness or left arm pain.',
      es: 'Busque ayuda médica si siente opresión repentina en el pecho o dolor en el brazo izquierdo.',
      zh: '如果突发胸闷或左臂疼痛，请立即就医。',
      am: 'ድንገተኛ የደረት ወጋ ወይም የግራ እጅ ህመም ካጋጠመዎት ወዲያውኑ ህክምና ያግኙ።',
      vi: 'Đi khám ngay if bị tức ngực đột ngột hoặc đau tay trái.'
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
    category: { en: 'Heart, Blood, & Circulation', es: 'Corazón, Sangre y Circulación', zh: '心脏、血液与循环', am: 'ልብ፣ ደም እና የደም ዝውውር', vi: 'Tim, Máu & Tuần Hoàn' },
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
    category: { en: 'Heart, Blood, & Circulation', es: 'Corazón, Sangre y Circulación', zh: '心脏、血液与循环', am: 'ልብ፣ ደም እና የደም ዝውውር', vi: 'Tim, Máu & Tuần Hoàn' },
    title: { en: 'Heart Attack', es: 'Ataque al Corazón', zh: '心脏病发作', am: 'የልብ ህመም (Heart Attack)', vi: 'Cơn Đau Tim' },
    emergency: { 
      en: 'CALL 911 IMMEDIATELY if you feel crushing chest pain, or pain radiating to your jaw or arm.',
      es: '¡LLAME AL 911 DE INMEDIATO si siente dolor opresivo en el pecho, mandíbula o brazo!',
      zh: '如果感到胸部压迫性剧痛、疼痛放射至手臂或下巴，请立即拨打急救电话！',
      am: 'ከባድ የደረት ህመም፣ ወደ እጅ ወይም መንገጭላ የሚሄድ ህመም ካለ ወዲያውኑ ወደ 911 ይደውሉ!',
      vi: 'GỌI CẤP CỨU NGAY if bị đau thắt ngực lan ra tay hoặc hàm!'
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
      am: ['<strong>ወደ ህክምና ይደውሉ፦</strong> እራስዎ መኪና አያሽከረክሩ።', '<strong>አስপিরিন ያመዝምዙ፦</strong> ከህክምና ባለሙያ ካዘዙዎት ብቻ።'],
      vi: ['<strong>Gọi cấp cứu:</strong> Không tự lái xe đến viện.', '<strong>Nhai Aspirin:</strong> Nếu được nhân viên y tế hướng dẫn.']
    }
  },
  {
    id: 'stroke',
    keywords: ['stroke', 'brain attack', 'derrame cerebral', '中风', 'ስትሮክ', 'đột quỵ'],
    category: { en: 'Heart, Blood, & Circulation', es: 'Corazón, Sangre y Circulación', zh: '心脏、血液与循环', am: 'ልብ፣ ደም እና የደም ዝውውር', vi: 'Tim, Máu & Tuần Hoàn' },
    title: { en: 'Stroke', es: 'Derrame Cerebral', zh: '中风', am: 'ስትሮክ (Stroke)', vi: 'Đột Quỵ' },
    emergency: { 
      en: 'CALL 911 IMMEDIATELY. Remember FAST: Face drooping, Arm weakness, Speech difficulty, Time to call 911.',
      es: 'LLAME AL 911 DE INMEDIATO. Observe si hay cara caída, debilidad en un brazo o dificultad para hablar.',
      zh: '立即拨打急救电话。注意FAST原则：面部歪斜、手臂无力、言语不清、立即求救！',
      am: 'ወዲያውኑ ወደ ህክምና ይደውሉ፦ የፊት መዛባት፣ የእጅ መዝለል ወይም የመናገር ችግር ካዩ::',
      vi: 'GỌI CẤP CỨU NGAY if bị méo miệng, yếu tay hoặc khó nói.'
    },
    whatIsIt: { 
      en: 'A blocked or burst tube stopping blood in the brain.',
      es: 'Una arteria bloqueada o rota que interrumpe la sangre al cerebro.',
      zh: '大脑血管堵塞或破裂，导致脑部供血中断。',
      am: 'በአንጎል ውስጥ የደም ሥር መዘጋት ወይም መፈንዳት ሲከሰት የሚፈጠር ነው።',
      vi: 'Mạch máu não bị tắc hoặc vỡ làm gián đoạn máu nuôi脑.'
    },
    lifestyle: { 
      en: ['<strong>Act Fast:</strong> Time is critical to saving brain function.'],
      es: ['<strong>Actúe rápido:</strong> Cada minuto cuenta.'],
      zh: ['<strong>快速行动：</strong> 争取抢救金黄金时间。'],
      am: ['<strong>በፍጥነት ይንቀሳቀሱ፦</strong> ጊዜ የአንጎልን ህዋሳት ለማዳን ወሳኝ ነው::'],
      vi: ['<strong>Hành động nhanh:</strong> Thời gian là vàng để cứu não.']
    }
  }
];

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
      whatText.innerText = `We don't have an entry for "${query}" yet! Try searching for terms like Diabetes, Asthma, Migraine, or Heart Attack.`;
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
// Append these entries into your medicalDatabase array:

  // --- 🫁 Lungs & Breathing ---
  {
    id: 'asthma',
    keywords: ['asthma', 'breathing', 'asma', '哮喘', 'አስሞች', 'hen suyễn'],
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
      vi: 'Đi khám ngay if bị đau ngực severe, khó thở hoặc sốt cao không hạ.'
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

  // --- 🧠 Brain & Mental Health ---
  {
    id: 'migraine',
    keywords: ['migraine', 'headache', 'migraña', '偏头痛', 'ራስ ምታት', 'đau nửa đầu'],
    category: { en: 'Brain & Mental Health', es: 'Cerebro y Salud Mental', zh: '大脑与心理健康', am: 'አንጎል እና አእምሮ ጤና', vi: 'Bộ Não & Tâm Thần' },
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
      vi: 'Cơn đau đầu dữ dội dồn dập, thường gây nôn y sợ ánh sáng.'
    },
    lifestyle: { 
      en: ['<strong>Rest in a Dark Room:</strong> Turn off all lights and screens.', '<strong>Apply Cold Compress:</strong> Put an ice pack on your forehead.'],
      es: ['<strong>Descansar a oscuras:</strong> Apague luces y pantallas.', '<strong>Compresa fría:</strong> Ponga hielo en la frente.'],
      zh: ['<strong>在黑暗处休息：</strong> 关闭灯光和电子屏幕。', '<strong>冷敷：</strong> 额头敷冰袋。'],
      am: ['<strong>ጨለማ ክፍል ውስጥ ያረፉ፦</strong> መብራት እና ስክሪኖችን ያጥፉ።', '<strong>ቀዝቃዛ ጨርቅ ማድረግ፦</strong> በግንባርዎ ላይ ቀዝቃዛ ነገር ያድርጉ።'],
      vi: ['<strong>Nghỉ trong phòng tối:</strong> Tắt hết đèn và thiết bị điện tử.', '<strong>Chườm lạnh:</strong> Đặt túi băng lên trán.']
    }
  },

  // --- 💧 Urinary, Kidney, & Blood Sugar ---
  {
    id: 'diabetes',
    keywords: ['diabetes', 'sugar', 'diabetes', '糖尿病', 'ስኳር በሽታ', 'tiểu đường'],
    category: { en: 'Urinary, Kidney, & Blood Sugar', es: 'Sistemas Urinario y Azúcar', zh: '泌尿、肾脏与血糖', am: 'የሽንት፣ ኩላሊት እና ስኳር', vi: 'Thận & Đường Huyết' },
    title: { en: 'Diabetes (Type 2)', es: 'Diabetes Tipo 2', zh: '2型糖尿病', am: 'የስኳር በሽታ (Type 2)', vi: 'Tiểu Đường Tuýp 2' },
    emergency: { 
      en: 'Seek immediate care for extreme confusion, fruity-smelling breath, or fainting.',
      es: 'Busque ayuda inmediata si hay confusión extrema, aliento con olor a frutas o desmayo.',
      zh: '出现极度混乱、呼出气体有水果味或晕厥时，请立即就医。',
      am: 'ከፍተኛ ግራ መጋባት፣ የፍራፍሬ ሽታ ያለው እስትንፋስ ወይም ራስን መሳት ካለ ወዲያውኑ ወደ ህክምና ይሂዱ።',
      vi: 'Đi cấp cứu ngay if bị mơ hồ severe, hơi thở có mùi trái cây hoặc ngất xỉu.'
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

  // --- 🚨 Everyday Emergencies & Injuries ---
  {
    id: 'appendicitis',
    keywords: ['appendicitis', 'appendix', 'apendicitis', '阑尾炎', 'ትርፍ አንጀት', 'viêm ruột thừa'],
    category: { en: 'Everyday Emergencies & Injuries', es: 'Emergencias Diarias', zh: '日常急救与外伤', am: 'ድንገተኛ አደጋዎች', vi: 'Cấp Cứu Hàng Ngày' },
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
  }

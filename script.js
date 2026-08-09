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
  document.getElementById('theme-toggle').innerText = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
}

// Load saved theme choice
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-toggle').innerText = savedTheme === 'dark' ? '☀️' : '🌙';
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

// Expanded Database with Emergency Callouts
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
    category: { en: 'Energy & Sugar', es: 'Energía y Azúcar', zh: '能量与血糖', am: 'ጉልበት እና ስኳር', vi: 'Năng Lượng & Đường' },
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

function filterByCategory(categoryName, element) {
  activeCategoryFilter = categoryName;

  // Update active chip UI button
  const chips = document.querySelectorAll('.chip-btn');
  chips.forEach(chip => chip.classList.remove('active'));
  element.classList.add('active');

  if (categoryName === 'all') {
    document.getElementById('results-card').style.display = 'none';
    return;
  }

  // Find first condition matching selected category
  const match = medicalDatabase.find(item => item.category.en === categoryName);
  if (match) {
    activeConditionId = match.id;
    renderCard();
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
    document.getElementById('res-what-text').innerText = `We couldn't find anything for "${query}". Try searching for terms like "Diabetes" or "Asthma".`;
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

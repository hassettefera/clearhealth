let currentLang = 'en';
let activeConditionId = ''; 

// 1. Core Medical Database with multi-language keywords & common typos
const medicalDatabase = [
  {
    id: 'blood_pressure',
    keywords: [
      'high blood pressure', 'hypertension', 'blood pressure', 'hypertention', 'hipertension',
      'presion', 'alta', 'presion alta', 'hipertension', 'ypertension',
      '高血压', '血压', 'gaoxueya',
      'ደም ግፊት', 'ግፊት', 'dem gifit',
      'cao huyet ap', 'huyet ap', 'cao huyết áp'
    ]
  },
  {
    id: 'diabetes',
    keywords: [
      'diabetes', 'high blood sugar', 'diabetis', 'diabete', 'sugar disease',
      'diabetes', 'azucar alta', 'diabetis', 'azucar',
      '糖尿病', '血糖高', 'tangniaobing', 'xuetang',
      'ስኳር በሽታ', 'ስኳር', 'sukar beshita', 'sukar',
      'tieu duong', 'bệnh tiểu đường', 'tiểu đường', 'duong huyet'
    ]
  },
  {
    id: 'asthma',
    keywords: [
      'asthma', 'breathing trouble', 'astha', 'asmar', 'asthmar',
      'asma', 'problema respiratorio', 'asmatiko',
      '哮喘', '气喘', 'xiaochuan',
      'አስም', 'የመተንፈስ ችግር', 'asme', 'asym',
      'hen suyên', 'bệnh hen', 'suyễn', 'hen suyen'
    ]
  }
];

// 2. Configure typo-correction engine rules
const fuseOptions = {
  includeScore: true,
  threshold: 0.4, 
  keys: ['keywords']
};

// 3. Initialize the search engine immediately
const fuseInstance = new Fuse(medicalDatabase, fuseOptions);

function runSearch() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const resultsCard = document.getElementById('results-card');
  
  if (!query) return;

  // Execute fuzzy match search
  const searchResults = fuseInstance.search(query);

  if (searchResults.length > 0) {
    // Accesses the top matched result item in the search list arrays
    activeConditionId = searchResults[0].item.id; 
    resultsCard.style.display = "block"; 
    updatePageLanguage();
  } else {
    alert("Condition not found. Try searching for 'High Blood Pressure', 'Diabetes', or 'Asthma'.");
  }
}

function changeLanguage() {
  currentLang = document.getElementById('lang-select').value;
  updatePageLanguage();
}

function updatePageLanguage() {
  const title = document.getElementById('search-title');
  const subtitle = document.getElementById('search-subtitle');
  const input = document.getElementById('search-input');
  const btn = document.getElementById('search-btn');
  
  // Hide all results sections first to prevent layout overlaps
  const contents = document.getElementsByClassName('lang-content');
  for (let i = 0; i < contents.length; i++) {
    contents[i].style.display = 'none';
  }
  
  // Translate search engine interface text templates dynamically
  if (currentLang === 'es') {
    title.innerHTML = "Información médica, simplificada.";
    subtitle.innerHTML = "Comprenda su diagnóstico y los siguientes pasos en un lenguaje sencillo y cotidiano.";
    input.placeholder = "Busque una condición (ej. Diabetes)...";
    btn.innerHTML = "Buscar";
  } else if (currentLang === 'zh') {
    title.innerHTML = "医学信息，通俗易懂。";
    subtitle.innerHTML = "用清晰、日常的语言了解您的诊断和后续步骤。";
    input.placeholder = "输入疾病名称 (例如：糖尿病)...";
    btn.innerHTML = "搜索";
  } else if (currentLang === 'am') {
    title.innerHTML = "የሕክምና መረጃ፣ በቀላሉ የቀረበ።";
    subtitle.innerHTML = "የምርመራ ውጤትዎን እና የሚቀጥሉትን እርምጃዎች ግልጽ በሆነ የዕለት ተዕለት ቋንቋ ይረዱ።";
    input.placeholder = "የበሽታውን ስም ያስገቡ (ምሳሌ፦ ስኳር በሽታ)...";
    btn.innerHTML = "ፈልግ";
  } else if (currentLang === 'vi') {
    title.innerHTML = "Thông tin y tế, đơn giản hóa.";
    subtitle.innerHTML = "Hiêu chẩn đoán của bạn và các bước tiếp theo bằng ngôn ngữ dễ hiểu hàng ngày.";
    input.placeholder = "Nhập tên bệnh (ví dụ: Tiểu Đường)...";
    btn.innerHTML = "Tìm kiếm";
  } else {
    title.innerHTML = "Medical information, simplified.";
    subtitle.innerHTML = "Understand your diagnosis and next steps in clear, everyday language.";
    input.placeholder = "Search a condition (e.g., Diabetes, Asthma)...";
    btn.innerHTML = "Search";
  }

  // Display the correct matching condition card in the correct target language
  if (activeConditionId) {
    const targetBlockId = `content-${activeConditionId}-${currentLang}`;
    const targetBlock = document.getElementById(targetBlockId);
    if (targetBlock) {
      targetBlock.style.display = 'block';
    }
  }
}

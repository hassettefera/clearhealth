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
  threshold: 0.4, // Allows typos but keeps matching smart
  keys: ['keywords']
};

let fuseInstance;

// Safely initialize the engine once the web page loads completely
window.onload = function() {
  if (typeof Fuse !== 'undefined') {
    fuseInstance = new Fuse(medicalDatabase, fuseOptions);
  } else {
    console.error("Fuse.js failed to load from the internet server.");
  }
};

function runSearch() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const resultsCard = document.getElementById('results-card');
  
  if (!query) return;
  
  if (!fuseInstance) {
    alert("Search engine is still initializing. Please wait one moment and click Search again!");
    return;
  }

  // Execute fuzzy match matching rules
  const searchResults = fuseInstance.search(query);

  if (searchResults.length > 0) {
    activeConditionId = searchResults[0].item.id; // Extracts the best matching card name
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
  const input = document.getElementById('search-input');
  const btn = document.getElementById('search-btn');
  const label = document.getElementById('lang-label');
  
  // Hide all results sections first to prevent layout layering
  const contents = document.getElementsByClassName('lang-content');
  for (let i = 0; i < contents.length; i++) {
    contents[i].style.display = 'none';
  }
  
  // Translate Interface Text templates dynamically
  if (currentLang === 'es') {
    title.innerHTML = "Información Médica, Simplificada.";
    input.placeholder = "Escriba una condición (ej. Diabetes)...";
    btn.innerHTML = "Buscar";
    label.innerHTML = "Idioma:";
  } else if (currentLang === 'zh') {
    title.innerHTML = "医学信息，通俗易懂。";
    input.placeholder = "输入疾病名称 (例如：糖尿病)...";
    btn.innerHTML = "搜索";
    label.innerHTML = "语言:";
  } else if (currentLang === 'am') {
    title.innerHTML = "የሕክምና መረጃ፣ በቀላሉ የቀረበ።";
    input.placeholder = "የበሽታውን ስም ያስገቡ (ምሳሌ፦ ስኳር በሽታ)...";
    btn.innerHTML = "ፈልግ";
    label.innerHTML = "ቋንቋ፦";
  } else if (currentLang === 'vi') {
    title.innerHTML = "Thông Tin Y Tế, Đơn Giản Hóa.";
    input.placeholder = "Nhập tên bệnh (ví dụ: Tiểu Đường)...";
    btn.innerHTML = "Tìm kiếm";
    label.innerHTML = "Ngôn ngữ:";
  } else {
    title.innerHTML = "Medical Information, Simplified.";
    input.placeholder = "Type a condition (e.g., Diabetes)...";
    btn.innerHTML = "Search";
    label.innerHTML = "Language:";
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

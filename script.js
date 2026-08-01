let currentLang = 'en';
let activeConditionId = ''; 

// 1. Expanded database with Diabetes and Asthma added
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

const fuseOptions = {
  includeScore: true,
  threshold: 0.4, 
  keys: ['keywords']
};

// Initialize Fuse.js once the page loads
let fuseInstance;
window.onload = function() {
  if (typeof Fuse !== 'undefined') {
    fuseInstance = new Fuse(medicalDatabase, fuseOptions);
  }
};

function runSearch() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  const resultsCard = document.getElementById('results-card');
  
  if (!query) return;
  if (!fuseInstance) {
    alert("Search engine is still loading, please try again in a second!");
    return;
  }

  const searchResults = fuseInstance.search(query);

  if (searchResults.length > 0) {
    activeConditionId = searchResults[0].item.id; // Get the closest match card ID
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
  
  // Hide all results sections first
  const contents = document.getElementsByClassName('lang-content');
  for (let i = 0; i < contents.length; i++) {
    contents[i].style.display = 'none';
  }
  
  // Manage Interface Text translations
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

  // Display the correct matching language content block
  if (activeConditionId) {
    const targetBlockId = `content-${activeConditionId}-${currentLang}`;
    const targetBlock = document.getElementById(targetBlockId);
    if (targetBlock) {
      targetBlock.style.display = 'block';
    }
  }
}

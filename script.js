let currentLang = 'en';
let activeConditionId = '';

// Interface Translations
const uiTranslations = {
  en: {
    title: "Medical information, simplified.",
    subtitle: "Understand your diagnosis and next steps in clear, everyday language.",
    placeholder: "Search a condition (e.g., Diabetes, Asthma)...",
    button: "Search",
    whatLabel: "What is it?",
    lifestyleLabel: "General Lifestyle Recommendations:"
  },
  es: {
    title: "Información médica, simplificada.",
    subtitle: "Comprenda su diagnóstico y los siguientes pasos en un lenguaje sencillo y cotidiano.",
    placeholder: "Busque una condición (ej. Diabetes)...",
    button: "Buscar",
    whatLabel: "¿Qué es?",
    lifestyleLabel: "Recomendaciones generales de estilo de vida:"
  },
  zh: {
    title: "医学信息，通俗易懂。",
    subtitle: "用清晰、日常的语言了解您的诊断和后续步骤。",
    placeholder: "输入疾病名称 (例如：糖尿病)...",
    button: "搜索",
    whatLabel: "它是什么？",
    lifestyleLabel: "日常生活建议："
  },
  am: {
    title: "የሕክምና መረጃ፣ በቀላሉ የቀረበ።",
    subtitle: "የምርመራ ውጤትዎን እና የሚቀጥሉትን እርምጃዎች ግልጽ በሆነ የዕለት ተዕለት ቋንቋ ይረዱ።",
    placeholder: "የበሽታውን ስም ያስገቡ (ምሳሌ፦ ስኳር በሽታ)...",
    button: "ፈልግ",
    whatLabel: "ምንድን ነው?",
    lifestyleLabel: "አጠቃላይ የአኗኗር ዘይቤ ምክሮች፦"
  },
  vi: {
    title: "Thông tin y tế, đơn giản hóa.",
    subtitle: "Hiểu chẩn đoán của bạn và các bước tiếp theo bằng ngôn ngữ dễ hiểu hàng ngày.",
    placeholder: "Nhập tên bệnh (ví dụ: Tiểu Đường)...",
    button: "Tìm kiếm",
    whatLabel: "Nó là gì?",
    lifestyleLabel: "Khuyến nghị lối sống chung:"
  }
};

// Medical Database (Max 3 lines explanation + general lifestyle tips only)
const medicalDatabase = [
  {
    id: 'blood_pressure',
    keywords: ['high blood pressure', 'hypertension', 'blood pressure', 'presion alta', '高血压', 'ደም ግፊት', 'cao huyết áp'],
    category: { en: 'Heart Health', es: 'Salud del Corazón', zh: '心脏健康', am: 'የልብ ጤና', vi: 'Sức Khỏe Tim Mạch' },
    title: { en: 'High Blood Pressure (Hypertension)', es: 'Presión Arterial Alta (Hipertensión)', zh: '高血压 (Hypertension)', am: 'ከፍተኛ የደም ግፊት', vi: 'Cao Huyết Áp' },
    whatIsIt: {
      en: "Imagine your blood vessels are like a garden hose. High blood pressure means blood pushes too hard against the inside walls, stressing your heart over time.",
      es: "Imagine que sus vasos sanguíneos son como una manguera de jardín. La presión alta significa que la sangre empuja con demasiada fuerza contra el interior.",
      zh: "想象一下，您的血管就像一根水管。高血压意味着血液在血管内推得太用力，久而久之会增加心脏负担。",
      am: "የደም ሥሮችዎን ልክ እንደ ውሃ ቱቦ ያስቡ። ከፍተኛ የደም ግፊት ማለት ደም በቱቦው ውስጥ በጣም በኃይል እየገፋ ነው ማለት ነው።",
      vi: "Hãy tưởng tượng mạch máu giống như vòi nước. Cao huyết áp có nghĩa là máu đang đẩy quá mạnh vào thành ống."
    },
    lifestyle: {
      en: [
        "<strong>Eat Balanced:</strong> Choose fresh foods and reduce processed salt intake.",
        "<strong>Stay Active:</strong> Engage in daily light movement like walking for 30 minutes."
      ],
      es: [
        "<strong>Alimentación equilibrada:</strong> Elija alimentos frescos y reduzca el consumo de sal.",
        "<strong>Actividad diaria:</strong> Realice caminatas de 30 minutos todos los días."
      ],
      zh: [
        "<strong>均衡饮食：</strong> 选择新鲜食物，减少加工盐摄入。",
        "<strong>保持运动：</strong> 每天进行30分钟的散步等轻度运动。"
      ],
      am: [
        "<strong>ጤናማ ምግብ፦</strong> ትኩስ ምግቦችን ይምረጡ እና የጨው መጠን ይቀንሱ።",
        "<strong>የነቃ እንቅስቃሴ፦</strong> በየቀኑ ለ30 ደቂቃ ያህል ይራመዱ።"
      ],
      vi: [
        "<strong>Ăn uống cân bằng:</strong> Chọn thực phẩm tươi và giảm lượng muối.",
        "<strong>Vận động hàng ngày:</strong> Đi bộ khoảng 30 phút mỗi ngày."
      ]
    }
  },
  {
    id: 'diabetes',
    keywords: ['diabetes', 'high blood sugar', 'azucar alta', '糖尿病', 'ስኳር በሽታ', 'tiểu đường'],
    category: { en: 'Metabolism', es: 'Metabolismo', zh: '新陈代谢', am: 'ሜታቦሊዝም', vi: 'Chuyển Hóa' },
    title: { en: 'Diabetes (High Blood Sugar)', es: 'Diabetes (Azúcar Alta)', zh: '糖尿病', am: 'ስኳር በሽታ', vi: 'Bệnh Tiểu Đường' },
    whatIsIt: {
      en: "Your body uses insulin like a key to let food sugar enter cells for energy. Diabetes occurs when the body struggles to use this key, leaving sugar in the bloodstream.",
      es: "El cuerpo usa la insulina como una llave para que el azúcar de los alimentos entre a las células. La diabetes ocurre cuando cuesta usar esta llave.",
      zh: "身体使用胰岛素作为“钥匙”让食物中的糖进入细胞以提供能量。当身体难以使用这把钥匙时，就会导致糖留在血液中。",
      am: "ሰውነትዎ ስኳርን ወደ ህዋሳት ለማስገባት ኢንሱሊን የሚባል ቁልፍ ይጠቀማል። ስኳር በሽታ ማለት ሰውነትዎ ይህንን ቁልፍ ለመጠቀም ሲቸገር ነው።",
      vi: "Cơ thể dùng insulin như chìa khóa để đưa đường vào tế bào. Bệnh tiểu đường xảy ra khi cơ thể gặp khó khăn khi dùng chìa khóa này."
    },
    lifestyle: {
      en: [
        "<strong>Plate Balance:</strong> Emphasize vegetables and whole grains over sugary drinks.",
        "<strong>Regular Exercise:</strong> Routine physical activity helps body cells manage energy."
      ],
      es: [
        "<strong>Plato balanceado:</strong> Consuma más verduras y evite las bebidas azucaradas.",
        "<strong>Ejercicio regular:</strong> La actividad física rutinaria ayuda a procesar la energía."
      ],
      zh: [
        "<strong>饮食平衡：</strong> 多吃蔬菜和全谷物，少喝含糖饮料。",
        "<strong>定期运动：</strong> 日常身体活动有助于细胞更好地利用能量。"
      ],
      am: [
        "<strong>የተመጣጠነ ምግብ፦</strong> ጣፋጭ መጠጦችን ይቀንሱ እና አትክልቶችን ያብዙ።",
        "<strong>አካል ብቃት እንቅስቃሴ፦</strong> መደበኛ እንቅስቃሴ ማድረግ ሰውነትን ይረዳል።"
      ],
      vi: [
        "<strong>Cân bằng bữa ăn:</strong> Ăn nhiều rau xanh và hạn chế đồ uống có đường.",
        "<strong>Tập thể dục đều đặn:</strong> Vận động giúp cơ thể sử dụng năng lượng tốt hơn."
      ]
    }
  },
  {
    id: 'asthma',
    keywords: ['asthma', 'breathing trouble', 'asma', '哮喘', 'አስም', 'hen suyễn'],
    category: { en: 'Respiratory', es: 'Respiratorio', zh: '呼吸系统', am: 'የመተንፈሻ አካላት', vi: 'Hô Hấp' },
    title: { en: 'Asthma', es: 'Asma', zh: '哮喘 (Asthma)', am: 'አስም (Asthma)', vi: 'Bệnh Hen Suyễn' },
    whatIsIt: {
      en: "Asthma causes the airways in the lungs to narrow and swell temporarily. This feels similar to trying to breathe through a narrow drinking straw.",
      es: "El asma hace que las vías respiratorias de los pulmones se estrechen e hinchen temporalmente, como respirar a través de un popote estrecho.",
      zh: "哮喘会导致肺部气道暂时变窄和肿胀，感觉就像试图通过一根细吸管呼吸一样。",
      am: "አስም በሳንባ ውስጥ ያሉ የመተንፈሻ ቱቦዎች በጊዜያዊነት እንዲጠቡ ያደርጋል። ይህም በጠባብ ቱቦ ለመተንፈስ እንደመሞከር ነው።",
      vi: "Bệnh hen suyễn làm các đường thở trong phổi tạm thời bị thu hẹp và sưng lên, giống như cố gắng thở qua một ống hút nhỏ."
    },
    lifestyle: {
      en: [
        "<strong>Clean Environment:</strong> Keep home spaces clean and free of dust or heavy smoke.",
        "<strong>Pollen Awareness:</strong> Monitor airborne triggers during seasonal changes."
      ],
      es: [
        "<strong>Entorno limpio:</strong> Mantenga el hogar libre de polvo y humo de cigarrillo.",
        "<strong>Atención al polen:</strong> Tenga cuidado con los alérgenos ambientales de temporada."
      ],
      zh: [
        "<strong>环境清洁：</strong> 保持居住空间干净，避免灰尘和烟雾。",
        "<strong>注意花粉：</strong> 在换季时注意过敏原的变化。"
      ],
      am: [
        "<strong>ፅዳት መጠበቅ፦</strong> የመኖሪያ ቦታዎን ከአቧራ እና ከጢስ ነፃ ያድርጉ።",
        "<strong>ወቅታዊ ጥንቃቄ፦</strong> በወቅት ለውጥ ወቅት የአየር ሁኔታዎችን ይከታተሉ።"
      ],
      vi: [
        "<strong>Môi trường sạch:</strong> Giữ không gian sống sạch sẽ, tránh bụi và khói.",
        "<strong>Theo dõi thời tiết:</strong> Chú ý các tác nhân dị ứng khi thay đổi mùa."
      ]
    }
  },
  {
    id: 'cholesterol',
    keywords: ['cholesterol', 'high cholesterol', 'colesterol', '胆固醇', 'ኮሌስትሮል'],
    category: { en: 'Heart Health', es: 'Salud del Corazón', zh: '心脏健康', am: 'የልብ ጤና', vi: 'Sức Khỏe Tim Mạch' },
    title: { en: 'High Cholesterol', es: 'Colesterol Alto', zh: '高胆固醇', am: 'ከፍተኛ ኮሌስትሮል', vi: 'Cholesterol Cao' },
    whatIsIt: {
      en: "Cholesterol is a soft substance in the blood. When levels are high, extra deposits can collect along vessel walls over time.",
      es: "El colesterol es una sustancia suave en la sangre. Cuando sus niveles son altos, se puede acumular gradualmente en los vasos.",
      zh: "胆固醇是血液中的一种软质物质。当浓度过高时，多余的沉淀物会随时间积聚在血管壁上。",
      am: "ኮሌስትሮል በደም ውስጥ ያለ ለስላሳ ነገር ነው። መጠኑ ከፍተኛ በሚሆንበት ጊዜ በደም ሥሮች ላይ ሊከማች ይችላል።",
      vi: "Cholesterol là một chất mềm trong máu. Khi mức cholesterol cao, nó có thể tích tụ dần dọc theo thành mạch."
    },
    lifestyle: {
      en: [
        "<strong>Heart-Healthy Fats:</strong> Choose olive oil and nuts over heavily fried food.",
        "<strong>Routine Movement:</strong> Incorporate daily walking into your regular routine."
      ],
      es: [
        "<strong>Grasas saludables:</strong> Elija aceite de oliva y frutos secos en lugar de fritos.",
        "<strong>Movimiento constante:</strong> Incorpore caminatas diarias a su rutina."
      ],
      zh: [
        "<strong>健康脂肪：</strong> 选择橄榄油和坚果，减少油炸食物。",
        "<strong>规律运动：</strong> 将日常散步融入日常生活中。"
      ],
      am: [
        "<strong>ጤናማ ጮማ፦</strong> የጠበሱ ምግቦችን ይቀንሱ እና ጤናማ ዘይቶችን ይጠቀሙ።",
        "<strong>የዘወትር እንቅስቃሴ፦</strong> በየቀኑ መራመድን ይለማመዱ።"
      ],
      vi: [
        "<strong>Chất béo lành mạnh:</strong> Ưu tiên dầu oliu và hạt thay vì đồ chiên xào.",
        "<strong>Vận động thường xuyên:</strong> Duy trì thói quen đi bộ hàng ngày."
      ]
    }
  },
  {
    id: 'anemia',
    keywords: ['anemia', 'iron', 'hierro', '贫血', 'አኔሚያ', 'thiếu máu'],
    category: { en: 'Blood Health', es: 'Salud de la Sangre', zh: '血液健康', am: 'የደም ጤና', vi: 'Sức Khỏe Máu' },
    title: { en: 'Anemia (Low Iron)', es: 'Anemia (Hierro Bajo)', zh: '贫血 (Anemia)', am: 'አኔሚያ (የደም ማነስ)', vi: 'Thiếu Máu' },
    whatIsIt: {
      en: "Anemia occurs when blood has fewer healthy red blood cells than normal, making it harder to deliver oxygen efficiently across the body.",
      es: "La anemia ocurre cuando la sangre tiene menos glóbulos rojos de lo normal, dificultando el transporte de oxígeno.",
      zh: "当血液中的健康红细胞少于正常水平时，就会发生贫血，使全身氧气的输送效率降低。",
      am: "የደም ማነስ የሚከሰተው በደም ውስጥ በቂ የደም ሕዋሳት ሳይኖሩ ሲቀሩ ነው። ይህም ኦክስጅንን ለማሰራጨት ያከብዳል።",
      vi: "Thiếu máu xảy ra khi máu có ít tế bào hồng cầu khỏe mạnh hơn bình thường, làm giảm hiệu quả vận chuyển oxy."
    },
    lifestyle: {
      en: [
        "<strong>Nutrient-Rich Foods:</strong> Include leafy greens, lentils, and beans in daily meals.",
        "<strong>Hydration & Rest:</strong> Ensure proper hydration and balance physical activity with rest."
      ],
      es: [
        "<strong>Comida rica en nutrientes:</strong> Incluya vegetales de hoja verde y lentejas.",
        "<strong>Hidratación y descanso:</strong> Manténgase hidratado y descanse adecuadamente."
      ],
      zh: [
        "<strong>丰富营养：</strong> 在日常饮食中加入深绿色蔬菜、豆类等。",
        "<strong>补水与休息：</strong> 保持充足的水分，合理安排休息。"
      ],
      am: [
        "<strong>በፖታሺየም የበለፀጉ ምግቦች፦</strong> አትክልቶችን እና ምስርን በምግብዎ ውስጥ ያካቱ።",
        "<strong>እረፍት እና ውሃ፦</strong> በቂ ውሃ ይጠጡ እና እረፍት ያድርጉ።"
      ],
      vi: [
        "<strong>Thực phẩm giàu dinh dưỡng:</strong> Bổ sung rau xanh và các loại đậu vào bữa ăn.",
        "<strong>Nghỉ ngơi và uống nước:</strong> Uống đủ nước và giữ thói quen nghỉ ngơi hợp lý."
      ]
    }
  }
];

let fuseInstance;

document.addEventListener('DOMContentLoaded', () => {
  initSearchEngine();
});

function initSearchEngine() {
  fuseInstance = new Fuse(medicalDatabase, {
    includeScore: true,
    threshold: 0.4,
    keys: ['keywords', 'id']
  });
}

function runSearch() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  if (!query) return;

  if (!fuseInstance) initSearchEngine();

  const results = fuseInstance.search(query);
  if (results.length > 0) {
    activeConditionId = results[0].item.id;
    renderCard();
  } else {
    alert("Condition not found. Try searching for 'Blood Pressure', 'Diabetes', or 'Asthma'.");
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
}

function renderCard() {
  const condition = medicalDatabase.find(item => item.id === activeConditionId);
  if (!condition) return;

  document.getElementById('res-badge').innerText = condition.category[currentLang] || condition.category.en;
  document.getElementById('res-title').innerText = condition.title[currentLang] || condition.title.en;
  document.getElementById('res-what-text').innerText = condition.whatIsIt[currentLang] || condition.whatIsIt.en;

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

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

// Medical Database (15 Conditions)
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
  },
  {
    id: 'gerd',
    keywords: ['gerd', 'acid reflux', 'heartburn', 'reflujo', '胃食管反流', 'የሆድ ቃጠሎ', 'trào ngược axit'],
    category: { en: 'Digestive Health', es: 'Salud Digestiva', zh: '消化系统健康', am: 'የምግብ መፈጨት ጤና', vi: 'Sức Khỏe Tiêu Hóa' },
    title: { en: 'Acid Reflux (GERD)', es: 'Reflujo Ácido (ERGE)', zh: '胃食管反流 (GERD)', am: 'የሆድ ቃጠሎ (GERD)', vi: 'Trào Ngược Axit' },
    whatIsIt: {
      en: "Acid reflux happens when stomach acid flows backward up into your food pipe. It creates a burning feeling in your chest known as heartburn.",
      es: "El reflujo ocurre cuando el ácido del estómago sube hacia el esófago. Esto causa una sensación de ardor en el pecho.",
      zh: "胃食管反流是指胃酸反向流入食道。这会在胸口产生灼烧感，即俗称的“心口灼热”。",
      am: "የሆድ ቃጠሎ የሚከሰተው የሆድ አሲድ ወደ ጉሮሮዎ ወደኋላ ሲመለስ ነው። ይህም በደረትዎ ውስጥ የመቃጠል ስሜት ይፈጥራል።",
      vi: "Trào ngược axit xảy ra khi axit dạ dày chảy ngược lên thực quản. Nó tạo ra cảm giác nóng rát ở ngực."
    },
    lifestyle: {
      en: [
        "<strong>Eat Smaller Meals:</strong> Avoid lying down immediately after eating.",
        "<strong>Limit Triggers:</strong> Reduce late-night snacks, spicy foods, and caffeine."
      ],
      es: [
        "<strong>Comidas pequeñas:</strong> Evite acostarse inmediatamente después de comer.",
        "<strong>Limite irritantes:</strong> Reduzca la comida picante, café y cenar tarde."
      ],
      zh: [
        "<strong>少食多餐：</strong> 进食后避免立即躺下。",
        "<strong>减少刺激食物：</strong> 减少深夜进食、辛辣食物和咖啡因。"
      ],
      am: [
        "<strong>ትንሽ መመገብ፦</strong> ከተመገቡ በኋላ ወዲያውኑ ከመተኛት ይቆጠቡ።",
        "<strong>የሚያቃጥሉ ምግቦችን መቀነስ፦</strong> ማታ ማታ መበላት እና ቡና መቀነስ።"
      ],
      vi: [
        "<strong>Chia nhỏ bữa ăn:</strong> Tránh nằm ngay sau khi ăn.",
        "<strong>Hạn chế đồ kích thích:</strong> Giảm ăn khuya, đồ cay và cà phê."
      ]
    }
  },
  {
    id: 'migraine',
    keywords: ['migraine', 'headache', 'dolor de cabeza', 'migraña', '偏头痛', 'የራስ ምታት', 'đau nửa đầu'],
    category: { en: 'Brain & Nervous System', es: 'Sistema Nervioso', zh: '神经系统', am: 'የነርቭ ሥርዓት', vi: 'Hệ Thần Kinh' },
    title: { en: 'Migraine', es: 'Migraña', zh: '偏头痛 (Migraine)', am: 'የራስ ምታት (Migraine)', vi: 'Đau Nửa Đầu' },
    whatIsIt: {
      en: "A migraine is an intense, throbbing headache that often targets one side of the head. It can make you sensitive to light and loud sounds.",
      es: "La migraña es un dolor de cabeza intenso que suele afectar un solo lado. Puede hacerlo sensible a la luz y al ruido.",
      zh: "偏头痛是一种剧烈的搏动性头痛，通常发作于头部一侧。它会让您对光线和声音变得非常敏感。",
      am: "የራስ ምታት (Migraine) በጭንቅላትዎ በአንድ በኩል የሚከሰት ከፍተኛ ህመም ነው። ለብርሃን እና ለድምጽ ተጎጂ ያደርጋል።",
      vi: "Đau nửa đầu là tình trạng đau đầu dữ dội, thường ở một bên đầu. Nó có thể khiến bạn nhạy cảm với ánh sáng và âm thanh."
    },
    lifestyle: {
      en: [
        "<strong>Rest in the Dark:</strong> Stay in a quiet, dark room when symptoms start.",
        "<strong>Consistent Sleep:</strong> Maintain regular sleep schedules and stay hydrated."
      ],
      es: [
        "<strong>Descanse en la oscuridad:</strong> Permanezca en una habitación oscura y silenciosa.",
        "<strong>Sueño regular:</strong> Mantenga horarios de sueño fijos y tome suficiente agua."
      ],
      zh: [
        "<strong>黑暗中休息：</strong> 症状开始时保持在安静、昏暗的房间里。",
        "<strong>规律作息：</strong> 保持规律的睡眠时间并多喝水。"
      ],
      am: [
        "<strong>ጨለማ ቦታ እረፍት ማድረግ፦</strong> ህመሙ ሲጀምር ጸጥ ባለ ጨለማ ክፍል ውስጥ ያረፉ።",
        "<strong>መደበኛ እንቅልፍ፦</strong> መደበኛ የእንቅልፍ ሰዓት ይኑርዎት እና በቂ ውሃ ይጠጡ።"
      ],
      vi: [
        "<strong>Nghỉ ngơi trong phòng tối:</strong> Ở trong phòng yên tĩnh, tối khi bắt đầu đau.",
        "<strong>Ngủ nghỉ đều đặn:</strong> Duy trì giờ giấc ngủ cố định và uống đủ nước."
      ]
    }
  },
  {
    id: 'uti',
    keywords: ['uti', 'urinary tract infection', 'infeccion urinaria', '尿路感染', 'የሽንት குழாய் ኢንፌክሽን', 'viêm đường tiết niệu'],
    category: { en: 'Kidney & Urinary', es: 'Sistema Urinario', zh: '泌尿系统', am: 'የሽንት አካላት', vi: 'Hệ Tiết Niệu' },
    title: { en: 'Urinary Tract Infection (UTI)', es: 'Infección del Tracto Urinario', zh: '尿路感染 (UTI)', am: 'የሽንት ቧንቧ ኢንፌክሽን', vi: 'Viêm Đường Tiết Niệu' },
    whatIsIt: {
      en: "A UTI occurs when everyday bacteria enter the urinary pathway. It causes a burning feeling during urination and a frequent urge to go.",
      es: "Una UTI ocurre cuando entran bacterias al sistema urinario. Causa ardor al orinar y la necesidad constante de ir al baño.",
      zh: "当细菌进入尿道时就会发生尿路感染。这会导致排尿时有灼烧感并频繁想上厕所。",
      am: "የሽንት ቧንቧ ኢንፌክሽን የሚከሰተው ባክቴሪያ ወደ ሽንት ቧንቧ ሲገባ ነው። በሚሸኑበት ጊዜ የመቃጠል ስሜት ያመጣል።",
      vi: "Viêm đường tiết niệu xảy ra khi vi khuẩn xâm nhập vào đường tiết niệu. Nó gây cảm giác nóng rát khi đi tiểu."
    },
    lifestyle: {
      en: [
        "<strong>Increase Fluids:</strong> Drink plenty of water throughout the day.",
        "<strong>Good Hygiene:</strong> Practice proper bathroom habits and avoid holding urine."
      ],
      es: [
        "<strong>Aumente líquidos:</strong> Tome abundante agua durante todo el día.",
        "<strong>Buena higiene:</strong> No aguante las ganas de orinar y mantenga buena higiene."
      ],
      zh: [
        "<strong>多喝水：</strong> 全天保持充足的饮水量。",
        "<strong>良好卫生：</strong> 养成良好的卫生习惯，切勿憋尿。"
      ],
      am: [
        "<strong>ውሃ ማበዛት፦</strong> ቀኑን ሙሉ ብዙ ውሃ ይጠጡ።",
        "<strong>ፅዳት መጠበቅ፦</strong> ሽንትዎን አለመያዝ እና ንፅህናን መጠበቅ።"
      ],
      vi: [
        "<strong>Uống nhiều nước:</strong> Uống đủ nước trong suốt cả ngày.",
        "<strong>Vệ sinh tốt:</strong> Giữ vệ sinh đúng cách và không nên nhịn tiểu."
      ]
    }
  },
  {
    id: 'arthritis',
    keywords: ['arthritis', 'joint pain', 'osteoarthritis', 'dolor articular', '关节炎', 'የአጥንት መገጣጠሚያ ህመም', 'viêm khớp'],
    category: { en: 'Bones & Joints', es: 'Huesos y Articulaciones', zh: '骨骼与关节', am: 'አጥንት እና መገጣጠሚያ', vi: 'Xương & Khớp' },
    title: { en: 'Joint Pain (Osteoarthritis)', es: 'Dolor Articular (Osteoartritis)', zh: '骨关节炎 (Osteoarthritis)', am: 'የመገጣጠሚያ ህመም', vi: 'Viêm Xương Khớp' },
    whatIsIt: {
      en: "Osteoarthritis occurs when protective cushioning between joints wears down over time. It can cause stiffness, swelling, and movement discomfort.",
      es: "La osteoartritis ocurre cuando el amortiguador entre las articulaciones se desgasta, causando rigidez y dolor.",
      zh: "骨关节炎是指保护关节的软骨随时间磨损。这会导致关节僵硬、肿胀和活动不便。",
      am: "የመገጣጠሚያ ህመም የሚከሰተው በመገጣጠሚያዎች መካከል ያለው መከላከያ በጊዜ ሂደት ሲያልቅ ነው። ይህም የመገጣጠሚያዎች ጥንካሬ ያመጣል።",
      vi: "Viêm xương khớp xảy ra khi lớp đệm bảo vệ giữa các khớp bị thoái hóa theo thời gian, gây cứng khớp và đau."
    },
    lifestyle: {
      en: [
        "<strong>Low-Impact Exercise:</strong> Swimming or walking helps protect joint flexibility.",
        "<strong>Gentle Stretching:</strong> Regular light stretches help reduce daily morning stiffness."
      ],
      es: [
        "<strong>Ejercicio de bajo impacto:</strong> Nadar o caminar protege las articulaciones.",
        "<strong>Estiramientos suaves:</strong> Estirar suavemente reduce la rigidez matutina."
      ],
      zh: [
        "<strong>低强度运动：</strong> 游泳或散步有助于保持关节灵活性。",
        "<strong>温和伸展：</strong> 定期做轻微拉伸有助于缓解晨起僵硬。"
      ],
      am: [
        "<strong>ቀለል ያለ እንቅስቃሴ፦</strong> ዋና መዋኘት ወይም መራመድ መገጣጠሚያዎችን ይረዳል።",
        "<strong>ቀለል ያለ ማሳሳት፦</strong> በየቀኑ አካልን ማሳሳት የጠዋት ጥንካሬን ይቀንሳል።"
      ],
      vi: [
        "<strong>Tập thể dục nhẹ nhàng:</strong> Bơi lội hoặc đi bộ giúp bảo vệ sự linh hoạt của khớp.",
        "<strong>Giãn cơ nhẹ:</strong> Giãn cơ đều đặn giúp giảm cứng khớp vào buổi sáng."
      ]
    }
  },
  {
    id: 'anxiety',
    keywords: ['anxiety', 'stress', 'ansiedad', 'estres', '焦虑', 'ጭንቀት', 'lo âu'],
    category: { en: 'Mental Health', es: 'Salud Mental', zh: '心理健康', am: 'የአእምሮ ጤና', vi: 'Sức Khỏe Tâm Thần' },
    title: { en: 'Generalized Anxiety', es: 'Ansiedad Generalizada', zh: '广泛性焦虑症', am: 'የጭንቀት ስሜት', vi: 'Rối Loạn Lo Âụ' },
    whatIsIt: {
      en: "Anxiety causes constant, overwhelming worry or feeling on edge. It can cause bodily symptoms like a rapid heartbeat and trouble relaxing.",
      es: "La ansiedad causa preocupación constante y tensión. Puede provocar palpitaciones y dificultad para relajarse.",
      zh: "焦虑会导致持续的过度的担忧或紧张感。它可能引发心跳加速和难以放松等身体症状。",
      am: "የጭንቀት ስሜት የማያቋርጥ ፍርሃት እና ውጥረት ያመጣል። የልብ ምት ፍጥነት እና የመረጋጋት ችግር ሊያስከትል ይችላል።",
      vi: "Lo âu gây ra cảm giác lo lắng hoặc căng thẳng liên tục. Nó có thể làm tim đập nhanh và khó thư giãn."
    },
    lifestyle: {
      en: [
        "<strong>Breathing Exercises:</strong> Practice deep, slow breathing techniques daily.",
        "<strong>Limit Stimulants:</strong> Reduce daily intake of coffee and energy drinks."
      ],
      es: [
        "<strong>Ejercicios respiratorios:</strong> Practique técnicas de respiración profunda.",
        "<strong>Limite estimulantes:</strong> Reduzca la ingesta de café y bebidas energéticas."
      ],
      zh: [
        "<strong>呼吸练习：</strong> 每天练习深呼吸和缓慢呼吸技巧。",
        "<strong>减少刺激物：</strong> 减少咖啡和功能饮料的摄入。"
      ],
      am: [
        "<strong>የአተነፋፈስ ልምምድ፦</strong> በየቀኑ ጥልቅ አተነፋፈስን ይለማመዱ።",
        "<strong>ቡና መቀነስ፦</strong> የቡና እና የኃይል መጠጦችን ይቀንሱ።"
      ],
      vi: [
        "<strong>Tập hít thở:</strong> Thực hành các bài tập hít thở sâu hàng ngày.",
        "<strong>Hạn chế chất kích thích:</strong> Giảm uống cà phê và nước tăng lực."
      ]
    }
  },
  {
    id: 'sleep_apnea',
    keywords: ['sleep apnea', 'snoring', 'apnea del sueño', 'ronquidos', '睡眠呼吸暂停', 'የእንቅልፍ ችግር', 'ngưng thở khi ngủ'],
    category: { en: 'Respiratory', es: 'Respiratorio', zh: '呼吸系统', am: 'የመተንፈሻ አካላት', vi: 'Hô Hấp' },
    title: { en: 'Sleep Apnea', es: 'Apnea del Sueño', zh: '睡眠呼吸暂停 (Sleep Apnea)', am: 'የእንቅልፍ አፕኒያ', vi: 'Ngưng Thở Khi Ngủ' },
    whatIsIt: {
      en: "Sleep apnea causes breathing to stop and start repeatedly while sleeping. It leads to loud snoring and feeling exhausted even after a full night's sleep.",
      es: "La apnea del sueño hace que la respiración se detenga intermitentemente al dormir, provocando ronquidos y fatiga constante.",
      zh: "睡眠呼吸暂停会导致睡眠时呼吸反复停止和开始。这会导致大声打鼾，即使睡满整晚也会感到疲惫。",
      am: "የእንቅልፍ አፕኒያ በእንቅልፍ ወቅት መተንፈስ እንዲቆም እና እንዲመለስ ያደርጋል። ይህም ከፍተኛ ማንኮራፋት ያመጣል።",
      vi: "Ngưng thở khi ngủ làm hơi thở bị gián đoạn lặp đi lặp lại trong khi ngủ, gây ngáy to và mệt mỏi vào ban ngày."
    },
    lifestyle: {
      en: [
        "<strong>Sleep Position:</strong> Try sleeping on your side instead of flat on your back.",
        "<strong>Evening Routine:</strong> Avoid alcohol and heavy meals shortly before bedtime."
      ],
      es: [
        "<strong>Posición al dormir:</strong> Intente dormir de lado en lugar de boca arriba.",
        "<strong>Rutina nocturna:</strong> Evite el alcohol y cenas pesadas antes de dormir."
      ],
      zh: [
        "<strong>睡姿调整：</strong> 尝试侧卧睡觉，而不是平躺。",
        "<strong>晚间习惯：</strong> 睡前避免饮酒和吃大餐。"
      ],
      am: [
        "<strong>የአተኛኘት ሁኔታ፦</strong> በጀርባ ከመተኛት ይልቅ በጎን ለመተኛት ይሞክሩ።",
        "<strong>ማታ ማታ፦</strong> ከመተኛትዎ በፊት አልኮል እና ከባድ ምግብ ከመመገብ ይቆጠቡ።"
      ],
      vi: [
        "<strong>Tư thế ngủ:</strong> Thử nằm nghiêng thay vì nằm ngửa.",
        "<strong>Thói quen buổi tối:</strong> Tránh uống rượu và ăn quá no trước khi ngủ."
      ]
    }
  },
  {
    id: 'thyroid',
    keywords: ['hypothyroidism', 'thyroid', 'tiroides', '甲状腺功能减退', 'ታይሮይድ', 'suy giáp'],
    category: { en: 'Hormones', es: 'Hormonas', zh: '内分泌与激素', am: 'ሆርሞን', vi: 'Nội Tiết' },
    title: { en: 'Underactive Thyroid (Hypothyroidism)', es: 'Hipotiroidismo', zh: '甲状腺功能减退 (Hypothyroidism)', am: 'የታይሮይድ እጥረት', vi: 'Suy Giáp' },
    whatIsIt: {
      en: "Hypothyroidism means the thyroid gland doesn't produce enough hormones. This slows down body processes, causing fatigue and feeling unusually cold.",
      es: "El hipotiroidismo ocurre cuando la tiroides no produce suficientes hormonas, ralentizando el cuerpo y causando fatiga.",
      zh: "甲减是指甲状腺无法产生足够的激素。这会减慢身体的新陈代谢，导致疲劳和异常怕冷。",
      am: "የታይሮይድ እጥረት የሚከሰተው የታይሮይድ ዕጢ በቂ ሆርሞን ሳያመነጭ ሲቀር ነው። ይህም ድካም ያመጣል።",
      vi: "Suy giáp xảy ra khi tuyến giáp không sản xuất đủ hormone, làm chậm các hoạt động của cơ thể và gây mệt mỏi."
    },
    lifestyle: {
      en: [
        "<strong>Balanced Nutrition:</strong> Eat nutrient-rich foods including vegetables and clean protein.",
        "<strong>Pacing Energy:</strong> Balance physical exercise with sufficient daily resting periods."
      ],
      es: [
        "<strong>Nutrición equilibrada:</strong> Consuma alimentos ricos en nutrientes y verduras.",
        "<strong>Cuidado de energía:</strong> Equilibre el ejercicio físico con suficiente descanso."
      ],
      zh: [
        "<strong>均衡营养：</strong> 食用富含营养的食物，包括蔬菜和优质蛋白质。",
        "<strong>合理作息：</strong> 在体育锻炼与充足的休息之间保持平衡。"
      ],
      am: [
        "<strong>የተመጣጠነ ምግብ፦</strong> በቪታሚን የበለፀጉ ምግቦችን እና አትክልቶችን ይመገቡ።",
        "<strong>እረፍት ማድረግ፦</strong> እንቅስቃሴን ከበቂ እረፍት ጋር ያመጣጥኑ።"
      ],
      vi: [
        "<strong>Dinh dưỡng cân bằng:</strong> Ăn thực phẩm giàu dinh dưỡng và rau xanh.",
        "<strong>Phân bổ năng lượng:</strong> Cân bằng giữa tập luyện và nghỉ ngơi đầy đủ."
      ]
    }
  },
  {
    id: 'pneumonia',
    keywords: ['pneumonia', 'lung infection', 'neumonia', '肺炎', 'የሳንባ ምች', 'viêm phổi'],
    category: { en: 'Respiratory', es: 'Respiratorio', zh: '呼吸系统', am: 'የመተንፈሻ አካላት', vi: 'Hô Hấp' },
    title: { en: 'Pneumonia', es: 'Neumonía', zh: '肺炎 (Pneumonia)', am: 'የሳንባ ምች', vi: 'Viêm Phổi' },
    whatIsIt: {
      en: "Pneumonia is an infection that causes air sacs in one or both lungs to swell. It leads to coughing, fever, and breathing trouble.",
      es: "La neumonía es una infección que inflama los sacos de aire de los pulmones, provocando tos, fiebre y dificultad para respirar.",
      zh: "肺炎是一种会导致单侧或双侧肺部气囊肿胀的感染。它会导致咳嗽、发烧和呼吸困难。",
      am: "የሳንባ ምች በሳንባ ውስጥ ያሉ አየር ከረጢቶች እንዲያብጡ የሚያደርግ ኢንፌክሽን ነው። ሳል፣ ትኩሳት እና የመተንፈስ ችግር ያመጣል።",
      vi: "Viêm phổi là nhiễm trùng làm phế nang ở một hoặc hai bên phổi bị sưng, dẫn đến ho, sốt và khó thở."
    },
    lifestyle: {
      en: [
        "<strong>Ample Rest:</strong> Allow your body significant time to rest and recover.",
        "<strong>Hydration Support:</strong> Drink warm water and fluids to help clear lung congestion."
      ],
      es: [
        "<strong>Descanso abundante:</strong> Permita que su cuerpo tenga tiempo para recuperarse.",
        "<strong>Hidratación constante:</strong> Tome agua tibia y líquidos para aliviar la congestión."
      ],
      zh: [
        "<strong>充分休息：</strong> 给身体足够的时间休息和恢复。",
        "<strong>多喝温水：</strong> 喝温水和液体有助于缓解肺部充血。"
      ],
      am: [
        "<strong>በቂ እረፍት፦</strong> ሰውነትዎ እንዲያገግም በቂ እረፍት ይስጡ።",
        "<strong>ሞቅ ያለ ውሃ መጠጣት፦</strong> ሞቅ ያለ ውሃ እና ፈሳሾችን ይጠጡ።"
      ],
      vi: [
        "<strong>Nghỉ ngơi nhiều:</strong> Cho cơ thể thời gian nghỉ ngơi để hồi phục.",
        "<strong>Bổ sung nước:</strong> Uống nước ấm để giúp làm loãng đờm."
      ]
    }
  },
  {
    id: 'gout',
    keywords: ['gout', 'uric acid', 'gota', '痛风', 'ጋውት (የመገጣጠሚያ ህመም)', 'bệnh gút'],
    category: { en: 'Bones & Joints', es: 'Huesos y Articulaciones', zh: '骨骼与关节', am: 'አጥንት እና መገጣጠሚያ', vi: 'Xương & Khớp' },
    title: { en: 'Gout', es: 'Gota', zh: '痛风 (Gout)', am: 'ጋውት (Gout)', vi: 'Bệnh Gút' },
    whatIsIt: {
      en: "Gout is a type of joint pain caused by uric acid buildup. It causes sudden, sharp pain, often in the big toe or ankle.",
      es: "La gota es un dolor articular causado por acumulación de ácido úrico. Provoca dolor agudo repentino en el dedo del pie o tobillo.",
      zh: "痛风是由尿酸堆积引起的一种关节炎。它会导致突然的剧烈疼痛，通常发生在大脚趾或脚踝处。",
      am: "ጋውት በዩሪክ አሲድ መከማቸት የሚከሰት የመገጣጠሚያ ህመም ነው። በእግር እጣቢ ወይም ቁርጭምጭሚት ላይ ህመም ያመጣል።",
      vi: "Gút là một dạng viêm khớp do tích tụ axit uric, gây đau đột ngột và dữ dội, thường ở ngón chân cái."
    },
    lifestyle: {
      en: [
        "<strong>Hydrate Daily:</strong> Drink plenty of water to help flush out excess uric acid.",
        "<strong>Diet Adjustments:</strong> Limit red meats, seafood, and alcoholic beverages."
      ],
      es: [
        "<strong>Hidrátese a diario:</strong> Tome abundante agua para eliminar el ácido úrico.",
        "<strong>Ajustes de dieta:</strong> Limite las carnes rojas, mariscos y el alcohol."
      ],
      zh: [
        "<strong>每天补水：</strong> 大量喝水有助于排出多余的尿酸。",
        "<strong>饮食调整：</strong> 限制红肉、海鲜和酒精饮料。"
      ],
      am: [
        "<strong>ውሃ መጠጣት፦</strong> ዩሪክ አሲድን ለማስወገድ ብዙ ውሃ ይጠጡ።",
        "<strong>የምግብ ለውጥ፦</strong> የቀይ ስጋ፣ የባህር ምግቦች እና አልኮል መቀነስ።"
      ],
      vi: [
        "<strong>Uống đủ nước:</strong> Uống nhiều nước giúp đào thải axit uric dư thừa.",
        "<strong>Điều chỉnh chế độ ăn:</strong> Hạn chế thịt đỏ, hải sản và đồ uống có cồn."
      ]
    }
  },
  {
    id: 'kidney_stones',
    keywords: ['kidney stones', 'calculos renales', 'renales', '肾结石', 'የኩላሊት ድንጋይ', 'sỏi thận'],
    category: { en: 'Kidney & Urinary', es: 'Sistema Urinario', zh: '泌尿系统', am: 'የሽንት አካላት', vi: 'Hệ Tiết Niệu' },
    title: { en: 'Kidney Stones', es: 'Cálculos Renales', zh: '肾结石 (Kidney Stones)', am: 'የኩላሊት ድንጋይ', vi: 'Sỏi Thận' },
    whatIsIt: {
      en: "Kidney stones are hard mineral deposits that form inside the kidneys. Passing them can cause sharp pain in the back or side.",
      es: "Los cálculos renales son depósitos minerales que se forman en los riñones. Eliminarlos provoca dolor en la espalda o el costado.",
      zh: "肾结石是形成于肾脏内部的坚硬矿物质沉淀物。结石移动或排出时可能引起背部或侧腹剧痛。",
      am: "የኩላሊት ድንጋይ በኩላሊት ውስጥ የሚፈጠር የካ mineral ን ድንጋይ ነው። ድንጋዩ ሲንቀሳቀስ በጀርባ ወይም በጎን በኩል ህመም ያመጣል።",
      vi: "Sỏi thận là các khoáng chất tích tụ thành khối cứng bên trong thận. Sỏi di chuyển có thể gây đau nhói ở lưng hoặc hông."
    },
    lifestyle: {
      en: [
        "<strong>High Fluid Intake:</strong> Drink water regularly to reduce mineral concentration in urine.",
        "<strong>Sodium Reduction:</strong> Cut down on high-salt prepared foods."
      ],
      es: [
        "<strong>Consumo de líquidos:</strong> Tome agua para reducir la concentración de minerales.",
        "<strong>Menos sodio:</strong> Reduzca la sal y alimentos procesados."
      ],
      zh: [
        "<strong>大量喝水：</strong> 定期喝水以降低尿液中的矿物质浓度。",
        "<strong>减少高钠：</strong> 减少高盐预制食品的摄入。"
      ],
      am: [
        "<strong>ብዙ ውሃ መጠጣት፦</strong> በሽንት ውስጥ የካ ማዕድን መጠን ለማነስ ውሃ ይጠጡ።",
        "<strong>ጨው መቀነስ፦</strong> የታሸጉ ጨዋማ ምግቦችን ይቀንሱ።"
      ],
      vi: [
        "<strong>Uống nhiều nước:</strong> Uống nước đều đặn để làm loãng khoáng chất trong nước tiểu.",
        "<strong>Giảm muối:</strong> Hạn chế ăn thức ăn chế biến sẵn chứa nhiều muối."
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
  const card = document.getElementById('results-card');
  if (!query) return;

  if (!fuseInstance) initSearchEngine();

  const results = fuseInstance.search(query);
  if (results.length > 0) {
    activeConditionId = results[0].item.id;
    renderCard();
  } else {
    card.style.display = 'block';
    document.getElementById('res-badge').innerText = 'Notice';
    document.getElementById('res-title').innerText = 'Condition Not Found';
    document.getElementById('res-what-text').innerText = `We couldn't find anything for "${query}". Try selecting one of the popular topics above or searching for terms like "Diabetes" or "Asthma".`;
    document.getElementById('res-action-grid').innerHTML = '';
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

let currentLang = 'en';
let activeConditionId = '';

const medicalDatabase = [
  {
    id: 'blood_pressure',
    keywords: ['high blood pressure', 'hypertension', 'blood pressure', 'bp'],
    category: { en: 'Heart & Blood' },
    title: { en: 'High Blood Pressure (Hypertension)' },
    emergency: { en: 'Seek emergency care if you experience severe chest pain, sudden vision changes, severe headache, or trouble breathing.' },
    whatIsIt: { en: 'Heart works too hard pumping blood, putting extra pressure on your blood vessels.' },
    lifestyle: { en: ['<strong>Cut Back on Salt:</strong> Helps lower blood volume and pressure.', '<strong>Daily Walks:</strong> Keeps heart muscles strong and relaxed.'] }
  },
  {
    id: 'anemia',
    keywords: ['anemia', 'iron', 'weakness', 'low iron'],
    category: { en: 'Heart & Blood' },
    title: { en: 'Anemia (Low Iron)' },
    emergency: { en: 'Seek emergency care if you faint or experience severe shortness of breath.' },
    whatIsIt: { en: 'Low iron in the blood making you feel constantly weak, tired, and cold.' },
    lifestyle: { en: ['<strong>Eat Iron-Rich Foods:</strong> Spinach, beans, and red meat.', '<strong>Add Vitamin C:</strong> Helps your body absorb iron.'] }
  },
  {
    id: 'gout',
    keywords: ['gout', 'uric acid', 'toe pain'],
    category: { en: 'Joints & Bones' },
    title: { en: 'Gout' },
    emergency: { en: 'Seek medical care if a joint is extremely painful, hot, and swollen, especially with a fever.' },
    whatIsIt: { en: 'A type of arthritis caused by a buildup of uric acid crystals in the joints, often starting in the big toe.' },
    lifestyle: { en: ['<strong>Stay Hydrated:</strong> Drink plenty of water to help flush out uric acid.', '<strong>Limit Purine-Rich Foods:</strong> Reduce red meat, shellfish, and alcohol.'] }
  },
  {
    id: 'diabetes',
    keywords: ['diabetes', 'sugar', 'high sugar', 'type 2'],
    category: { en: 'Kidney & Sugar' },
    title: { en: 'Diabetes (Type 2)' },
    emergency: { en: 'Seek immediate care for extreme confusion, fruity-smelling breath, or fainting.' },
    whatIsIt: { en: 'The body cannot process sugar properly, leading to elevated blood sugar levels.' },
    lifestyle: { en: ['<strong>Cut Sugary Drinks:</strong> Switch from soda to plain water.', '<strong>Walk After Meals:</strong> Helps muscles use up blood sugar.'] }
  },
  {
    id: 'asthma',
    keywords: ['asthma', 'wheezing', 'breathing', 'shortness of breath'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'Asthma' },
    emergency: { en: 'Seek emergency care immediately if your rescue inhaler does not work or if you cannot finish a sentence due to breathlessness.' },
    whatIsIt: { en: 'Airways narrow and swell, producing extra mucus which makes breathing difficult.' },
    lifestyle: { en: ['<strong>Identify Triggers:</strong> Avoid dust, smoke, and pollen.', '<strong>Keep Inhaler Close:</strong> Always carry your prescribed rescue inhaler.'] }
  },
  {
    id: 'migraine',
    keywords: ['migraine', 'headache', 'head pain', 'throbbing head'],
    category: { en: 'Brain & Mental' },
    title: { en: 'Migraine' },
    emergency: { en: 'Seek emergency care for the "worst headache of your life," sudden numbness, or difficulty speaking.' },
    whatIsIt: { en: 'A neurological condition causing severe throbbing pain, usually on one side of the head, often accompanied by sensitivity to light and sound.' },
    lifestyle: { en: ['<strong>Rest in a Dark Room:</strong> Minimize light and sound stimuli during an attack.', '<strong>Stay Consistent:</strong> Maintain regular sleep and meal schedules.'] }
  },
  {
    id: 'reflux',
    keywords: ['acid reflux', 'heartburn', 'gerd', 'stomach acid'],
    category: { en: 'Stomach & Digestion' },
    title: { en: 'Acid Reflux (Heartburn)' },
    emergency: { en: 'Seek emergency care if chest pain radiates to your arm or jaw, as this could signal a heart attack rather than heartburn.' },
    whatIsIt: { en: 'Stomach acid flows back up into the tube connecting your mouth and stomach, causing a burning sensation in the chest.' },
    lifestyle: { en: ['<strong>Avoid Trigger Foods:</strong> Limit spicy, fatty foods, caffeine, and citrus.', '<strong>Stay Upright:</strong> Avoid lying down for 2 to 3 hours after eating.'] }
  },
  {
    id: 'cold_flu',
    keywords: ['flu', 'cold', 'common cold', 'cough', 'fever', 'runny nose'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'Common Cold & Flu' },
    emergency: { en: 'Seek medical care if you experience persistent high fever, chest pain, or severe difficulty breathing.' },
    whatIsIt: { en: 'Viral infections affecting the upper respiratory tract, causing congestion, fatigue, and coughing.' },
    lifestyle: { en: ['<strong>Rest and Recover:</strong> Give your immune system energy to fight the virus.', '<strong>Drink Warm Fluids:</strong> Tea, broth, and water help soothe a sore throat.'] }
  },
  {
    id: 'arthritis',
    keywords: ['arthritis', 'joint pain', 'stiff joints', 'knee pain'],
    category: { en: 'Joints & Bones' },
    title: { en: 'Osteoarthritis' },
    emergency: { en: 'Seek medical evaluation if joint pain is accompanied by sudden severe swelling, redness, or inability to move the joint.' },
    whatIsIt: { en: 'The protective cartilage cushioning the ends of your bones wears down over time, causing joint stiffness and pain.' },
    lifestyle: { en: ['<strong>Low-Impact Exercise:</strong> Swimming or walking helps keep joints flexible.', '<strong>Maintain a Healthy Weight:</strong> Reduces stress on weight-bearing joints like knees and hips.'] }
  },
  {
    id: 'allergies',
    keywords: ['allergies', 'seasonal allergies', 'hay fever', 'sneezing'],
    category: { en: 'Lungs & Breathing' },
    title: { en: 'Seasonal Allergies (Hay Fever)' },
    emergency: { en: 'Seek emergency care immediately if you experience throat swelling or difficulty breathing (signs of anaphylaxis).' },
    whatIsIt: { en: 'An immune system reaction to outdoor allergens like pollen, grass, or mold, causing sneezing and watery eyes.' },
    lifestyle: { en: ['<strong>Keep Windows Closed:</strong> Use air conditioning during high pollen seasons.', '<strong>Shower Before Bed:</strong> Washes away pollen collected on your skin and hair.'] }
  }
];

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

function runSearch() {
  const queryInput = document.getElementById('search-input');
  const card = document.getElementById('results-card');
  
  if (!queryInput || !card) return;
  
  const query = queryInput.value.toLowerCase().trim();
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
    document.getElementById('res-badge').innerText = '✨ ClearHealth';
    document.getElementById('res-title').innerText = 'Condition Not Found';
    document.getElementById('res-what-label').style.display = 'none';
    document.getElementById('res-lifestyle-label').style.display = 'none';
    document.getElementById('res-what-text').innerText = `We couldn't find "${query}". Try searching for terms like Diabetes, Anemia, Gout, Asthma, or Migraine.`;
    document.getElementById('res-action-grid').innerHTML = '';
    document.getElementById('emergency-box').style.display = 'none';
  }
}

function renderCard() {
  const condition = medicalDatabase.find(item => item.id === activeConditionId);
  if (!condition) return;

  document.getElementById('res-what-label').style.display = 'block';
  document.getElementById('res-lifestyle-label').style.display = 'block';

  document.getElementById('res-badge').innerText = condition.category.en;
  document.getElementById('res-title').innerText = condition.title.en;
  document.getElementById('res-what-text').innerText = condition.whatIsIt.en;

  const emergencyBox = document.getElementById('emergency-box');
  const emergencyText = document.getElementById('res-emergency-text');
  if (condition.emergency && emergencyBox && emergencyText) {
    emergencyText.innerText = condition.emergency.en;
    emergencyBox.style.display = 'flex';
  } else if (emergencyBox) {
    emergencyBox.style.display = 'none';
  }

  const actionGrid = document.getElementById('res-action-grid');
  if (actionGrid) {
    actionGrid.innerHTML = '';
    condition.lifestyle.en.forEach(text => {
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
  btnElement.classList.add('active');

  const card = document.getElementById('results-card');
  if (categoryName === 'all') {
    card.style.display = 'none';
    return;
  }

  const found = medicalDatabase.find(item => item.category.en.toLowerCase().includes(categoryName.toLowerCase()));
  if (found) {
    activeConditionId = found.id;
    renderCard();
  }
}

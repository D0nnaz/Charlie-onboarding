// Onboarding stappen
const steps = [
  'step-video',
  'step-welcome',
  'step-tone',
  'step-usage',
  'step-experience',
  'step-knowledge',
  'step-help',
  'step-done'
];
let currentStep = 0;

function updateProgressBar(idx) {
  // 8 stappen totaal, idx 0-7
  const percent = Math.round((idx) / (steps.length - 1) * 100);
  // Progress bar id per stap
  const barIds = [
    null,
    'progress-welcome',
    'progress-tone',
    'progress-usage',
    'progress-experience',
    'progress-knowledge',
    'progress-help',
    'progress-done'
  ];
  barIds.forEach((id, i) => {
    if (!id) return;
    const bar = document.getElementById(id);
    if (bar) bar.style.width = (i === idx ? percent : 0) + '%';
  });
}

function showStep(idx) {
  steps.forEach((id, i) => {
    document.getElementById(id).classList.toggle('hidden', i !== idx);
  });
  currentStep = idx;
  updateProgressBar(idx);
}

// Stap 1: Video
const video = document.getElementById('onboarding-video');
if (video) {
  video.muted = false;
  video.volume = 1.0;
  video.play().catch(() => {
    const tryPlay = () => {
      video.play();
      window.removeEventListener('click', tryPlay);
    };
    window.addEventListener('click', tryPlay);
  });
  video.onended = () => showStep(1);
}

// Stap 2: Welkom
const btnLater = document.getElementById('btn-later');
const btnPersonaliseer = document.getElementById('btn-personaliseer');
if (btnLater) btnLater.onclick = () => showStep(7); // direct naar klaar
if (btnPersonaliseer) btnPersonaliseer.onclick = () => showStep(2);

// Stap 3: Tone of voice (single select)
const toneOptions = [
  { key: 'vriendelijk', label: 'Vriendelijk', voorbeeld: 'Hé daar! Ik merkte dat je misschien deze data wilt anonimiseren. Wil je wat tips?' },
  { key: 'direct', label: 'Direct', voorbeeld: 'Deze data moet geanonimiseerd worden. Wil je hulp?' },
  { key: 'formeel', label: 'Formeel', voorbeeld: 'Ik wil graag onder uw aandacht brengen dat deze data mogelijk anonimisering vereist. Wilt u begeleiding bij deze kwestie?' },
  { key: 'sarcastisch', label: 'Sarcastisch', voorbeeld: 'Oh kijk, weer een privacy-zorg! Misschien moeten we, ik weet het niet, deze data anonimiseren? Gewoon maar een idee hoor.' }
];
const toneContainer = document.querySelector('.tone-options');
let selectedTone = null;
if (toneContainer) {
  toneOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'tone-block';
    div.innerHTML = `<strong>${opt.label}</strong><span>${opt.voorbeeld}</span>`;
    div.onclick = () => {
      toneContainer.querySelectorAll('.tone-block').forEach(b => b.classList.remove('selected'));
      div.classList.add('selected');
      selectedTone = opt.key;
    };
    toneContainer.appendChild(div);
  });
}
document.getElementById('btn-tone-next').onclick = () => {
  if (selectedTone) showStep(3);
};

// Stap 4: Gebruik van AI (multi select)
const usageOptions = [
  'Samenvattingen maken',
  'E-mails schrijven',
  'Onderzoek doen',
  'Brainstormen',
  'Code genereren',
  'Anders',
  'Selecteer allemaal'
];
const usageContainer = document.querySelector('.usage-options');
let selectedUsage = [];
let usageOtherInput = null;
if (usageContainer) {
  usageOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'usage-option help-option'; // multi-select style
    div.textContent = opt;
    if (opt === 'Anders') {
      // Voeg input toe voor 'Anders'
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Vul je eigen antwoord in...';
      input.className = 'usage-other-input hidden';
      usageOtherInput = input;
      div.appendChild(input);
    }
    div.onclick = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (opt === 'Selecteer allemaal') {
        selectedUsage = usageOptions.filter(o => o !== 'Selecteer allemaal');
        usageContainer.querySelectorAll('.usage-option').forEach((el, i) => {
          if (usageOptions[i] !== 'Selecteer allemaal') el.classList.add('selected');
        });
        if (usageOtherInput) usageOtherInput.classList.remove('hidden');
        
        selectedUsage = selectedUsage.filter(o => o !== 'Anders');
        const andersDiv = Array.from(usageContainer.children).find(child => child.textContent === 'Anders');
        if (andersDiv) andersDiv.classList.remove('selected');
      } else {
        div.classList.toggle('selected');
        if (div.classList.contains('selected')) {
          selectedUsage.push(opt);
        } else {
          selectedUsage = selectedUsage.filter(o => o !== opt);
        }
        if (opt === 'Anders' && usageOtherInput) {
          usageOtherInput.classList.toggle('hidden', !div.classList.contains('selected'));
          if (div.classList.contains('selected')) usageOtherInput.focus();
        }
      }
    };
    usageContainer.appendChild(div);
  });
}
document.getElementById('btn-usage-next').onclick = () => {
  let valid = selectedUsage.length > 0;
  if (selectedUsage.includes('Anders') && usageOtherInput) {
    valid = valid && usageOtherInput.value.trim().length > 0;
  }
  
  // Reset de selectie als de validatie niet slaagt
  if (!valid) {
    selectedUsage = []; // Reset de selectie
    usageContainer.querySelectorAll('.usage-option').forEach(el => {
      el.classList.remove('selected'); // Verwijder de geselecteerde klasse
    });
    if (usageOtherInput) {
      usageOtherInput.classList.add('hidden'); // Verberg de input voor 'Anders'
    }
  } else {
    showStep(4); // Ga naar de volgende stap als de validatie slaagt
  }
};

// Stap 5: Ervaring met AI (single select)
const experienceOptions = [
  'Is het iets met robots?',
  'Ik doe maar wat en hoop dat het goed gaat',
  'AI en ik werken helemaal samen',
  'Promptje hier, outputje daar',
  'Ik geef wel eens trainingen',
  'Anders'
];
const experienceContainer = document.querySelector('.experience-options');
let selectedExperience = null;
let experienceOtherInput = null;
if (experienceContainer) {
  experienceOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'experience-option';
    div.textContent = opt;
    if (opt === 'Anders') {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Vul je eigen antwoord in...';
      input.className = 'experience-other-input hidden';
      experienceOtherInput = input;
      div.appendChild(input);
    }
    div.onclick = (e) => {
      if (e.target.tagName === 'INPUT') return;
      experienceContainer.querySelectorAll('.experience-option').forEach(b => {
        b.classList.remove('selected');
        if (b.querySelector('input')) b.querySelector('input').classList.add('hidden');
      });
      div.classList.add('selected');
      selectedExperience = opt;
      if (opt === 'Anders' && experienceOtherInput) {
        experienceOtherInput.classList.remove('hidden');
        experienceOtherInput.focus();
      }
    };
    experienceContainer.appendChild(div);
  });
}
document.getElementById('btn-experience-next').onclick = () => {
  let valid = !!selectedExperience;
  if (selectedExperience === 'Anders' && experienceOtherInput) {
    valid = experienceOtherInput.value.trim().length > 0;
  }
  if (valid) showStep(5);
};

// Stap 6: Kennis van AI-regels (single select)
const knowledgeOptions = [
  'Geen idee, wat zijn de regels eigenlijk?',
  'Ik weet niet precies wat de regels zijn, maar ik hoop dat je er iets mee mag',
  'Ik heb me wel een beetje verdiept in bijvoorbeeld de AI-act',
  'Ik ben het morele kompas van mijn team'
];
const knowledgeContainer = document.querySelector('.knowledge-options');
let selectedKnowledge = null;
if (knowledgeContainer) {
  knowledgeOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'knowledge-option';
    div.textContent = opt;
    div.onclick = () => {
      knowledgeContainer.querySelectorAll('.knowledge-option').forEach(b => b.classList.remove('selected'));
      div.classList.add('selected');
      selectedKnowledge = opt;
    };
    knowledgeContainer.appendChild(div);
  });
}
document.getElementById('btn-knowledge-next').onclick = () => {
  if (selectedKnowledge) showStep(6);
};

// Stap 7: Hoe kan ik jou het beste helpen? (multi select)
const helpOptions = [
  'Tips voor veilig gebruik',
  'Voorbeelden van prompts',
  'Uitleg over AI-regels',
  'Reflectievragen',
  'Selecteer allemaal'
];
const helpContainer = document.querySelector('.help-options');
let selectedHelp = [];
if (helpContainer) {
  helpOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'help-option';
    div.textContent = opt;
    div.onclick = () => {
      if (opt === 'Selecteer allemaal') {
        selectedHelp = helpOptions.filter(o => o !== 'Selecteer allemaal');
        helpContainer.querySelectorAll('.help-option').forEach((el, i) => {
          if (helpOptions[i] !== 'Selecteer allemaal') el.classList.add('selected');
        });
      } else {
        div.classList.toggle('selected');
        if (div.classList.contains('selected')) selectedHelp.push(opt);
        else selectedHelp = selectedHelp.filter(o => o !== opt);
      }
    };
    helpContainer.appendChild(div);
  });
}
document.getElementById('btn-help-next').onclick = () => {
  if (selectedHelp.length > 0) showStep(7);
};

// Init: start bij stap 0
showStep(0); 

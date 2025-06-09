// Onboarding stappen
const steps = [
  'step-video',
  'step-name',
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
  const percent = Math.round((idx) / (steps.length - 1) * 100);
  const progressBarInner = document.getElementById('progress-step');
  if (progressBarInner) {
    progressBarInner.style.width = percent + '%';
  }
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
    const el = document.getElementById(id);
    const wasVisible = !el.classList.contains('hidden');
    el.classList.toggle('hidden', i !== idx);

    if (id === 'step-video' && wasVisible && i !== idx) {
      video.pause();
      video.currentTime = 0;
      playBtn.style.opacity = '1';
      hasStarted = false;
    }
    if (idx === 2) {
  const name = localStorage.getItem('charlieUserName') || '';
  const nameDisplay = document.getElementById('user-name-display');
  if (nameDisplay) nameDisplay.textContent = name;
}
  });

  currentStep = idx;
  updateProgressBar(idx);
}

document.querySelectorAll('.btn-prev').forEach(btn => {
  btn.addEventListener('click', () => {
    if (currentStep > 1) {
      showStep(currentStep - 1);
    }
  });
});

// Stap 1: Video
const video = document.getElementById('onboarding-video');
const playBtn = document.getElementById('video-play-btn');

let hasStarted = false;

function toggleVideoPlayback() {
  if (!hasStarted) {
    video.muted = false;
    video.volume = 1.0;
    hasStarted = true;
  }

  if (video.paused) {
    video.play();
    playBtn.style.opacity = '0';
  } else {
    video.pause();
    playBtn.style.opacity = '1';
  }
}

video.addEventListener('click', toggleVideoPlayback);
playBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleVideoPlayback();
});


if (video) {
  video.muted = false;
  video.volume = 1.0;
  if (currentStep === 0) {
    video.play().catch(() => {
      const tryPlay = () => {
        if (currentStep === 0) {
          video.play();
          window.removeEventListener('click', tryPlay);
        }
      };
      window.addEventListener('click', tryPlay);
    });
  }
  video.onended = () => {
    const videoStep = document.getElementById('step-video');
    if (!videoStep.classList.contains('hidden')) {
      showStep(1);
    }
  };
}

// Stap 1b: Naam invoeren
const nameInput = document.getElementById('user-name');
const btnNameNext = document.getElementById('btn-name-next');
if (btnNameNext) {
  btnNameNext.onclick = () => {
    const name = nameInput.value.trim();
    if (name.length === 0) {
      alert('Vul alsjeblieft je naam in.');
      return;
    }
    localStorage.setItem('charlieUserName', name);
    showStep(2);
  };
}

// Stap 2: Welkom
const btnLater = document.getElementById('btn-later');
const btnPersonaliseer = document.getElementById('btn-personaliseer');
if (btnLater) btnLater.onclick = () => showStep(7); // direct naar klaar
if (btnPersonaliseer) btnPersonaliseer.onclick = () => showStep(3);

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
  if (selectedTone) showStep(4);
};

// Stap 4: Gebruik van AI (multi select)
const usageOptions = [
  'Copywriting',
  'Beeldgeneratie',
  'Samenvatten van tekst / meetings',
  'Idee generatie & brainstormen',
  'Data-analyse & automatisering',
  'Development',
  'Anders',
  'Selecteer allemaal'
];
const usageContainer = document.querySelector('.usage-options');
let selectedUsage = [];
let usageOtherInput = null;

if (usageContainer) {
  usageOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'usage-option help-option';
    div.textContent = opt;

    if (opt === 'Anders') {
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
        const isSelected = div.classList.contains('selected');
        const andersWasGeselecteerd = selectedUsage.includes('Anders');

        if (!isSelected) {
          selectedUsage = usageOptions.filter(o =>
            o !== 'Selecteer allemaal' && o !== 'Anders'
          );

          if (andersWasGeselecteerd) selectedUsage.push('Anders');

          usageContainer.querySelectorAll('.usage-option').forEach((el, i) => {
            const label = usageOptions[i];
            if (label !== 'Selecteer allemaal' &&
               (label !== 'Anders' || andersWasGeselecteerd)) {
              el.classList.add('selected');
            }
          });

          div.classList.add('selected');
          div.textContent = 'Deselecteer alles';

          if (selectedUsage.includes('Anders') && usageOtherInput) {
            usageOtherInput.classList.remove('hidden');
          }

        } else {
          selectedUsage = [];
          usageContainer.querySelectorAll('.usage-option').forEach(el => {
            el.classList.remove('selected');
          });
          div.classList.remove('selected');
          div.textContent = 'Selecteer allemaal';
          if (usageOtherInput) {
            usageOtherInput.classList.add('hidden');
          }
        }

      } else {
        div.classList.toggle('selected');
        if (div.classList.contains('selected')) {
          selectedUsage.push(opt);
        } else {
          selectedUsage = selectedUsage.filter(o => o !== opt);
        }

        const selectAllDiv = Array.from(usageContainer.children).find(child =>
          child.textContent.includes('Deselecteer')
        );
        if (selectAllDiv) {
          selectAllDiv.classList.remove('selected');
          selectAllDiv.textContent = 'Selecteer allemaal';
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

  if (!valid) {
    alert("Zorg ervoor dat je een geldige invoer hebt voor 'Anders' of selecteer een optie.");
    usageContainer.querySelectorAll('.usage-option').forEach(el => {
      el.classList.remove('selected');
    });
    if (usageOtherInput) {
      usageOtherInput.classList.toggle('hidden', !selectedUsage.includes('Anders'));
    }
  } else {
    showStep(5);
  }
};


// Stap 5: Ervaring met AI (single select)
const experienceOptions = [
  'Wat is AI eigenlijk? Is dat iets met robots?',
  'Ik doe maar wat en hoop dat het goed gaat',
  'AI en ik werken helemaal samen. Promptje hier, outputje daar',
  'Ik geef zelfs trainingen aan anderen. AI en ik? We’re tight!'
];
const experienceContainer = document.querySelector('.experience-options');
let selectedExperience = null;

if (experienceContainer) {
  experienceOptions.forEach(opt => {
    const div = document.createElement('div');
    div.className = 'experience-option';
    div.textContent = opt;

    div.onclick = () => {
      experienceContainer.querySelectorAll('.experience-option').forEach(b => {
        b.classList.remove('selected');
      });
      div.classList.add('selected');
      selectedExperience = opt;
    };

    experienceContainer.appendChild(div);
  });
}

document.getElementById('btn-experience-next').onclick = () => {
  if (selectedExperience) showStep(6);
};


// Stap 6: Kennis van AI-regels (single select)
const knowledgeOptions = [
  'Geen idee. Wat zijn de richtlijnen eigenlijk?',
  'Ik weet niet precies wat de regels zijn, maar ik probeer zo ethisch mogelijk te handelen',
  'Ik heb me wel een beetje verdiept in bijvoorbeeld de AI-act, maar ik weet zeker nog niet alles',
  'Ik ben het morele kompas van mijn team.'
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
  if (selectedKnowledge) showStep(7);
};

// Stap 7: Hoe kan ik jou het beste helpen? (multi select)
const helpOptions = [
  'Tips voor veilig gebruik',
  'Voorbeelden van goede rompts',
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
        const isSelected = div.classList.contains('selected');

        if (!isSelected) {
          selectedHelp = helpOptions.filter(o => o !== 'Selecteer allemaal');

          helpContainer.querySelectorAll('.help-option').forEach((el, i) => {
            if (helpOptions[i] !== 'Selecteer allemaal') {
              el.classList.add('selected');
            }
          });

          div.classList.add('selected');
          div.textContent = 'Deselecteer alles';
        } else {
          selectedHelp = [];
          helpContainer.querySelectorAll('.help-option').forEach(el => {
            el.classList.remove('selected');
          });
          div.classList.remove('selected');
          div.textContent = 'Selecteer allemaal';
        }

      } else {
        div.classList.toggle('selected');

        if (div.classList.contains('selected')) {
          if (!selectedHelp.includes(opt)) selectedHelp.push(opt);
        } else {
          selectedHelp = selectedHelp.filter(o => o !== opt);
        }

        const selectAllDiv = Array.from(helpContainer.children).find(child =>
          child.textContent.includes('Deselecteer')
        );
        if (selectAllDiv) {
          selectAllDiv.classList.remove('selected');
          selectAllDiv.textContent = 'Selecteer allemaal';
        }
      }
    };

    helpContainer.appendChild(div);
  });
}

document.getElementById('btn-help-next').onclick = () => {
  if (selectedHelp.length > 0) showStep(8);
};


// Init: start bij stap 0
showStep(0); 

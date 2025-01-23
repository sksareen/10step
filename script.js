// Game state
let currentStep = 0;
let understanding = 0;
let completionCount = localStorage.getItem('completionCount') || 0;

// Add sleep mode state
let isSleepMode = localStorage.getItem('sleepMode') === 'true';

// Journey paths
const journeyPaths = {
    freedom: [
        {
            title: "The Gateway",
            challenge: "You stand before a gateway. A voice says: 'Set your date of freedom.'",
            imagePrompt: "A mystical stone gateway in a misty forest, glowing with ethereal light, symbolizing the threshold of transformation",
            options: [
                {
                    text: "Maybe tomorrow... or next week perhaps?",
                    feedback: "Hesitation keeps you trapped. Choose a specific moment.",
                    correct: false
                },
                {
                    text: "This moment! My journey begins NOW!",
                    feedback: "Perfect! A clear moment of decision gives you power.",
                    correct: true
                }
            ]
        },
        {
            title: "The Mirror Pool",
            challenge: "Looking into the water, you see your reflection. What do you see?",
            imagePrompt: "A serene pool of crystal-clear water in a sacred grove, reflecting a transformative image of the viewer",
            options: [
                {
                    text: "A person sacrificing their comfort zone",
                    feedback: "Look again - you're gaining freedom, not losing anything.",
                    correct: false
                },
                {
                    text: "A warrior claiming their freedom!",
                    feedback: "Yes! You see the truth - this journey brings only gains.",
                    correct: true
                }
            ]
        },
        {
            title: "The Sacred Vow",
            challenge: "At the ancient stone, you must make a vow. Which do you choose?",
            imagePrompt: "An ancient stone altar atop a mountain, surrounded by swirling mists and carved with sacred symbols",
            options: [
                {
                    text: "I'll do my best to stay free...",
                    feedback: "A hesitant vow holds no power. Make it absolute.",
                    correct: false
                },
                {
                    text: "I declare my eternal freedom, here and now!",
                    feedback: "Your powerful vow echoes through the mountains!",
                    correct: true
                }
            ]
        },
        {
            title: "The Wind Cave",
            challenge: "Strange winds blow through. How do you face them?",
            imagePrompt: "A mysterious cave entrance with ethereal winds visible as flowing light patterns, symbolizing change and transformation",
            options: [
                {
                    text: "Shield myself from the uncomfortable feelings",
                    feedback: "Fighting withdrawal makes it stronger. Let it pass through you.",
                    correct: false
                },
                {
                    text: "Dance with the winds of change!",
                    feedback: "Yes! These winds of change cannot harm you.",
                    correct: true
                }
            ]
        },
        {
            title: "The Village",
            challenge: "Others still carry their chains. What's your response?",
            imagePrompt: "A village scene at dusk, with silhouettes of people walking with visible ethereal chains, while your figure stands radiant and free",
            options: [
                {
                    text: "Count myself lucky to be different",
                    feedback: "They're trapped, you're free. Feel grateful!",
                    correct: false
                },
                {
                    text: "Radiate freedom's light to inspire others!",
                    feedback: "Your compassion shows true understanding.",
                    correct: true
                }
            ]
        },
        {
            title: "The Thought Temple",
            challenge: "Thoughts of the old life arise. What's your practice?",
            imagePrompt: "A serene temple interior with floating thought bubbles transforming into butterflies, representing liberation",
            options: [
                {
                    text: "Push the thoughts away quickly",
                    feedback: "Suppressing thoughts gives them power. Instead, celebrate freedom.",
                    correct: false
                },
                {
                    text: "Transform each thought into a victory dance!",
                    feedback: "Perfect! Each thought becomes a celebration.",
                    correct: true
                }
            ]
        },
        {
            title: "The Tempter's Bridge",
            challenge: "'Just once won't hurt,' whispers the bridge. Your response?",
            imagePrompt: "A mysterious bridge shrouded in alluring but deceptive mists, with a clear path visible beyond it",
            options: [
                {
                    text: "Listen to the tempting whispers...",
                    feedback: "Remember: there's no such thing as 'just once'.",
                    correct: false
                },
                {
                    text: "Laugh at the bridge's transparent tricks!",
                    feedback: "The trap becomes obvious when you see clearly!",
                    correct: true
                }
            ]
        },
        {
            title: "The False Remedies",
            challenge: "A merchant offers 'easier' paths. What do you do?",
            imagePrompt: "A mystical marketplace with a shadowy merchant offering glowing but false solutions, while a bright path leads away",
            options: [
                {
                    text: "Browse the interesting alternatives...",
                    feedback: "Substitutes keep the chains intact. Choose complete freedom.",
                    correct: false
                },
                {
                    text: "Stride past with unshakeable confidence!",
                    feedback: "You know true freedom needs no substitutes!",
                    correct: true
                }
            ]
        },
        {
            title: "The Empty Pack",
            challenge: "Do you keep emergency supplies of your old life?",
            imagePrompt: "An open backpack radiating light as it empties itself of shadowy objects, symbolizing letting go of past dependencies",
            options: [
                {
                    text: "Keep just a tiny safety net...",
                    feedback: "Keeping a backup shows doubt. Trust your freedom.",
                    correct: false
                },
                {
                    text: "Empty my pack and soar freely!",
                    feedback: "Yes! You need no safety net in freedom!",
                    correct: true
                }
            ]
        },
        {
            title: "The Summit",
            challenge: "You reach the peak. How do you view your journey?",
            imagePrompt: "A majestic mountain summit bathed in golden light, with a figure standing triumphant, arms raised in celebration",
            options: [
                {
                    text: "Wish upon a star for lasting freedom",
                    feedback: "Freedom isn't temporary - it's who you are now!",
                    correct: false
                },
                {
                    text: "Claim my throne as Freedom's Champion!",
                    feedback: "The summit is yours forever! True freedom achieved!",
                    correct: true
                }
            ]
        }
    ].map(step => ({
        ...step,
        options: shuffleArray([...step.options]),
        sleepChallenge: getSleepVersion(step.challenge),
        options: step.options.map(option => ({
            ...option,
            sleepText: getSleepVersion(option.text)
        }))
    })),
    career: [
        {
            title: "First Day Dawn",
            challenge: "It's your first day at the new job. How do you approach it?",
            imagePrompt: "A sunrise over a modern office building, symbolizing new beginnings and opportunity",
            options: [
                {
                    text: "Stay quiet and try not to make mistakes",
                    feedback: "Growth comes from being proactive and learning from mistakes.",
                    correct: false
                },
                {
                    text: "Embrace the challenge with enthusiasm!",
                    feedback: "Perfect! Your positive attitude sets the foundation for success.",
                    correct: true
                }
            ]
        },
        {
            title: "The Learning Curve",
            challenge: "You encounter unfamiliar tasks and systems. What's your strategy?",
            imagePrompt: "A winding path up a mountain made of books and computer screens, representing the journey of learning",
            options: [
                {
                    text: "Feel overwhelmed and doubt your abilities",
                    feedback: "Everyone starts somewhere. Trust in your capacity to learn.",
                    correct: false
                },
                {
                    text: "Break it down into small, manageable steps",
                    feedback: "Excellent! Methodical learning builds lasting expertise.",
                    correct: true
                }
            ]
        },
        {
            title: "Team Dynamics",
            challenge: "Your colleagues have different working styles. How do you adapt?",
            imagePrompt: "A diverse group of people working together like a well-orchestrated symphony",
            options: [
                {
                    text: "Stick to your own way of doing things",
                    feedback: "Flexibility and collaboration lead to better outcomes.",
                    correct: false
                },
                {
                    text: "Learn from their strengths and share yours",
                    feedback: "Great! Building bridges creates a stronger team.",
                    correct: true
                }
            ]
        },
        {
            title: "The First Mistake",
            challenge: "You've made an error in an important task. What now?",
            imagePrompt: "A broken piece being repaired with golden light, representing the Japanese art of Kintsugi",
            options: [
                {
                    text: "Try to hide it and hope no one notices",
                    feedback: "Transparency builds trust and leads to better solutions.",
                    correct: false
                },
                {
                    text: "Own it, learn from it, and improve",
                    feedback: "Perfect! Mistakes are stepping stones to mastery.",
                    correct: true
                }
            ]
        },
        {
            title: "The Challenge Project",
            challenge: "You're assigned a project outside your comfort zone. Your response?",
            imagePrompt: "A person stepping from a familiar path onto a bridge made of light leading to new horizons",
            options: [
                {
                    text: "Ask to be reassigned to something easier",
                    feedback: "Growth happens outside our comfort zone.",
                    correct: false
                },
                {
                    text: "See it as an opportunity to grow",
                    feedback: "Yes! Each challenge is a chance to expand your capabilities.",
                    correct: true
                }
            ]
        }
    ].map(step => ({
        ...step,
        options: shuffleArray([...step.options]),
        sleepChallenge: getSleepVersion(step.challenge),
        options: step.options.map(option => ({
            ...option,
            sleepText: getSleepVersion(option.text)
        }))
    }))
};

let currentPath = 'freedom';
const steps = journeyPaths[currentPath];

// DOM Elements
const mainCard = document.getElementById('mainCard');
const completionCard = document.getElementById('completionCard');
const stepIndicator = document.getElementById('stepIndicator');
const understandingLevel = document.getElementById('understandingLevel');
const stepTitle = document.getElementById('stepTitle');
const challenge = document.getElementById('challenge');
const feedback = document.getElementById('feedback');
const options = document.getElementById('options');
const finalUnderstanding = document.getElementById('finalUnderstanding');
const restartButton = document.getElementById('restartButton');
const progressBar = document.getElementById('progressBar');
const stepImage = document.getElementById('stepImage');

// Add sound control
const whiteNoiseBtn = document.getElementById('whiteNoiseBtn');
const lullabyBtn = document.getElementById('lullabyBtn');

// Create audio contexts and oscillators
let audioContext;
let whiteNoiseNode;
let isWhiteNoisePlaying = false;

// Lullaby notes (Brahms' Lullaby in simplified form)
const lullabyNotes = [
    { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
    { note: 'D4', duration: 2 },
    { note: 'G4', duration: 1 }, { note: 'G4', duration: 1 },
    { note: 'D4', duration: 2 }
];

const noteFrequencies = {
    'G4': 392.00,
    'D4': 293.66
};

let lullabyInterval;
let isLullabyPlaying = false;

// Add journey counter element
const journeyCount = document.getElementById('journeyCount');

// Initialize journey counter
journeyCount.textContent = completionCount;

// Update journey counter with animation
function updateJourneyCounter() {
    const counter = document.querySelector('.journey-counter');
    counter.classList.add('updated');
    journeyCount.textContent = completionCount;
    
    // Add motivational messages
    const messages = [
        "Amazing progress! 🌟",
        "You're unstoppable! ✨",
        "Level up! 🎮",
        "New milestone! 🏆",
        "Journey master! 🌈",
        "Keep shining! ⭐",
        "Freedom warrior! 🛡️",
        "Path finder! 🗺️"
    ];
    
    const message = document.createElement('div');
    message.className = 'achievement-message';
    message.textContent = messages[Math.floor(Math.random() * messages.length)];
    counter.appendChild(message);
    
    // Remove animation classes after they complete
    setTimeout(() => {
        counter.classList.remove('updated');
        message.remove();
    }, 1500);
}

// Utility functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateProgress() {
    const progress = ((currentStep) / (steps.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;
    stepIndicator.textContent = `Step ${currentStep + 1}/${steps.length}`;
    understandingLevel.textContent = `${understanding}%`;
}

function showFeedback(message) {
    feedback.textContent = message;
    feedback.classList.remove('hidden');
    feedback.style.animation = 'none';
    feedback.offsetHeight; // Trigger reflow
    feedback.style.animation = 'fadeIn 0.3s ease-out';
}

function hideFeedback() {
    feedback.classList.add('hidden');
}

// Add sparkle effect function
function createSparkles(e, button) {
    const numSparkles = 8;
    const buttonRect = button.getBoundingClientRect();
    const centerX = buttonRect.left + buttonRect.width / 2;
    const centerY = buttonRect.bottom + buttonRect.height / 10 ;

    for (let i = 0; i < numSparkles; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        document.body.appendChild(sparkle);

        const angle = (i / numSparkles) * Math.PI * 2;
        const velocity = 100;
        const offsetX = Math.cos(angle) * velocity;
        const offsetY = Math.sin(angle) * velocity;

        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.transform = `translate(${offsetX}px, ${offsetY}px)`;

        sparkle.addEventListener('animationend', () => sparkle.remove());
    }
}

function renderOptions() {
    options.innerHTML = '';
    const currentOptions = steps[currentStep].options;
    const fragment = document.createDocumentFragment();
    
    currentOptions.forEach((option) => {
        const button = document.createElement('button');
        button.textContent = isSleepMode ? option.sleepText : option.text;
        
        button.addEventListener('click', (e) => {
            if (button.disabled) return;
            
            button.classList.add('clicked');
            createSparkles(e, button);
            
            button.addEventListener('animationend', () => {
                button.classList.remove('clicked');
            }, { once: true });
            
            handleChoice(option.correct, option.feedback, button);
        });
        
        fragment.appendChild(button);
    });
    
    options.appendChild(fragment);
}

function renderStep() {
    stepTitle.textContent = steps[currentStep].title;
    challenge.textContent = isSleepMode ? 
        steps[currentStep].sleepChallenge : 
        steps[currentStep].challenge;
    stepImage.innerHTML = `<div class="image-prompt">${steps[currentStep].imagePrompt}</div>`;
    hideFeedback();
    renderOptions();
    updateProgress();
}

function handleChoice(isCorrect, feedbackText, clickedButton) {
    // Disable all buttons immediately
    const buttons = options.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        if (button !== clickedButton) {
            button.style.opacity = '0.5';
            button.style.transform = 'scale(0.95)';
        }
    });

    showFeedback(feedbackText);
    
    if (isCorrect) {
        understanding += 10;
        updateProgress();
        
        // Pre-load next step data
        const nextStep = currentStep + 1;
        const isComplete = nextStep >= steps.length;
        
        if (!isComplete) {
            // Preload next step's content
            const nextStepData = steps[nextStep];
            const tempTitle = document.createElement('div');
            const tempChallenge = document.createElement('div');
            tempTitle.textContent = nextStepData.title;
            tempChallenge.textContent = nextStepData.challenge;
        }
        
        setTimeout(() => {
            if (isComplete) {
                completeJourney();
            } else {
                currentStep = nextStep;
                renderStep();
            }
        }, 1500); // Reduced from 2000ms to 1500ms for better responsiveness
    } else {
        // Re-enable buttons after incorrect choice
        setTimeout(() => {
            buttons.forEach(button => {
                button.disabled = false;
                button.style.opacity = '1';
                button.style.transform = 'none';
            });
        }, 1500); // Reduced from 2000ms to 1500ms
    }
}

function completeJourney() {
    completionCount++;
    localStorage.setItem('completionCount', completionCount);
    updateJourneyCounter();
    
    mainCard.classList.add('hidden');
    completionCard.classList.remove('hidden');
    finalUnderstanding.textContent = `Understanding: ${understanding}%`;
    
    // Add completion count
    const completionText = document.createElement('p');
    completionText.textContent = `You've completed this journey ${completionCount} time${completionCount === 1 ? '' : 's'}!`;
    completionText.className = 'completion-count';
    finalUnderstanding.after(completionText);
}

function restartJourney() {
    currentStep = 0;
    understanding = 0;
    completionCard.classList.add('hidden');
    mainCard.classList.remove('hidden');
    renderStep();
}

// Event listeners
restartButton.addEventListener('click', restartJourney);

// Event listeners for path buttons
document.querySelectorAll('.path-button').forEach(button => {
    button.addEventListener('click', () => {
        const newPath = button.dataset.path;
        if (newPath !== currentPath) {
            currentPath = newPath;
            steps = journeyPaths[currentPath];
            // Reset progress
            currentStep = 0;
            understanding = 0;
            // Update UI
            document.querySelectorAll('.path-button').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.path === currentPath);
            });
            renderStep();
        }
    });
});

// Sleep mode toggle
const sleepToggle = document.getElementById('sleepToggle');
sleepToggle.addEventListener('click', () => {
    isSleepMode = !isSleepMode;
    localStorage.setItem('sleepMode', isSleepMode);
    document.documentElement.setAttribute('data-theme', isSleepMode ? 'dark' : 'light');
    renderStep();
});

// Add click handlers for audio controls
whiteNoiseBtn.addEventListener('click', () => {
    initAudio();
    if (!isWhiteNoisePlaying) {
        const noise = createWhiteNoise();
        whiteNoiseNode = noise;
        noise.source.start();
        noise.gain.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 1);
        whiteNoiseBtn.classList.add('active');
        isWhiteNoisePlaying = true;
    } else {
        whiteNoiseNode.gain.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);
        setTimeout(() => {
            whiteNoiseNode.source.stop();
        }, 1000);
        whiteNoiseBtn.classList.remove('active');
        isWhiteNoisePlaying = false;
    }
});

lullabyBtn.addEventListener('click', () => {
    initAudio();
    if (!isLullabyPlaying) {
        lullabyInterval = playLullaby();
        lullabyBtn.classList.add('active');
        isLullabyPlaying = true;
    } else {
        clearInterval(lullabyInterval);
        lullabyBtn.classList.remove('active');
        isLullabyPlaying = false;
    }
});

// Initialize the UI state
document.documentElement.setAttribute('data-theme', isSleepMode ? 'dark' : 'light');
document.querySelectorAll('.path-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.path === currentPath);
});

// Initialize the first step
renderStep();

// Function to get sleep version of text
function getSleepVersion(text) {
    const sleepVersions = {
        // Gateway
        "You stand before a gateway. A voice says: 'Set your date of freedom.'": "When will you start?",
        "Maybe tomorrow... or next week perhaps?": "Later...",
        "This moment! My journey begins NOW!": "Now!",
        
        // Mirror Pool
        "Looking into the water, you see your reflection. What do you see?": "What do you see?",
        "A person sacrificing their comfort zone": "Giving up",
        "A warrior claiming their freedom!": "Getting stronger",
        
        // Sacred Vow
        "At the ancient stone, you must make a vow. Which do you choose?": "Make your vow",
        "I'll do my best to stay free...": "I'll try",
        "I declare my eternal freedom, here and now!": "I am free",
        
        // Wind Cave
        "Strange winds blow through. How do you face them?": "Face the winds",
        "Shield myself from the uncomfortable feelings": "Hide",
        "Dance with the winds of change!": "Flow",
        
        // Village
        "Others still carry their chains. What's your response?": "See others struggle",
        "Count myself lucky to be different": "Feel lucky",
        "Radiate freedom's light to inspire others!": "Share strength",
        
        // Thought Temple
        "Thoughts of the old life arise. What's your practice?": "Old thoughts come",
        "Push the thoughts away quickly": "Push away",
        "Transform each thought into a victory dance!": "Transform",
        
        // Tempter's Bridge
        "'Just once won't hurt,' whispers the bridge. Your response?": "Temptation comes",
        "Listen to the tempting whispers...": "Listen",
        "Laugh at the bridge's transparent tricks!": "Stay strong",
        
        // False Remedies
        "A merchant offers 'easier' paths. What do you do?": "Easier way offered",
        "Browse the interesting alternatives...": "Look at options",
        "Stride past with unshakeable confidence!": "Walk on",
        
        // Empty Pack
        "Do you keep emergency supplies of your old life?": "Keep backup?",
        "Keep just a tiny safety net...": "Keep some",
        "Empty my pack and soar freely!": "Let go all",
        
        // Summit
        "You reach the peak. How do you view your journey?": "Journey's view",
        "Wish upon a star for lasting freedom": "Hope it lasts",
        "Claim my throne as Freedom's Champion!": "Forever free",
        
        // First Day Dawn
        "It's your first day at the new job. How do you approach it?": "First day approach",
        "Stay quiet and try not to make mistakes": "Quiet approach",
        "Embrace the challenge with enthusiasm!": "Positive approach",
        
        // The Learning Curve
        "You encounter unfamiliar tasks and systems. What's your strategy?": "Learning strategy",
        "Feel overwhelmed and doubt your abilities": "Overwhelmed",
        "Break it down into small, manageable steps": "Manageable steps",
        
        // Team Dynamics
        "Your colleagues have different working styles. How do you adapt?": "Team adaptation",
        "Stick to your own way of doing things": "Own way",
        "Learn from their strengths and share yours": "Learn and share",
        
        // The First Mistake
        "You've made an error in an important task. What now?": "Error handling",
        "Try to hide it and hope no one notices": "Hide error",
        "Own it, learn from it, and improve": "Own and improve",
        
        // The Challenge Project
        "You're assigned a project outside your comfort zone. Your response?": "Project response",
        "Ask to be reassigned to something easier": "Easier request",
        "See it as an opportunity to grow": "Growth mindset"
    };
    
    return sleepVersions[text] || text;
}

// Initialize audio context on first user interaction
function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

// White noise generator (432 Hz base with gentle waves)
function createWhiteNoise() {
    const bufferSize = 2 * audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);
    
    let phase = 0;
    const frequency = 432; // Base frequency for relaxation
    
    for (let i = 0; i < bufferSize; i++) {
        // Combine white noise with sine wave for ocean-like effect
        const whiteNoise = Math.random() * 2 - 1;
        const sine = Math.sin(2 * Math.PI * frequency * phase);
        output[i] = (whiteNoise * 0.15 + sine * 0.05) * 0.3; // Reduced volume
        phase += 1 / audioContext.sampleRate;
    }
    
    const node = audioContext.createBufferSource();
    node.buffer = buffer;
    node.loop = true;
    
    // Add low-pass filter for softer sound
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    // Add gentle fade in/out
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    
    node.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    return { source: node, gain: gainNode };
}

// Play a single note with soft attack and release
function playNote(frequency, duration) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;
    
    gainNode.gain.value = 0;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Soft attack
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    
    // Soft release
    gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration - 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

// Play the lullaby sequence
function playLullaby() {
    let noteIndex = 0;
    const tempo = 1.5; // Seconds per beat (slow tempo)
    
    return setInterval(() => {
        const note = lullabyNotes[noteIndex];
        playNote(noteFrequencies[note.note], note.duration * tempo);
        noteIndex = (noteIndex + 1) % lullabyNotes.length;
    }, tempo * 1000);
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Only handle shortcuts if not in an input field
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    const key = e.key.toLowerCase();
    
    // Shortcuts for path selection (1-2)
    if (key === '1') {
        document.querySelector('[data-path="freedom"]').click();
    } else if (key === '2') {
        document.querySelector('[data-path="career"]').click();
    }
    
    // Shortcuts for audio controls
    if (key === 'm') {
        whiteNoiseBtn.click(); // Toggle ocean waves
    } else if (key === 'l') {
        lullabyBtn.click(); // Toggle lullaby
    } else if (key === 's') {
        sleepToggle.click(); // Toggle sleep mode
    }
    
    // Option selection (a/b)
    if (key === 'a' || key === 'b') {
        const buttons = options.querySelectorAll('button:not([disabled])');
        const index = key === 'a' ? 0 : 1;
        if (buttons[index]) buttons[index].click();
    }
    
    // Restart journey (r)
    if (key === 'r' && !mainCard.classList.contains('hidden')) {
        restartButton.click();
    }
});


// Apply enhanced interactions to all buttons
document.querySelectorAll('button').forEach(enhanceButton);

// Add keyboard shortcut tooltips
const tooltips = {
    '[data-path="freedom"]': 'Freedom Path (1)',
    '[data-path="career"]': 'Career Path (2)',
    '#whiteNoiseBtn': 'Ocean Waves (M)',
    '#lullabyBtn': 'Lullaby (L)',
    '#sleepToggle': 'Sleep Mode (S)'
};

Object.entries(tooltips).forEach(([selector, text]) => {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute('data-tooltip', text);
    }
}); 
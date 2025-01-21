// Game state
let currentStep = 0;
let understanding = 0;
let completionCount = localStorage.getItem('completionCount') || 0;

const steps = [
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
    options: shuffleArray([...step.options])
}));

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
    const centerY = buttonRect.top + buttonRect.height / 2;

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
        button.textContent = option.text;
        
        button.addEventListener('click', (e) => {
            if (button.disabled) return;
            
            // Visual feedback
            button.classList.add('clicked');
            createSparkles(e, button);
            
            // Remove animation class after it completes
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
    challenge.textContent = steps[currentStep].challenge;
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
    
    mainCard.classList.add('hidden');
    completionCard.classList.remove('hidden');
    finalUnderstanding.textContent = `Understanding: ${understanding}%`;
    
    // Add completion count
    const completionText = document.createElement('p');
    completionText.textContent = `You've completed this journey ${completionCount} time${completionCount === 1 ? '' : 's'}!`;
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

// Initialize the game
renderStep(); 
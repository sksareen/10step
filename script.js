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
                text: "'I'll decide later...'",
                feedback: "Hesitation keeps you trapped. Choose a specific moment.",
                correct: false
            },
            {
                text: "'I choose now!'",
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
                text: "Someone giving up something",
                feedback: "Look again - you're gaining freedom, not losing anything.",
                correct: false
            },
            {
                text: "Someone gaining freedom",
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
                text: "'I'll try my best...'",
                feedback: "A hesitant vow holds no power. Make it absolute.",
                correct: false
            },
            {
                text: "'I am free, now and forever!'",
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
                text: "Brace against them",
                feedback: "Fighting withdrawal makes it stronger. Let it pass through you.",
                correct: false
            },
            {
                text: "Let them pass through",
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
                text: "Feel sorry for yourself",
                feedback: "They're trapped, you're free. Feel grateful!",
                correct: false
            },
            {
                text: "Send them silent blessings",
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
                text: "Try not to think about it",
                feedback: "Suppressing thoughts gives them power. Instead, celebrate freedom.",
                correct: false
            },
            {
                text: "Welcome them as reminders of freedom",
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
                text: "Consider it briefly",
                feedback: "Remember: there's no such thing as 'just once'.",
                correct: false
            },
            {
                text: "See through the illusion",
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
                text: "Look at the alternatives",
                feedback: "Substitutes keep the chains intact. Choose complete freedom.",
                correct: false
            },
            {
                text: "Walk past with a smile",
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
                text: "Just in case...",
                feedback: "Keeping a backup shows doubt. Trust your freedom.",
                correct: false
            },
            {
                text: "I travel light and free",
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
                text: "Hope it lasts",
                feedback: "Freedom isn't temporary - it's who you are now!",
                correct: false
            },
            {
                text: "I am permanently free!",
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

function renderOptions() {
    options.innerHTML = '';
    const currentOptions = steps[currentStep].options;
    
    currentOptions.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option.text;
        button.addEventListener('click', (e) => {
            // Add click animation
            button.classList.add('clicked');
            
            // Remove animation class after it completes
            button.addEventListener('animationend', () => {
                button.classList.remove('clicked');
            }, { once: true });
            
            handleChoice(option.correct, option.feedback, button);
        });
        options.appendChild(button);
    });
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
    // Disable all buttons immediately to prevent multiple clicks
    const buttons = options.querySelectorAll('button');
    buttons.forEach(button => {
        button.disabled = true;
        if (button !== clickedButton) {
            button.style.opacity = '0.5';
        }
    });

    showFeedback(feedbackText);
    
    if (isCorrect) {
        understanding += 10;
        updateProgress();
        
        // Prepare next step before animation
        const nextStep = currentStep + 1;
        const isComplete = nextStep >= steps.length;
        
        // Add transition class to maintain height
        mainCard.style.height = `${mainCard.offsetHeight}px`;
        
        setTimeout(() => {
            if (isComplete) {
                completeJourney();
            } else {
                currentStep = nextStep;
                renderStep();
                // Remove fixed height after content updates
                setTimeout(() => {
                    mainCard.style.height = 'auto';
                }, 300);
            }
        }, 2000);
    } else {
        // Re-enable buttons after incorrect choice
        setTimeout(() => {
            buttons.forEach(button => {
                button.disabled = false;
                button.style.opacity = '1';
            });
        }, 2000);
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
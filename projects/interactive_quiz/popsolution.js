'use strict';

const questions = [
    {
        question: 'What does ADA stand for?',
        choices: [
            { value: 'a', text: 'Accessible Design Association' },
            { value: 'b', text: 'Americans with Disabilities Act' },
            { value: 'c', text: 'American Digital Accessibility' },
            { value: 'd', text: 'Association for Disability Awareness' }
        ],
        correctAnswer: 'b'
    },
    {
        question: 'Who is responsible for making websites accessible?',
        choices: [
            { value: 'a', text: 'Only web developers' },
            { value: 'b', text: 'Only people with disabilities' },
            { value: 'c', text: 'Only the website owner' },
            { value: 'd', text: 'Anyone involved in designing, developing, or maintaining websites' }
        ],
        correctAnswer: 'd'
    },
    {
        question: 'How do people with vision impairments navigate websites without seeing the screen?',
        choices: [
            { value: 'a', text: 'Seeing eye dogs' },
            { value: 'b', text: 'Audio recorders' },
            { value: 'c', text: 'Screen readers' },
            { value: 'd', text: 'Voice amplifiers' }
        ],
        correctAnswer: 'c'
    },
    {
        question: 'What makes good alternative text?',
        choices: [
            { value: 'a', text: 'A detailed list of everything in the image' },
            { value: 'b', text: "The image's file name" },
            { value: 'c', text: "A description that starts with 'Image of' every time" },
            { value: 'd', text: 'A clear, concise description of the image and its purpose' }
        ],
        correctAnswer: 'd'
    },
    {
        question: 'Which is NOT an important consideration when choosing accessible website colors?',
        choices: [
            { value: 'a', text: 'Contrast between text and background' },
            { value: 'b', text: 'How colors appear to people with color blindness' },
            { value: 'c', text: 'Whether the colors look good together' },
            { value: 'd', text: 'Whether information relies on color alone' }
        ],
        correctAnswer: 'c'
    },
    {
        question: 'Which is NOT an important accessibility consideration when adding moving or flashing elements to a website?',
        choices: [
            { value: 'a', text: 'Whether animations use the same style as other website elements' },
            { value: 'b', text: 'Whether users can pause, stop, or hide moving content' },
            { value: 'c', text: 'Whether flashing content could trigger seizures' },
            { value: 'd', text: 'Whether interactive elements can be operated using a keyboard' }
        ],
        correctAnswer: 'a'
    },
    {
        question: 'What is an important thing to remember about website accessibility?',
        choices: [
            { value: 'a', text: 'Accessibility is primarily about meeting technical requirements rather than improving the user experience' },
            { value: 'b', text: 'Accessibility should be considered throughout a website’s design, development, and maintenance' },
            { value: 'c', text: 'Accessibility only needs to be addressed when a website first launches' },
            { value: 'd', text: 'Automated testing tools are enough to ensure a website is accessible' }
        ],
        correctAnswer: 'b'
    }
];

const quizCard = document.getElementById('quiz-card');
const resultsCard = document.getElementById('results-card');
const questionText = document.getElementById('question-text');
const answerOptions = document.getElementById('answer-options');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');
const feedback = document.getElementById('feedback');
const previousButton = document.getElementById('previous-button');
const nextButton = document.getElementById('next-button');
const restartButton = document.getElementById('restart-button');
const playAgainButton = document.getElementById('play-again-button');
const resultsHeading = document.getElementById('results-heading');
const resultsScore = document.getElementById('results-score');
const resultsMessage = document.getElementById('results-message');

let currentQuestion = 0;
let userAnswers = {};

function getSelectedChoice(question, value) {
    return question.choices.find((choice) => choice.value === value);
}

function showFeedback(answerValue) {
    const question = questions[currentQuestion];
    const isCorrect = answerValue === question.correctAnswer;
    const correctChoice = getSelectedChoice(question, question.correctAnswer);

    feedback.classList.toggle('is-correct', isCorrect);
    feedback.classList.toggle('is-incorrect', !isCorrect);

    if (isCorrect) {
        feedback.textContent = 'Correct!';
    } else {
        feedback.textContent = `Not quite. The correct answer is ${question.correctAnswer.toUpperCase()}: ${correctChoice.text}`;
    }
}

function updateSelectedStyle() {
    answerOptions.querySelectorAll('.answer-option').forEach((option) => {
        const input = option.querySelector('input');
        option.classList.toggle('is-selected', input.checked);
    });
}

function handleAnswerChange(event) {
    if (event.target.name !== 'answer') return;

    userAnswers[currentQuestion] = event.target.value;
    showFeedback(event.target.value);
    nextButton.disabled = false;
    updateSelectedStyle();
}

function renderQuestion(moveFocus = false) {
    const question = questions[currentQuestion];
    const savedAnswer = userAnswers[currentQuestion];

    progressText.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    progressBar.value = currentQuestion + 1;
    questionText.textContent = `${currentQuestion + 1}. ${question.question}`;
    answerOptions.replaceChildren();

    question.choices.forEach((choice) => {
        const option = document.createElement('div');
        option.className = 'answer-option';

        const label = document.createElement('label');
        const input = document.createElement('input');
        const answerText = document.createElement('span');
        const inputId = `question-${currentQuestion + 1}-answer-${choice.value}`;

        input.type = 'radio';
        input.name = 'answer';
        input.id = inputId;
        input.value = choice.value;
        input.checked = savedAnswer === choice.value;

        answerText.className = 'answer-label-text';
        answerText.textContent = `${choice.value.toUpperCase()}. ${choice.text}`;

        label.htmlFor = inputId;
        label.append(input, answerText);
        option.append(label);
        answerOptions.append(option);
    });

    previousButton.disabled = currentQuestion === 0;
    nextButton.disabled = !savedAnswer;
    nextButton.textContent = currentQuestion === questions.length - 1 ? 'View results' : 'Next question';

    feedback.textContent = '';
    feedback.classList.remove('is-correct', 'is-incorrect');

    if (savedAnswer) {
        showFeedback(savedAnswer);
    }

    if (moveFocus) {
        questionText.focus();
    }
}

function showResults() {
    const correctCount = questions.reduce((score, question, index) => {
        return score + (userAnswers[index] === question.correctAnswer ? 1 : 0);
    }, 0);

    quizCard.hidden = true;
    resultsCard.hidden = false;
    progressBar.value = questions.length;
    resultsScore.textContent = `You answered ${correctCount} of ${questions.length} questions correctly.`;

    if (correctCount === questions.length) {
        resultsMessage.textContent = 'Perfect score!';
    } else if (correctCount >= Math.ceil(questions.length * 0.7)) {
        resultsMessage.textContent = 'Nice work. Review any questions you missed and keep building your accessibility knowledge.';
    } else {
        resultsMessage.textContent = 'Review the questions and try again to strengthen your understanding of website accessibility.';
    }

    resultsHeading.focus();
}

function goToNextQuestion() {
    if (!userAnswers[currentQuestion]) return;

    if (currentQuestion === questions.length - 1) {
        showResults();
        return;
    }

    currentQuestion += 1;
    renderQuestion(true);
}

function goToPreviousQuestion() {
    if (currentQuestion === 0) return;
    currentQuestion -= 1;
    renderQuestion(true);
}

function restartQuiz() {
    currentQuestion = 0;
    userAnswers = {};
    resultsCard.hidden = true;
    quizCard.hidden = false;
    renderQuestion(true);
}

answerOptions.addEventListener('change', handleAnswerChange);
nextButton.addEventListener('click', goToNextQuestion);
previousButton.addEventListener('click', goToPreviousQuestion);
restartButton.addEventListener('click', restartQuiz);
playAgainButton.addEventListener('click', restartQuiz);

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const quizLogo = document.getElementById('quiz-logo');

themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');

    themeToggle.setAttribute('aria-pressed', String(isDarkMode));
    themeToggle.setAttribute(
        'aria-label',
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
    );
    themeIcon.textContent = isDarkMode ? '☀' : '☾';
    quizLogo.src = isDarkMode ? quizLogo.dataset.darkLogo : quizLogo.dataset.lightLogo;
});

renderQuestion();

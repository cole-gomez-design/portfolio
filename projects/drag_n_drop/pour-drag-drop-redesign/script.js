'use strict';

const conceptBank = document.getElementById('concept-bank');
const conceptItems = Array.from(document.querySelectorAll('.concept-item'));
const dropZones = Array.from(document.querySelectorAll('.drop-zone'));
const checkButton = document.getElementById('check-answers');
const resetButton = document.getElementById('reset-activity');
const feedback = document.getElementById('feedback');

const categories = ['perceivable', 'operable', 'understandable', 'robust'];
const originalOrder = [...conceptItems];

let selectedItem = null;

function getCategoryName(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}

function updateSelection() {
    conceptItems.forEach((item) => {
        const isSelected = item === selectedItem;
        item.setAttribute('aria-pressed', String(isSelected));
    });

}

function updateDropZones() {
    categories.forEach((category) => {
        const zone = document.getElementById(`zone-${category}`);
        zone.classList.toggle('is-empty', zone.querySelectorAll('.concept-item').length === 0);
    });
}

function clearResults() {
    conceptItems.forEach((item) => {
        delete item.dataset.result;
        const status = item.querySelector('.answer-status');
        status.textContent = '';
    });

    feedback.classList.remove('is-correct', 'is-incorrect');
}

function selectItem(item) {
    selectedItem = selectedItem === item ? null : item;
    updateSelection();

    if (selectedItem) {
        feedback.textContent = 'Practice selected. Choose its category above.';
    } else {
        feedback.textContent = 'Practice selection cleared.';
    }

    feedback.classList.remove('is-correct', 'is-incorrect');
}

function moveItem(item, zone) {
    if (!item || !zone) return;

    clearResults();
    zone.appendChild(item);
    selectedItem = null;

    updateSelection();
    updateDropZones();

    feedback.textContent = `Practice moved to the ${getCategoryName(zone.dataset.category)} category.`;
    item.focus();
}

conceptItems.forEach((item) => {
    item.addEventListener('click', () => {
        selectItem(item);
    });

    item.addEventListener('dragstart', (event) => {
            item.classList.add('dragging');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', item.id);
    });

    item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        dropZones.forEach((zone) => zone.classList.remove('drag-over'));
    });
});

dropZones.forEach((zone) => {
    zone.addEventListener('click', (event) => {
        if (event.target !== zone) return;
        if (selectedItem) {
            moveItem(selectedItem, zone);
        } else {
            feedback.textContent = 'Select a practice below, then choose its category above.';
        }
    });

    zone.addEventListener('keydown', (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && selectedItem) {
            event.preventDefault();
            moveItem(selectedItem, zone);
        }
    });

    zone.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', (event) => {
        if (!zone.contains(event.relatedTarget)) {
            zone.classList.remove('drag-over');
        }
    });

    zone.addEventListener('drop', (event) => {
        event.preventDefault();
        zone.classList.remove('drag-over');

        const itemId = event.dataTransfer.getData('text/plain');
        const item = document.getElementById(itemId);

        if (item && item.classList.contains('concept-item')) {
            moveItem(item, zone);
        }
    });
});

checkButton.addEventListener('click', () => {
    let correct = 0;
    let remaining = 0;

    conceptItems.forEach((item) => {
        const zone = item.closest('.drop-zone');
        const status = item.querySelector('.answer-status');

        if (!zone) {
            delete item.dataset.result;
            status.textContent = 'Not yet sorted';
            remaining++;
        } else if (zone.dataset.category === item.dataset.answer) {
            item.dataset.result = 'correct';
            status.textContent = 'Correct';
            correct++;
        } else {
            item.dataset.result = 'incorrect';
            status.textContent = `Incorrect. This belongs in ${getCategoryName(item.dataset.answer)}.`;
        }
    });

    feedback.classList.remove('is-correct', 'is-incorrect');

    if (correct === conceptItems.length) {
        feedback.textContent = `Excellent work! You correctly sorted all ${conceptItems.length} practices.`;
        feedback.classList.add('is-correct');
    } else {
        const incorrect = conceptItems.length - correct - remaining;
        feedback.textContent =
            `You got ${correct} of ${conceptItems.length} correct. ` +
            `${incorrect} ${incorrect === 1 ? 'practice is' : 'practices are'} in the wrong category, ` +
            `and ${remaining} ${remaining === 1 ? 'is' : 'are'} not yet sorted. Review the feedback and try again.`;
        feedback.classList.add('is-incorrect');
    }
});

resetButton.addEventListener('click', () => {
    originalOrder.forEach((item) => {
        conceptBank.appendChild(item);
        delete item.dataset.result;
        item.querySelector('.answer-status').textContent = '';
    });

    selectedItem = null;
    updateSelection();
    updateDropZones();

    feedback.classList.remove('is-correct', 'is-incorrect');
    feedback.textContent = 'All practices returned to the bank.';

    originalOrder[0].focus();
});

/* Light and dark theme */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const activityLogo = document.getElementById('activity-logo');

themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');

    themeToggle.setAttribute('aria-pressed', String(isDarkMode));
    themeToggle.setAttribute(
        'aria-label',
        isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
    );

    themeIcon.textContent = isDarkMode ? '☀' : '☾';
    activityLogo.src = isDarkMode
        ? activityLogo.dataset.darkLogo
        : activityLogo.dataset.lightLogo;
});

updateSelection();
updateDropZones();

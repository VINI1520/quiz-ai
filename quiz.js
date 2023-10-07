let questionsData;

function handleFile() {
    const fileInput = document.getElementById('jsonUpload');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        questionsData = JSON.parse(event.target.result);
        populateQuiz(questionsData.questions);
    }

    reader.readAsText(file);
}

function populateQuiz(questions) {
    const container = document.getElementById('quiz-container');
    container.innerHTML = '';  // Clear any existing questions

    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'question-box';  // Assign class for styling

        const questionLabel = document.createElement('label');
        questionLabel.innerHTML = q.question;
        questionDiv.appendChild(questionLabel);

        // Add a line break after the question
        const questionBreak = document.createElement('br');
        questionDiv.appendChild(questionBreak);

        q.options.forEach((option, optionIndex) => {
            const optionInput = document.createElement('input');
            optionInput.type = 'radio';
            optionInput.name = `question-${index}`;
            optionInput.value = option;
            
            // Add an onchange event to the radio button
            optionInput.onchange = function() {
                checkIndividualAnswer(index, optionIndex);
            }

            const optionLabel = document.createElement('label');
            optionLabel.innerHTML = option;

            questionDiv.appendChild(optionInput);
            questionDiv.appendChild(optionLabel);
            
            // Add a line break after each option for better visual separation
            const optionBreak = document.createElement('br');
            questionDiv.appendChild(optionBreak);
        });
        
        container.appendChild(questionDiv);
    });
}

function checkIndividualAnswer(questionIndex, optionIndex) {
    const question = questionsData.questions[questionIndex];
    const selectedOption = question.options[optionIndex];
    const label = document.querySelector(`input[name="question-${questionIndex}"][value="${selectedOption}"] + label`);
    
    // Reset color for all options of this question
    const allLabels = document.querySelectorAll(`input[name="question-${questionIndex}"] + label`);
    allLabels.forEach(l => {
        l.classList.remove('correct-answer', 'wrong-answer');
    });
    
    if (selectedOption === question.answer) {
        label.classList.add('correct-answer');
    } else {
        label.classList.add('wrong-answer');
    }
}

function checkAnswers() {
    if (!questionsData) {
        alert("Please upload the questions JSON file first.");
        return;
    }

    let correctCount = 0;
    let wrongQuestions = [];

    questionsData.questions.forEach((q, index) => {
        const selected = document.querySelector(`input[name="question-${index}"]:checked`);
        if (selected && selected.value === q.answer) {
            correctCount++;
        } else if (selected) {  // only add to wrongQuestions if an option was selected
            wrongQuestions.push(q.question);
        }
    });

    document.getElementById('result').innerHTML = `You got ${correctCount} out of ${questionsData.questions.length} questions right!`;

    // If there are wrongly answered questions, generate a ChatGPT prompt
    if (wrongQuestions.length > 0) {
        let chatGPTPrompt = "Here are the questions you answered incorrectly:\n\n";
        chatGPTPrompt += wrongQuestions.join('\n');
        alert(chatGPTPrompt);
    }
}

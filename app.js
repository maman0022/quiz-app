'use strict';
const STORE = {
  questions: [
    {
      question: 'What is 5 to the 3rd power?',
      answers: ['25', '100', '125', '175'],
      correctAnswer: 2
    },
    {
      question: 'What is square root of 25?',
      answers: ['10', '5', '3', '2.5'],
      correctAnswer: 1
    },
    {
      question: 'What is 2 x 3 + 10 x 5 + 14?',
      answers: ['70', '94', '144', '76'],
      correctAnswer: 0
    },
    {
      question: 'What is 1/10 of 5/6?',
      answers: ['0.08', '0.7', '0.9', '0.0833'],
      correctAnswer: 3
    },
    {
      question: 'An integer from 100 through 999, inclusive, is to be chosen at random. What is the probability that the number chosen will have a 0 in at least 1 digit?',
      answers: ['19/900', '81/900', '90/900', '171/900'], correctAnswer: 3
    }],
  score: 0,
  currentQuestion: 0,
  guess: 0,
  started: false,
  hasFeedback: false
};

function render() {
  $('main').empty();
  $('header').empty();
  if (!STORE.started) {
    appendTo('main',generateWelcomeTemplate());
  } else if (STORE.hasFeedback) {
    appendTo('header',generateHeaderTemplate());
    appendTo('main',generateFeedbackTemplate());
  } else if (STORE.currentQuestion < STORE.questions.length) {
    appendTo('header',generateHeaderTemplate());
    appendTo('main',generateFormTemplate());
  } else {
    appendTo('main',generateSummaryTemplate());
  }
}

function generateWelcomeTemplate(){
  let welcomeScreen=`
  <section id="start">
    <h2>Welcome to Math Quiz</h2>
    <button id="start-quiz">Start</button>
  </section>
  `;
  return welcomeScreen;
}

function generateHeaderTemplate(){
  let headerElements = `
  <h1>Math Quiz</h1>
  <p class="score">Score: ${STORE.score}/${STORE.questions.length}</p>
  <p class="progress">Question: ${STORE.currentQuestion + 1}/${STORE.questions.length}</p>
  `;
  return headerElements;
}

function generateFormTemplate(){
  const question = STORE.questions[STORE.currentQuestion];
  let formElements=`
  <section id="quiz">
      <h2>${question.question}</h2>
      <form>
        ${generateAnswersTemplate(question)}
        <input type="submit" value="Submit Answer" aria-label="Submit Answer" />
      </form>
    </section>
  `;
  return formElements;
}

function generateAnswersTemplate(question){
  let answers='';
  question.answers.forEach((answer, i) => {
    answers+=`
        <input type="radio" name="choice" value="${i}" id="${i}"/>
        <label for="${i}">${answer}</label><br/>
      `;
  });
  return answers;
}

function generateFeedbackTemplate(){
  const question = STORE.questions[STORE.currentQuestion];
  let feedback=`
  <section id="feedback">
    <h2 class=${STORE.hasFeedback === 'Incorrect'?'incorrect':'correct'}>${STORE.hasFeedback}</h2>
    <p class="user-answer ${STORE.hasFeedback === 'Correct'?'hidden':''}">Your answer: ${STORE.guess}</p>
    <p class="correct-answer">The correct answer: ${question.answers[question.correctAnswer]}</p>
    <button id="next">Next Question</button>
    </section>
  `;
  return feedback;
}

function generateSummaryTemplate(){
  let summary=`
  <section id="summary">
    <h2>Summary</h2>
    <p>You got ${STORE.score} questions out of ${STORE.questions.length} correct. Your final score is ${STORE.score/STORE.questions.length*100}%</p>
    <button id="restart">Restart Quiz</button>
  </section>
  `;
  return summary;
}

function appendTo(element,string){
  $(element).append(string);
}

/* listening to events */
function handleStartQuiz() {
  $('main').on('click','#start-quiz',() => {
    STORE.started = true;
    render();
  });
}

function handleSubmitChoice() {
  $('main').on('submit','#quiz form',e => {
    e.preventDefault();
    if (!$('input[type="radio"]:checked').val()) {
      alert('No answer selected');
      return;
    }
    const answer = $('input[type="radio"]:checked').val();
    const question = STORE.questions[STORE.currentQuestion];
    if (Number(answer) === question.correctAnswer) {
      STORE.score = STORE.score + 1;
      STORE.hasFeedback = 'Correct';
    } else {
      STORE.guess = STORE.questions[STORE.currentQuestion].answers[answer];
      STORE.hasFeedback = 'Incorrect';
    }
    render();
  });
}

function handleNextQuestion() {
  $('main').on('click','#next',() => {
    STORE.hasFeedback = false;
    STORE.currentQuestion = STORE.currentQuestion + 1;
    render();
  });
}

function handleRestartQuiz() {
  $('main').on('click','#restart',() => {
    STORE.started = true;
    STORE.score = 0;
    STORE.currentQuestion = 0;
    render();
  });
}

function main() {
  handleStartQuiz();
  handleSubmitChoice();
  handleNextQuestion();
  handleRestartQuiz();
  render();
}

$(main);
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
}

function render() {
  $('#start').hide();
  $('#quiz').hide();
  $('#feedback').hide();
  $('#summary').hide();
  $('header').hide();


  if (!STORE.started) {
    $('#start').show();
  } else if (STORE.hasFeedback) {
    renderHeader();
    renderFeedback();
  } else if (STORE.currentQuestion < STORE.questions.length) {
    renderHeader();
    renderQuestion();
  } else {
    renderSummary();
  }
}


function renderBaseElements() {
  let headerElements = `
  <p class="score">Score:</p>
  <p class="progress">0/0</p>
  `;
  $('header').append(headerElements);
  let bodyElements = `
    <section id="start">
      <h2>Welcome to Math Quiz</h2>
      <button id="start-quiz">Start</button>
    </section>

    <section id="quiz">
      <h2>placeholder</h2>
      <form>
        <fieldset id="choices"><legend>Question</legend></fieldset>
        <input type="submit" value="Submit Answer" aria-label="Submit Answer" />
      </form>
    </section>

    <section id="feedback">
      <h2>placeholder</h2>
      <p class="user-answer"></p>
      <p class="correct-answer"></p>
      <button id="next">Next Question</button>
    </section>

    <section id="summary">
      <h2>Summary</h2>
      <p></p>
      <button id="restart">Restart Quiz</button>
    </section>
  `;
  $('main').append(bodyElements)
}

function renderHeader() {
  $('header').show();
  $('header .score').text(`Score: ${STORE.score}/${STORE.questions.length}`);
  $('header .progress').text(`Question ${STORE.currentQuestion + 1}/${STORE.questions.length}`);
}

function renderQuestion() {
  $("#quiz").show();
  const question = STORE.questions[STORE.currentQuestion];
  $('#quiz h2').text(question.question);
  $('#choices').html('');
  question.answers.forEach((answer, i) => {
    $('#choices').append(`
        <input type="radio" name="choice" value="${i}" id="${i}"/>
        <label for="${i}">${answer}</label><br/>
      `);
  });
}

function renderFeedback() {
  $('#feedback').show();
  $("#feedback h2").removeClass('incorrect');
  $("#feedback h2").text(STORE.hasFeedback);
  $('.user-answer').text('');
  const question = STORE.questions[STORE.currentQuestion];
  if (STORE.hasFeedback === "Incorrect") {
    $('.user-answer').text(`Your answer: ${STORE.guess}`);
    $("#feedback h2").addClass('incorrect');
  }
  $('.correct-answer').text(`The correct answer: ${question.answers[question.correctAnswer]}`);
}

function renderSummary() {
  $('#summary').show();
  $('#summary p').text(`Your score is ${STORE.score / STORE.questions.length * 100}%`);
}


/* listening to events */
function startQuiz() {
  $('#start-quiz').click(e => {
    STORE.started = true;
    render();
  })
}

function submitChoice() {
  $('#quiz form').submit(e => {
    e.preventDefault();
    if (!$('input[type="radio"]:checked').val()) {
      alert('No answer selected');
      return;
    }
    const answer = $('input[type="radio"]:checked').val();
    const question = STORE.questions[STORE.currentQuestion];
    if (Number(answer) === question.correctAnswer) {
      STORE.score = STORE.score + 1;
      STORE.hasFeedback = "Correct";
    } else {
      STORE.guess = STORE.questions[STORE.currentQuestion].answers[answer];
      STORE.hasFeedback = "Incorrect";
    }
    render();
  })
}

function nextQuestion() {
  $('#next').click(e => {
    STORE.hasFeedback = false;
    STORE.currentQuestion = STORE.currentQuestion + 1;
    render();
  });
}

function restartQuiz() {
  $('#restart').click(e => {
    STORE.started = false;
    STORE.score = 0;
    STORE.currentQuestion = 0;
    render();
  })
}

function main() {
  renderBaseElements();
  startQuiz();
  submitChoice();
  nextQuestion();
  restartQuiz();
  render();
}

$(main);
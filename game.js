"use strict";
let currentQuestionIndex = 0;
let currentClueIndex = 0;
let score = 100;
let streak = 0;
let totalCorrect = 0;
let shiftsUsed = 0;
let hintsUsed = 0;
let easierUsed = false;
let questionsPlayed = 0;
const totalQuestions = 10;
const clue = document.getElementById("clue");
const clueType = document.getElementById("clue-type");
const answerInput = document.getElementById("answer");

const scoreDisplay = document.getElementById("score");
const streakDisplay = document.getElementById("streak");
const questionNumber = document.getElementById("question-number");
const difficultyDisplay = document.getElementById("difficulty");

const checkButton = document.getElementById("check-button");
const shiftButton = document.getElementById("shift-button");
const easierButton = document.getElementById("easier-button");
const hintButton = document.getElementById("hint-button");

const message = document.getElementById("message");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const nextButton = document.getElementById("next-button");

const roundComplete = document.getElementById("round-complete");
const finalScore = document.getElementById("final-score");
const finalSummary = document.getElementById("final-summary");

function validateGame() {
  const requiredElements = [
    clue, clueType, answerInput,
    scoreDisplay, streakDisplay, questionNumber,
    difficultyDisplay, checkButton, shiftButton,
    easierButton, hintButton, message, messageTitle,
    messageText, nextButton, roundComplete,
    finalScore, finalSummary, playAgainButton
  ];

  if (requiredElements.some(element => !element)) {
    document.body.innerHTML =
      "<p>Clue Shift could not start. Check that index.html " +
      "contains the required game elements.</p>";
    return false;
  }

  if (
    typeof questions === "undefined" ||
    !Array.isArray(questions) ||
    questions.length < totalQuestions
  ) {
    document.body.innerHTML =
      "<p>Clue Shift could not start. Check that questions.js " +
      "contains at least 10 questions.</p>";
    return false;
  }

  return true;
}

function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

function updateScoreboard() {
  scoreDisplay.textContent = score;
  streakDisplay.textContent = streak;
  questionNumber.textContent =
    `${questionsPlayed + 1} / ${totalQuestions}`;
}

function loadQuestion() {
  const currentQuestion = getCurrentQuestion();

  if (!currentQuestion || !currentQuestion.clues?.length) {
    showMessage(
      "Question unavailable",
      "Check the question data in questions.js."
    );
    return;
  }

  currentClueIndex = 0;
  shiftsUsed = 0;
  hintsUsed = 0;
  easierUsed = false;

  clue.textContent = currentQuestion.clues[0].text;
  clueType.textContent = currentQuestion.clues[0].type;
  difficultyDisplay.textContent = currentQuestion.difficulty;

  answerInput.value = "";
  answerInput.disabled = false;

  checkButton.disabled = false;
  shiftButton.disabled = false;
  easierButton.disabled = false;
  hintButton.disabled = false;

  message.classList.add("hidden");
  nextButton.classList.add("hidden");

  shiftButton.textContent = "↻ SHIFT CLUE";
  easierButton.disabled = false;

  updateScoreboard();
  answerInput.focus();
}

function normalizeAnswer(value) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[.,!?'"-]/g, "");
}

function checkAnswer() {
  if (checkButton.disabled) return;

  const currentQuestion = getCurrentQuestion();
  const playerAnswer = normalizeAnswer(answerInput.value);
  const correctAnswer = normalizeAnswer(currentQuestion.answer);

  if (!playerAnswer) {
    showMessage(
      "Give it a try!",
      "Type your answer before checking."
    );
    return;
  }

  if (playerAnswer === correctAnswer) {
    totalCorrect++;
    streak++;

    const pointsEarned = Math.max(10, 100 - hintsUsed * 25);

    score += pointsEarned;

    showMessage(
      "🎉 Correct!",
      `${currentQuestion.answer} — You earned ${pointsEarned} points.`,
      true
    );

    answerInput.disabled = true;
    checkButton.disabled = true;
    shiftButton.disabled = true;
    easierButton.disabled = true;
    hintButton.disabled = true;
  } else {
    streak = 0;

    showMessage(
      "Not quite.",
      "Try another answer, shift the clue, or use a hint."
    );
  }

  updateScoreboard();
}

function shiftClue() {
  if (shiftButton.disabled) return;

  const currentQuestion = getCurrentQuestion();

  if (currentClueIndex < currentQuestion.clues.length - 1) {
    currentClueIndex++;

    const newClue = currentQuestion.clues[currentClueIndex];

    clue.textContent = newClue.text;
    clueType.textContent = newClue.type;

    shiftsUsed++;
    score = Math.max(0, score - 15);

    updateScoreboard();
    message.classList.add("hidden");
    answerInput.focus();
  } else {
    showMessage(
      "That's the last clue style!",
      "Try solving it with the clues you've seen."
    );
  }
}

function makeEasier() {
  if (easierButton.disabled) return;

  const currentQuestion = getCurrentQuestion();

  clue.textContent = currentQuestion.easier;
  clueType.textContent = "EASIER CLUE";

  score = Math.max(0, score - 20);
  easierUsed = true;
  easierButton.disabled = true;

  updateScoreboard();
  message.classList.add("hidden");
  answerInput.focus();
}

function giveHint() {
  if (hintButton.disabled) return;

  const currentQuestion = getCurrentQuestion();

  hintsUsed++;

  clueType.textContent = "HINT";
  clue.textContent = currentQuestion.hint;

  score = Math.max(0, score - 25);
  hintButton.disabled = true;

  updateScoreboard();
  message.classList.add("hidden");
  answerInput.focus();
}

function showMessage(title, text, canContinue = false) {
  messageTitle.textContent = title;
  messageText.textContent = text;

  // Only show NEXT after a correct answer.
  nextButton.classList.toggle("hidden", !canContinue);
  message.classList.remove("hidden");
}

function nextQuestion() {
  if (nextButton.classList.contains("hidden")) return;

  questionsPlayed++;

  if (questionsPlayed >= totalQuestions) {
    finishRound();
    return;
  }

  currentQuestionIndex++;
  loadQuestion();
}

function finishRound() {
  document.querySelector(".clue-card").classList.add("hidden");
  document.querySelector(".answer-section").classList.add("hidden");
  document.querySelector(".help-section").classList.add("hidden");
  document.querySelector(".score-bar").classList.add("hidden");

  message.classList.add("hidden");
  roundComplete.classList.remove("hidden");

  finalScore.textContent = score;
  finalSummary.textContent =
    `You solved ${totalCorrect} of ${totalQuestions} clues.`;
}

function restartGame() {
  currentQuestionIndex = 0;
  currentClueIndex = 0;
  score = 100;
  streak = 0;
  totalCorrect = 0;
  shiftsUsed = 0;
  hintsUsed = 0;
  easierUsed = false;
  questionsPlayed = 0;

  document.querySelector(".clue-card").classList.remove("hidden");
  document.querySelector(".answer-section").classList.remove("hidden");
  document.querySelector(".help-section").classList.remove("hidden");
  document.querySelector(".score-bar").classList.remove("hidden");

  roundComplete.classList.add("hidden");

  loadQuestion();
}

checkButton.addEventListener("click", checkAnswer);
shiftButton.addEventListener("click", shiftClue);
easierButton.addEventListener("click", makeEasier);
hintButton.addEventListener("click", giveHint);
nextButton.addEventListener("click", nextQuestion);
playAgainButton.addEventListener("click", restartGame);

answerInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    checkAnswer();
  }
});

if (validateGame()) {
  loadQuestion();
}

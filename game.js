let currentQuestionIndex = 0; let currentClueIndex = 0; let score = 100; let streak = 0; let totalCorrect = 0; let shiftsUsed = 0; let hintsUsed = 0; let questionsPlayed = 0;
const totalQuestions = 10;
const clue = document.getElementById("clue"); const clueType = document.getElementById("clue-type"); const answerInput = document.getElementById("answer");
const scoreDisplay = document.getElementById("score"); const streakDisplay = document.getElementById("streak"); const questionNumber = document.getElementById("question-number"); const difficultyDisplay = document.getElementById("difficulty");
const checkButton = document.getElementById("check-button"); const shiftButton = document.getElementById("shift-button"); const easierButton = document.getElementById("easier-button"); const hintButton = document.getElementById("hint-button");
const message = document.getElementById("message"); const messageTitle = document.getElementById("message-title"); const messageText = document.getElementById("message-text"); const nextButton = document.getElementById("next-button");
const roundComplete = document.getElementById("round-complete"); const finalScore = document.getElementById("final-score"); const finalSummary = document.getElementById("final-summary"); const playAgainButton = document.getElementById("play-again-button");
function getCurrentQuestion() { return questions[currentQuestionIndex]; }
function loadQuestion() {
const currentQuestion = getCurrentQuestion();
currentClueIndex = 0; shiftsUsed = 0; hintsUsed = 0;
clue.textContent = currentQuestion.clues[0].text; clueType.textContent = currentQuestion.clues[0].type;
difficultyDisplay.textContent = currentQuestion.difficulty;
questionNumber.textContent = ${questionsPlayed + 1} / ${totalQuestions};
scoreDisplay.textContent = score; streakDisplay.textContent = streak;
answerInput.value = ""; answerInput.disabled = false;
checkButton.disabled = false; shiftButton.disabled = false; easierButton.disabled = false; hintButton.disabled = false;
message.classList.add("hidden");
answerInput.focus(); }
function normalizeAnswer(value) { return value .trim() .toUpperCase() .replace(/[.,!?'"-]/g, ""); }
function checkAnswer() {
const currentQuestion = getCurrentQuestion();
const playerAnswer = normalizeAnswer(answerInput.value); const correctAnswer = normalizeAnswer(currentQuestion.answer);
if (!playerAnswer) { showMessage( "Give it a try!", "Type your answer before checking." ); return; }
if (playerAnswer === correctAnswer) {
totalCorrect++; streak++;
let pointsEarned = 100;
pointsEarned -= shiftsUsed * 15; pointsEarned -= hintsUsed * 25;
if (pointsEarned < 10) { pointsEarned = 10; }
score += pointsEarned;
showMessage( "🎉 Correct!", ${currentQuestion.answer} — You earned ${pointsEarned} points. );
answerInput.disabled = true; checkButton.disabled = true; shiftButton.disabled = true; easierButton.disabled = true; hintButton.disabled = true;
} else {
streak = 0;
showMessage( "Not quite.", "Try another approach. You can shift the clue or make it easier." ); }
scoreDisplay.textContent = score; streakDisplay.textContent = streak; }
function shiftClue() {
const currentQuestion = getCurrentQuestion();
if (currentClueIndex < currentQuestion.clues.length - 1) {
currentClueIndex++;
const newClue = currentQuestion.clues[currentClueIndex];
clue.textContent = newClue.text; clueType.textContent = newClue.type;
shiftsUsed++;
score = Math.max(0, score - 15);
scoreDisplay.textContent = score;
answerInput.focus();
} else {
showMessage( "That's the last clue style!", "Try solving it with the clues you've seen." ); } }
function makeEasier() {
const currentQuestion = getCurrentQuestion();
clue.textContent = currentQuestion.easier; clueType.textContent = "EASIER CLUE";
score = Math.max(0, score - 20);
scoreDisplay.textContent = score;
answerInput.focus(); }
function giveHint() {
const currentQuestion = getCurrentQuestion();
hintsUsed++;
clueType.textContent = "HINT";
clue.textContent = currentQuestion.hint;
score = Math.max(0, score - 25);
scoreDisplay.textContent = score;
hintButton.disabled = true;
answerInput.focus(); }
function showMessage(title, text) {
messageTitle.textContent = title; messageText.textContent = text;
message.classList.remove("hidden"); }
function nextQuestion() {
questionsPlayed++;
if (questionsPlayed >= totalQuestions) { finishRound(); return; }
currentQuestionIndex++;
if (currentQuestionIndex >= questions.length) { currentQuestionIndex = 0; }
loadQuestion(); }
function finishRound() {
document.querySelector(".clue-card").classList.add("hidden"); document.querySelector(".answer-section").classList.add("hidden"); document.querySelector(".help-section").classList.add("hidden"); document.querySelector(".score-bar").classList.add("hidden");
message.classList.add("hidden");
roundComplete.classList.remove("hidden");
finalScore.textContent = score;
finalSummary.textContent = You solved ${totalCorrect} of ${totalQuestions} clues.;
}
function restartGame() {
currentQuestionIndex = 0; currentClueIndex = 0;
score = 100; streak = 0;
totalCorrect = 0; shiftsUsed = 0; hintsUsed = 0; questionsPlayed = 0;
document.querySelector(".clue-card").classList.remove("hidden"); document.querySelector(".answer-section").classList.remove("hidden"); document.querySelector(".help-section").classList.remove("hidden"); document.querySelector(".score-bar").classList.remove("hidden");
roundComplete.classList.add("hidden");
loadQuestion(); }
checkButton.addEventListener("click", checkAnswer);
shiftButton.addEventListener("click", shiftClue);
easierButton.addEventListener("click", makeEasier);
hintButton.addEventListener("click", giveHint);
nextButton.addEventListener("click", nextQuestion);
playAgainButton.addEventListener("click", restartGame);
answerInput.addEventListener("keydown", function(event) {
if (event.key === "Enter") { checkAnswer(); }
});
loadQuestion();

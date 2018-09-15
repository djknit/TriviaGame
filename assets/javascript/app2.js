class Question {
    constructor(question, correctAnswer, wrongAnswers, image) {
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswers;
        this.image = "assets/images/" + image;
        this.time = 24;
    }

    shuffleAnswers() {
        var answersToShuffle = this.wrongAnswers.slice();
        answersToShuffle.push(this.correctAnswer);
        var shuffledAnswers = [];
        for (var i = 0; i < this.wrongAnswers.length + 1; i++) {
            var randomIndex = Math.floor(Math.random() * answersToShuffle.length);
            shuffledAnswers.push(answersToShuffle[randomIndex]);
            answersToShuffle.splice(randomIndex, 1);
        }
        return shuffledAnswers;
    }

    createAnswersDisplay() {
        var answersDisplay = $("<div id='answers'>");
        var shuffledAnswers = this.shuffleAnswers();
        for (var i = 0; i < shuffledAnswers.length; i++) {
            var newP = $("<p class='answer'>");
            newP.html(shuffledAnswers[i]);
            if (shuffledAnswers[i] === this.correctAnswer) {
                newP.addClass("correct_answer");
            }
            else {
                newP.addClass("wrong_answer");
            }
            answersDisplay.append(newP);
        }
        return answersDisplay;
    }

    display() {
        $("#timer").html(this.time + " seconds remaining");
        $("#question").html(this.question);
        $("#info_area").empty().append(this.createAnswersDisplay());
    }
}

var questions = [];
questions.push(new Question("1: What is the answer to this question?", "A", ["B", "C", "D"], "388x291.png"));
questions.push(new Question("2: What is the answer to this question?", "B", ["A", "C", "D"], "388x291.png"));
questions.push(new Question("3: What is the answer to this question?", "C", ["B", "A", "D"], "388x291.png"));
questions.push(new Question("4: What is the answer to this question?", "D", ["B", "C", "A"], "388x291.png"));

var numberOfQuestions = 10;
var category = 19;
var difficulty = "medium";
var queryURL = `https://opentdb.com/api.php?amount=${numberOfQuestions}&category=${category}&difficulty=${difficulty}&type=multiple`;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    questions = [];
    for (var i = 0; i < numberOfQuestions; i++) {
        var result = response.results[i];
        questions.push(new Question(result.question, result.correct_answer, result.incorrect_answers, "388x291.png"));
    }
});


var startButton = $("<button id='start_button'>Start Quiz</button>");

var numCorrect;
var numIncorrect;
var numUnanswered;
var timeLeft;
var questionIndex;

$(document).ready(function() {
    newGame();
    $("#info_area").empty().append(startButton);
});

function newGame() {
    numCorrect = 0;
    numIncorrect = 0;
    numUnanswered = 0;
    questionIndex = 0;
    $("#question").empty().removeClass("no_bottom_margin");
}

$(document).on("click", "#start_button", startQuiz);

function startQuiz() {
    askQuestion(questions[0]);
}

function askQuestion(question) {
    $("#question").removeClass("no_bottom_margin")
    question.display();
    timeLeft = question.time;
    startTimer();
}

function startTimer() {
    intervalId = setInterval(decrement, 1000);
}

function decrement() {
    timeLeft--;
    $("#timer").html(timeLeft + " seconds remaining");
    if (timeLeft === 0) {
        outOfTime();
    }
}

$(document).on("click", ".correct_answer", correctAnswer);

$(document).on("click", ".wrong_answer", wrongAnswer);

function outOfTime() {
    stopTimer();
    numUnanswered++;
    $("#question").html("You're out of time.").addClass("no_bottom_margin");
    $("#info_area").empty().append($("<p class='missed_answer'>The correct answer was " + questions[questionIndex].correctAnswer + ".</p>"));
    displayImageAndMoveOn();
}

function correctAnswer() {
    stopTimer();
    numCorrect++;
    $("#question").html("Correct!");
    $("#info_area").empty();
    displayImageAndMoveOn();
}

function wrongAnswer() {
    stopTimer();
    numIncorrect++;
    $("#question").html("Wrong").addClass("no_bottom_margin");
    $("#info_area").empty().append($("<p class='missed_answer'>The correct answer was " + questions[questionIndex].correctAnswer + ".</p>"));
    displayImageAndMoveOn();
}

function stopTimer() {
    clearInterval(intervalId);
}

function displayImageAndMoveOn() {
    var image = $("<img>");
    image.attr("src", questions[questionIndex].image);
    $("#info_area").append(image);
    var timoutId = setTimeout(function() {
        if (questionIndex < questions.length - 1) {
            questionIndex++;
            askQuestion(questions[questionIndex]);
        }
        else {
            endQuiz()
        }
    }, 5000);
}

function endQuiz() {
    $("#timer").html("You finished the quiz.");
    $("#question").html("Here are your results!");
    var numCorrectDisplay = $("<p class='.missed_answer'>").html("Correct Answers: " + numCorrect);
    var numIncorrectDisplay = $("<p class='.missed_answer'>").html("Incorrect Answers: " + numIncorrect);
    var numUnansweredDisplay = $("<p class='.missed_answer'>").html("Unanswered: " + numUnanswered);
    var startOver = $("<p id='start_over'>").html("Start Over?");
    $("#info_area").empty().append(numCorrectDisplay).append(numIncorrectDisplay).append(numUnansweredDisplay).append(startOver);
}

$(document).on("click", "#start_over", startOver);

function startOver() {
    newGame();
    startQuiz();
}
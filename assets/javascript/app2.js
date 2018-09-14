class Question {
    constructor(question, correctAnswer, wrongAnswers, image) {
        this.question = question;
        this.correctAnswer = correctAnswer;
        this.wrongAnswers = wrongAnswer;
        this.image = "assets/images/" + image;
        this.time = 30;
    }
}
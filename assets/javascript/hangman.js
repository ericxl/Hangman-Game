const HangmanGame = function () {

    var numWins = 0,
        numLosses = 0;
    var keyEnabled = true;

    var answer, answer_string, answer_array;
    var guesses_string, guesses_array, numTriesLeft;

    this.startNewGame = function () {
        answer = getWord().toLowerCase();
        const answer_length = answer.length;

        answer_string = "_".repeat(answer_length);
        answer_array = answer_string.split("");

        updateAnswerString();

        guesses_string = "";
        guesses_array = [];

        numTriesLeft = Math.max(6, Math.min(13 - Math.ceil(answer_length / 2), 10));

        displayNumWins();
        displayNumLosses();
        displayNumTriesLeft();
        displayGuesses();
    }


    this.displayLightBox = function (lightBoxOn) {
        this.updateKeyEnabled(!lightBoxOn);

        $("#lightBox_background, #lightBox").css({
            "display": (lightBoxOn) ? "block" : "none"
        });
    }

    function displayProgress() {
        $("#answerProgress").text(answer_string);
    }

    function displayNumWins() {
        $("#numWins").text(numWins);
    }

    function displayNumLosses() {
        $("#numLosses").text(numLosses);
    }

    function displayNumTriesLeft() {
        $("#numTriesLeft").text(numTriesLeft);
    }

    function displayGuesses() {
        $("#guesses").text(guesses_string);
    }


    this.updateKeyEnabled = function (changeTo) {
        keyEnabled = changeTo;
    }

    function updateAnswerString() {
        answer_string = answer_array.join("");

        displayProgress();
    }

    function updateGuesses(changeBy) {
        guesses_string += changeBy;
        guesses_array.push(changeBy);

        displayGuesses();
    }

    function updateNumTriesLeft(changeBy) {
        numTriesLeft += changeBy;

        displayNumTriesLeft();
    }

    this.isKeyEnabled = function () {
        return keyEnabled;
    }

    function isGuessNew(x) {
        return !guesses_array.includes(x);
    }

    this.checkProgress = function (letter) {
        if (isGuessNew(letter)) {

      
            let index = answer.indexOf(letter);

            if (index === -1) {
                updateNumTriesLeft(-1);

                var audioElement = document.createElement("audio");
                audioElement.setAttribute("src", "assets/sounds/wrong.wav");
                audioElement.play();

            } else {
                while (index >= 0) {
                    answer_array[index] = letter;

                    index = answer.indexOf(letter, index + 1);
                }

                updateAnswerString();

                var audioElement = document.createElement("audio");
                audioElement.setAttribute("src", "assets/sounds/correct.wav");
                audioElement.play();

            }

            updateGuesses(letter);

            if (answer_string === answer) {
                numWins++;

                $("#outputMessage").html(`Yep, it was <strong>${answer}</strong>!<br>Press any key to continue.`);
                $("#lightBox").css({
                    "animation-name": "slide_down",
                    "background-color": "var(--color-mint-green)"
                });
                $("#lightBox strong").css({
                    "color": "#fff896"
                });

                this.displayLightBox(true);

                this.startNewGame();

            } else if (numTriesLeft === 0) {
                numLosses++;

                $("#outputMessage").html(`Nah, it was <strong>${answer}</strong>!<br>Press any key to continue.`);
                $("#lightBox").css({
                    "animation-name": "shake",
                    "background-color": "var(--color-danger-red)"
                });
                $("#lightBox strong").css({
                    "color": "#beffad"
                });

                this.displayLightBox(true);

                this.startNewGame();

            }
        }
    }
}


let game;

$(document).ready(function () {
    game = new HangmanGame();

    game.startNewGame();

    $(document).on("keypress", event => {
        if (!game.isKeyEnabled()) {
            game.updateKeyEnabled(true);
            game.displayLightBox(false);

            return;
        }

        const letter = String.fromCharCode(event.which).toLowerCase();

        if ("a" <= letter && letter <= "z") {
            game.checkProgress(letter);
        }
    });

    $("#lightBox_background, #lightBox").on("click", function () {
        game.displayLightBox(false);
    });
});

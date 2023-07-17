document.addEventListener("DOMContentLoaded", function() {
    const totalLevels = 10; // Total number of difficulty levels
    let currentLevel = 1; // Default level
    let imageNames = []; // Image names for the current level will be stored here
    const imgFolderPath = "Img/"; // Adjust the folder path based on your folder structure

    const quizContainer = document.querySelector(".container");
    const questionImage = document.getElementById("question-image");
    const answerOptionsContainer = document.getElementById("answer-options");
    const submitButton = document.getElementById("submit-btn");
    const scoreDisplay = document.getElementById("score");
    const totalDisplay = document.getElementById("total");
    //const badAnswersDisplay = document.getElementById("bad-answers");
    const timerDisplay = document.getElementById("timer");

    let currentImageIndex = 0;
    let score = 0;
    let total=0;
    let badAnswers = 0;
    let timerInterval;
    let seconds = 0;

    function shuffleArray(array) {
        // Function to shuffle an array using the Fisher-Yates algorithm
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            timerDisplay.innerText = seconds + "s";
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    function loadImagesForLevel() {
        // Load image names for the current level
        imageNames = [];
        for (let i = 0; i < currentLevel * 10; i++) {
            const imageName = String(i).padStart(2, "0") + ".png"; // Assuming the image names are "00.png" to "99.png"
            imageNames.push(imageName);
        }
        shuffleArray(imageNames);
    }

    function showNextQuestion() {
        if (currentImageIndex < imageNames.length) {
            const imageName = imageNames[currentImageIndex];
            questionImage.src = imgFolderPath + imageName;

            // Generate random answer options (including the correct answer)
            const options = [];
            const correctAnswer = imageName.split(".")[0];
            options.push(correctAnswer);

            while (options.length < 4) {
                const randomAnswer = imageNames[Math.floor(Math.random() * imageNames.length)].split(".")[0];
                if (!options.includes(randomAnswer)) {
                    options.push(randomAnswer);
                }
            }

            shuffleArray(options);
            
            // Clear previous answer options
            answerOptionsContainer.innerHTML = "";

            // Create buttons for each answer option
            options.forEach((option) => {
                const optionButton = document.createElement("button");
                optionButton.innerText = option;
                optionButton.addEventListener("click", () => checkAnswer(option));
                answerOptionsContainer.appendChild(optionButton);
            });

            if (currentImageIndex === 0) {
                // Start the timer on the first question
                startTimer();
            }
        } else {
            // Quiz finished for the current level
            alert("Niveau " + currentLevel + " terminé ! Votre score est de " + score + " sur " + imageNames.length + " en " + seconds + "secondes" );
            stopTimer();

            // Move to the next level
            //currentLevel++;
            //if (currentLevel <= totalLevels) {
            //    loadImagesForLevel();
            //    currentImageIndex = 0;
            //    showNextQuestion();
            //} else {
            //    // Game finished
            //    alert("Félicitations ! Vous avez terminé tous les niveaux.");
            //    // Redirect back to the difficulty selection page after completing all levels
            //    window.location.href = "index.html";
            //}

            //Move au choix de difficultés
            window.location.href = "quizz-difficulte.html";

        }
    }

    function checkAnswer(selectedAnswer) {
        const imageName = imageNames[currentImageIndex].split(".")[0];
        total++; //On incrémente le nombre de réponse données
        if (selectedAnswer === imageName) {
            // Show correct feedback
            const feedbackCorrect = document.querySelector(".feedback-correct");
            feedbackCorrect.style.display = "block";
            setTimeout(() => {
                feedbackCorrect.style.display = "none";
            }, 1000); // Hide feedback after 1 second
    
            score++; // Increment the score for correct answers
            scoreDisplay.innerText = "Score : " + score + "/" + total;
        } else {
            // Show incorrect feedback
            const feedbackIncorrect = document.querySelector(".feedback-incorrect");
            feedbackIncorrect.innerText += " " + imageName;
            feedbackIncorrect.style.display = "block";
            setTimeout(() => {
                feedbackIncorrect.style.display = "none";
                feedbackIncorrect.innerText = "Incorrect. La bonne réponse était :";
            }, 2000); // Hide feedback after 2 seconds
            scoreDisplay.innerText = "Score : " + score + "/" + total;
            //badAnswers++; // Increment bad answers count
            //badAnswersDisplay.innerText = "Mauvaises réponses : " + badAnswers;
        }
    
        currentImageIndex++;
        showNextQuestion();
    }
    

    // Function to start the quiz with the selected difficulty level
    function startQuiz() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const level = parseInt(urlParams.get('level'));

        if (!isNaN(level) && level >= 1 && level <= totalLevels) {
            currentLevel = level;
            loadImagesForLevel();
            currentImageIndex = 0;
            score = 0;
            badAnswers = 0;
            seconds = 0;
            scoreDisplay.innerText = "Score : " + score + "/" + total;
            //badAnswersDisplay.innerText = "Mauvaises réponses : " + badAnswers;
            timerDisplay.innerText = "0s";
            quizContainer.style.display = "block";
            showNextQuestion();
        } else {
            alert("Niveau de difficulté invalide.");
            // Redirect back to the difficulty selection page if level is invalid or not provided
            window.location.href = "quizz-difficulte.html";
        }
    }

    function goToDifficultySelection() {
        // Rediriger l'utilisateur vers la page de choix de difficulté
        window.location.href = "quizz-difficulte.html";
    }

    // Gérer le clic sur le bouton "Revenir au choix de difficulté"
    const backToDifficultyBtn = document.getElementById("back-to-difficulty-btn");
    backToDifficultyBtn.addEventListener("click", goToDifficultySelection);

    // Start the quiz when the page is loaded
    startQuiz();
});



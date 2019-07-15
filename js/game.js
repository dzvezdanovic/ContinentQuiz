let score = 0;
let questions = [];
let numberOfQuestion = 0;
let continents = [
    'Africa', 'Asia', 'South America', 'North America', 'Europe',
    'Oceania', 'Antarctica'
];

let currentQuestion, currentAnswers;

function prepareQuiz() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.myjson.com/bins/a6da9", true);
    xhttp.send();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const response = this.responseText;
            questions = JSON.parse(response);

            nextQuestion();
        }
    };
}

function nextQuestion() {
    document.getElementById("next").style.display = "none";

    if (numberOfQuestion === 5) {
        showResultPage();
        return;
    }

    numberOfQuestion++;

    const q = Math.floor(Math.random() * questions.length);
    const question = questions[q];
    console.log(question);

    const answers = [question.continent];

    const posibleAnswers = [];
    for (let i = 0; i < continents.length; i++) {
        if (continents[i] !== question.continent) {
            posibleAnswers.push(continents[i]);
        }
    }

    let r = Math.floor(Math.random() * posibleAnswers.length);
    answers.push(posibleAnswers[r]);
    posibleAnswers.splice(r, 1);

    r = Math.floor(Math.random() * posibleAnswers.length);
    answers.push(posibleAnswers[r]);

    console.log(answers);
    shuffle(answers);
    console.log(answers);

    questions.splice(q, 1);

    currentQuestion = question;
    currentAnswers = answers;

    showQuestion(question, answers);
}

function showQuestion(question, answers) {
    document.getElementById("question-no").innerHTML = `
        Question ${numberOfQuestion} of 5
    `;

    let questionHtml = `
        <div class="image">
            <img src="${question.image}" alt="">
        </div>
        <div id="answers" class="answers">`;

    for (let i = 0; i < answers.length; i++) {
        questionHtml += `
            <div onclick="submitQuestion(${i})" class="answer-default">
                <i class="material-icons yellow-color">
                    category
                </i>
                <span class="continent">${answers[i]}</span>
            </div>`;
    }

    questionHtml += `</div>`;

    document.getElementById("question").innerHTML = questionHtml;
}

function submitQuestion(index) {
    console.log(currentAnswers[index]);

    if (currentAnswers[index] === currentQuestion.continent) {
        score += 750;
    }

    let answersHtml = "";
    let classType, icon, yellowColor;
    for (let i = 0; i < currentAnswers.length; i++) {
        classType = "default";
        icon = "";
        yellowColor = "yellow-color";

        if (i == index) {
            classType = "selected";
            yellowColor = "";

            if (currentAnswers[index] === currentQuestion.continent) {
                icon = `<i class="material-icons correct">
                    done
                </i>`;
            } else {
                icon = `<i class="material-icons wrong">
                    clear
                </i>`;
            }
        } else if (currentAnswers[i] === currentQuestion.continent) {
            icon = `<i class="material-icons correct">
                done
            </i>`;
        }

        answersHtml += `
            <div class="answer-${classType}">
                <i class="material-icons ${yellowColor}">
                    category
                </i>
                <span class="continent">${currentAnswers[i]}</span>
                ${icon}
            </div>
        `;
    }

    document.getElementById("answers").innerHTML = answersHtml;
    document.getElementById("next").style.display = "block";
}

function showResultPage() {
    document.getElementById("quiz").innerHTML = "VACATION QUIZ";
    document.getElementById("question-no").innerHTML = "Results";

    const questionHtml = `
        <div class="geometry">
            <i class="material-icons blue-color">
                category
            </i>
        </div>
        <div class="your-score">
            Your score
        </div>
        <div class="result">
            ${score} pts
        </div>
        <div onclick="finish()" class="finish">
            Finish
        </div>`;

    document.getElementById("question").innerHTML = questionHtml;
}

function finish() {
    newScore = {
        date: new Date(),
        pts: score
    };

    addScoreToLS(newScore);
    window.location = "index.html";
}

function addScoreToLS(score) { // score : { date: "06/07/2018", pts: 2500 }
    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    if (results === null || results.length === 0) {
        results = [score];
    } else {

        let flag = false;

        for (let i = 0; i < results.length; i++) {
            if (score.pts >= results[i].pts) {
                results.splice(i, 0, score);
                flag = true;
                break;
            }
        }

        if (!flag && results.length < 3) {
            results.push(score);
        } else if (results.length === 4) {
            results.pop();
        }
    }

    localStorage.setItem("results", JSON.stringify(results));
}

function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}
let questions = {};
let strikesModal = document.getElementById("strikes-modal");
let errorSound = document.getElementById("error-sound");
let popUpSound = document.getElementById("popup-sound");
let foundAnswerSound = document.getElementById("found-sound");
let winnerSound = document.getElementById("winner-sound");
let currentQuestionIdx;

window.onload = getQuestions();

async function getQuestions() {
	try {
		const questionsApi = "http://localhost:8080/api/get-all-questions";
		const questionsResponse = await fetch(questionsApi);

		if (!questionsResponse.ok) {
			console.log(questionsResponse.text());
		}

		questions = await questionsResponse.json();
		console.log(questions)

	} catch (e) {
		console.log(e);
	}
}

function clearScreen() {
	let allCurrentAnswers = document.getElementsByClassName("answer");

	while (allCurrentAnswers.length > 0) {
		allCurrentAnswers[0].remove();
	}

	document.getElementById("team-1-score").innerText = "0";
	document.getElementById("team-2-score").innerText = "0";
	document.getElementById("round-score").innerText = "0";

	let questionTitle = document.getElementById("current-question");
	questionTitle.innerText = "";
}

function showCurrentQuestion(idx) {
	let allCurrentAnswers = document.getElementsByClassName("answer");

	while (allCurrentAnswers.length > 0) {
		allCurrentAnswers[0].remove();
	}

	currentQuestionIdx = idx;
	let questionTitle = document.getElementById("current-question");
	questionTitle.innerText = questions[idx]["question"];
	createAnswerElements(questions[idx]["answers"]);
	popUpSound.play();
}

function createAnswerElements(answers) {
	let answersDiv = document.getElementById("answers-container");
	for (let i = 0; i < answers.length; i++) {
		let newDiv = document.createElement("div");
		newDiv.setAttribute("class", "answer");
		let pElement1 = document.createElement("p");
		pElement1.setAttribute("id", "answer-" + String(i));
		pElement1.innerText = answers[i][i+1][0]["text"];

		let pElement2 = document.createElement("p");
		pElement2.setAttribute("id", "value-" + String(i));
		pElement2.setAttribute("class", "score");
		pElement2.innerText = answers[i][i+1][1]["value"];

		newDiv.appendChild(pElement1);
		newDiv.appendChild(pElement2);
		answersDiv.appendChild(newDiv);
	}
}

function flipAnswer(idx) {
	let answerElementName = "answer-" + String(idx);
	let scoreElementName = "value-" + String(idx);
	let answerElement = document.getElementById(answerElementName);
	let scoreElement = document.getElementById(scoreElementName);

	if (answerElement.getAttribute("class") === "visible") {
		answerElement.style.display = "none";
		scoreElement.style.display = "none";
		answerElement.removeAttribute("class")
	} else {
		answerElement.style.display = "block";
		scoreElement.style.display = "block";
		answerElement.setAttribute("class", "visible");
		foundAnswerSound.play();
	}
}

function setTeam1Score(score) {
	document.getElementById("team-1-score").innerText = String (score);
}

function setRoundScore(score) {
	document.getElementById("round-score").innerText = String (score);
}

function setTeam2Score(score) {
	document.getElementById("team-2-score").innerText = String (score);
}

function showWinner(winner) {
	let allCurrentAnswers = document.getElementsByClassName("answer");

	while (allCurrentAnswers.length > 0) {
		allCurrentAnswers[0].remove();
	}

	let div = document.getElementById("answers-container");
	let pElement = document.createElement("p");
	pElement.style.fontSize = "10vw";

	if (winner === "team-1") {
		pElement.innerText = "Ganador: ¡Equipo 1!"
	} else {
		pElement.innerText = "Ganador: ¡Equipo 2!"
	}

	let questionTitle = document.getElementById("current-question");
	questionTitle.innerText = "Fin del juego";
	div.appendChild(pElement)
	winnerSound.play();
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function showStrikeModal(amount) {
	for (let i = 0; i < amount; i++) {
		document.getElementById("current-strikes").innerText += "X"
	}

	errorSound.play();
	strikesModal.style.display = "block";

	sleep(2000).then(() => {
		strikesModal.style.display = "block";
		document.getElementById("current-strikes").innerText = "";
	});
}

export {setTeam1Score, setRoundScore, setTeam2Score, showCurrentQuestion, flipAnswer, showWinner, clearScreen, showStrikeModal}
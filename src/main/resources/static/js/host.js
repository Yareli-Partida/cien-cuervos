import {sendMessage} from "./stompScriptHost.js";

let questions = {};
let startGame1Button = document.getElementById("start-game-1");
let startGame2Button = document.getElementById("start-game-2");
let goBackToHomePageButton = document.getElementById("go-home-page");
let returnToMenuButton = document.getElementById("return-menu");
let nextQuestion = document.getElementById("next-question");
let endGameButton = document.getElementById("end-game");
let winnersReturnToMenuButton = document.getElementById("winner-return-menu");
let currentQuestionIndex = 0;

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

function hideMenuItems() {
	let menuItems = document.body.getElementsByClassName("menu-item");
	for (let i = 0; i < menuItems.length; i++) {
		menuItems.item(i).style.display = "none";
	}
}

function showMenuItems() {
	let menuItems = document.body.getElementsByClassName("menu-item");
	for (let i = 0; i < menuItems.length; i++) {
		menuItems.item(i).style.display = "block";
	}
}

function updateQuestionData() {
	if (currentQuestionIndex < 10) {
		document.getElementById("title-question").innerText = "Pregunta #" + String(currentQuestionIndex + 1) + ":";
	} else {
		document.getElementById("title-question").innerText = "Pregunta #" + String(currentQuestionIndex - 9) + ":";
	}
	document.getElementById("current-question").innerText = questions[currentQuestionIndex]["question"];
}

function createAnswersElements() {
	let answersDiv = document.getElementById("show-answers-container");
	let answersArray = questions[currentQuestionIndex]["answers"];
	for (let i = 0; i < answersArray.length; i++) {
		let newDiv = document.createElement("div")
		newDiv.setAttribute("class", "answer")
		let pElement = document.createElement("p");
		pElement.style.flexGrow = 1;
		pElement.style.color = "red";
		pElement.setAttribute("id", "answer-" + String(i))
		let pElement2 = document.createElement("p");
		pElement2.style.flexGrow = 1;
		pElement2.setAttribute("class", "score-p")
		pElement2.setAttribute("id", "score-" + String(i))

		pElement.innerText = answersArray[i][i+1][0]["text"];
		pElement2.innerText = answersArray[i][i+1][1]["value"];

		let labelId = "check-button-" + i

		newDiv.appendChild(pElement)
		newDiv.appendChild(pElement2)
		newDiv.innerHTML += '<!-- From Uiverse.io by SelfMadeSystem --> \n' +
			'<label class="container" id=${labelId}>\n' +
			`  <input type="checkbox" id=${labelId}>\n\n` +
			'  <svg viewBox="0 0 64 64" height="1rem" width="1.5rem" fill="black">\n' +
			'    <path d="M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16" pathLength="575.0541381835938" class="path"></path>\n' +
			'  </svg>\n' +
			'</label>'
		answersDiv.appendChild(newDiv);

		document.getElementById("check-button-"+i).addEventListener("click", e => {
			let answerText = document.getElementById("answer-" + i);
			let score = parseInt(document.getElementById("score-" + i).innerText.toString());
			let totalRoundPointsElements = document.getElementById("current-round-points");
			let currentScore = parseInt(totalRoundPointsElements.innerText.toString());

			if (answerText.getAttribute("class", "found-answers") === null) {
				answerText.style.color = "green";
				answerText.setAttribute("class", "found-answers");

				totalRoundPointsElements.innerText = String(score+currentScore);

				sendMessage({"flipAnswerCard": i});
				sendMessage({"roundPoints": totalRoundPointsElements.innerText});
			} else {
				answerText.style.color = "red";
				answerText.removeAttribute("class");

				totalRoundPointsElements.innerText = String(currentScore-score);

				sendMessage({"flipAnswerCard": i});
				sendMessage({"roundPoints": totalRoundPointsElements.innerText});
			}
		})
	}
}

function removeAnswers() {
	let allAnswerDivs = document.getElementsByClassName("answer");

	while (allAnswerDivs.length > 0) {
		allAnswerDivs[0].remove()
	}
}

startGame1Button.addEventListener("click", e => {
	hideMenuItems();
	document.getElementById("show-questions-container").style.display = "flex";
	currentQuestionIndex = 0;
	updateQuestionData()
	nextQuestion.style.display = "block";
	document.getElementById("end-game").style.display = "none"

	createAnswersElements();

	sendMessage({"questionIdx": currentQuestionIndex});
})

startGame2Button.addEventListener("click", e => {
	hideMenuItems();
	document.getElementById("show-questions-container").style.display = "flex";
	currentQuestionIndex = 10;
	updateQuestionData();
	nextQuestion.style.display = "block";
	document.getElementById("end-game").style.display = "none"

	createAnswersElements();

	sendMessage({"questionIdx": currentQuestionIndex});
});

goBackToHomePageButton.addEventListener("click", e => {
	window.location.replace("http://localhost:8080");
});

returnToMenuButton.addEventListener("click", e => {
	sendMessage({"state": "menu"});
	document.getElementById("show-questions-container").style.display = "none"
	document.getElementById("score-team-1").innerText = "0"
	document.getElementById("score-team-2").innerText = "0"
	document.getElementById("current-round-points").innerText = "0"
	removeAnswers()
	showMenuItems()
});

nextQuestion.addEventListener("click", async e => {
	let finalRoundPoints = document.getElementById("current-round-points");
	document.getElementById("modalFinalRoundPoints").innerText = finalRoundPoints.innerText;
	const result = await showModalAsync();

	if (result === null) {
		currentQuestionIndex += 1;
		updateQuestionData();
		removeAnswers();
		createAnswersElements();
		finalRoundPoints.innerText = "0";

		if (currentQuestionIndex === 9 || currentQuestionIndex === 19) {
			nextQuestion.style.display = "none";
			document.getElementById("end-game").style.display = "block";
		}

		sendMessage({"questionIdx": currentQuestionIndex})
	}
});

endGameButton.addEventListener("click", e => {
	let finalTeam1Score = parseInt(document.getElementById("score-team-1").innerText);
	let finalTeam2Score = parseInt(document.getElementById("score-team-2").innerText);
	let winningTeamP = document.getElementById("winning-team");

	console.log("1 team score " + finalTeam1Score)
	console.log("2 team score " + finalTeam2Score)

	console.log("is 1 larger than 2 " + finalTeam1Score > finalTeam2Score)

	winnersModal.style.display = "block";

	if (finalTeam1Score > finalTeam2Score) {
		winningTeamP.innerText = "¡Equipo #1!";
		sendMessage({"gameOver": "team-1"});
	} else {
		winningTeamP.innerText = "¡Equipo #2!";
		sendMessage({"gameOver": "team-2"});
	}
});

winnersReturnToMenuButton.addEventListener("click", e => {
	sendMessage({"state": "menu"});
	document.getElementById("show-questions-container").style.display = "none";
	winnersModal.style.display = "none";
	document.getElementById("score-team-1").innerText = "0";
	document.getElementById("score-team-2").innerText = "0";
	document.getElementById("current-round-points").innerText = "0";
	removeAnswers();
	showMenuItems();
});


async function showModalAsync() {
	return new Promise((resolve) => {
		modal.style.display = "block";

		let team1Button = document.getElementById("modalAssignTeam1");
		let team2Button = document.getElementById("modalAssignTeam2");
		let exitModalButton = document.getElementById("exitModal");

		function onClickTeam1() {
			let scoreTeam1Element = document.getElementById("score-team-1")
			let score = parseInt(scoreTeam1Element.innerText.toString())
			let totalRoundScore = parseInt(document.getElementById("current-round-points").innerText.toString())
			scoreTeam1Element.innerText = String(score+totalRoundScore);
			modal.style.display = "none"
			team1Button.removeEventListener("click", onClickTeam1)
			team2Button.removeEventListener("click", onClickTeam2);
			exitModalButton.removeEventListener("click", onExitModal);
			sendMessage({"team1Points": String(score+totalRoundScore)});
			resolve(null)
		}

		function onClickTeam2() {
			let scoreTeam2Element = document.getElementById("score-team-2")
			let score = parseInt(scoreTeam2Element.innerText.toString())
			let totalRoundScore = parseInt(document.getElementById("current-round-points").innerText.toString())
			scoreTeam2Element.innerText = String(score+totalRoundScore);
			modal.style.display = "none";
			team1Button.removeEventListener("click", onClickTeam1)
			team2Button.removeEventListener("click", onClickTeam2);
			endGameButton.removeEventListener("click", onExitModal);
			sendMessage({"team2Points": String(score+totalRoundScore)});
			resolve(null);
		}

		function onExitModal() {
			modal.style.display = "none";
			team1Button.removeEventListener("click", onClickTeam1)
			team2Button.removeEventListener("click", onClickTeam2);
			exitModalButton.removeEventListener("click", onExitModal);
			resolve("abort");
		}

		team1Button.addEventListener("click", onClickTeam1)
		team2Button.addEventListener("click", onClickTeam2)
		exitModalButton.addEventListener("click", onExitModal)
	})
}

let modal = document.getElementById("assignPointsModal");
let winnersModal = document.getElementById("winnerModal");
import {setTeam2Score, setTeam1Score, setRoundScore, showCurrentQuestion, flipAnswer, showWinner, clearScreen} from "./gameroom.js";


let id = 1; // fix this later
let stompClient = null;
window.onload = connect();

function connect() {
	let socket = new SockJS('/sala');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/messages/' + id, function(messageOutput) {
			let body = JSON.parse(messageOutput.body);

			if (body.hasOwnProperty("message")) {
				if (body.message.hasOwnProperty("questionIdx")) {
					showCurrentQuestion(body.message.questionIdx)
				} else if (body.message.hasOwnProperty("flipAnswerCard")) {
					flipAnswer(body.message.flipAnswerCard)
				} else if (body.message.hasOwnProperty("roundPoints")) {
					setRoundScore(body.message.roundPoints)
				} else if (body.message.hasOwnProperty("team1Points")) {
					setTeam1Score(body.message.team1Points);
					setRoundScore("0");
				} else if (body.message.hasOwnProperty("team2Points")) {
					setTeam2Score(body.message.team2Points);
					setRoundScore("0");
				} else if (body.message.hasOwnProperty("state")) {
					if (body.message.state === "menu") {
						window.location.reload();
					}
				} else if (body.message.hasOwnProperty("gameOver")) {
					showWinner(body.message.gameOver);
				}
			}
		});
	});
}

function sendMessage(message) {
	stompClient.send("/app/sala/" + id, {},
		JSON.stringify({'message': message}
		));
}

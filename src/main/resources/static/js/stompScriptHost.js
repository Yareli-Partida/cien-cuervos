let stompClient = null;
let id = 1;
window.onload = connect();

function connect() {
	let socket = new SockJS('/sala');
	stompClient = Stomp.over(socket);
	stompClient.connect({}, function(frame) {
		console.log('Connected: ' + frame);
		stompClient.subscribe('/topic/messages/' + id, function(messageOutput) {
			let body = JSON.parse(messageOutput.body);
		});
	});
}

function sendMessage(message) {
	stompClient.send("/app/sala/" + id, {},
		JSON.stringify({'message': message}
		));
}

export {sendMessage}

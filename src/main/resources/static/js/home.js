let hostButton = document.getElementById("host");

let audienceButton = document.getElementById("audience");

hostButton.addEventListener("click", function () {
	window.location.replace("http://localhost:8080/host")
})

audienceButton.addEventListener("click", function () {
	window.location.replace("http://localhost:8080/gameroom")
})
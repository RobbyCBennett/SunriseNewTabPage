function fadeOut(element) {
	var opacity = 1;
	var timer = setInterval(function() {
		if (opacity < 0.1){
			clearInterval(timer);
			opacity = 0;
		}
		console.log(opacity);
		element.style.opacity = opacity;
		opacity -= 0.1;
	}, 100);
}

function fadeIn(element) {
	var opacity = 0;
	var timer = setInterval(function () {
		if (opacity > 0.91){
			clearInterval(timer);
			opacity = 1;
		}
		console.log(opacity);
		element.style.opacity = opacity;
		opacity += 0.1;
	}, 100);
}

function fade(element) {
	fadeIn(element);
	fadeOut(element);
}

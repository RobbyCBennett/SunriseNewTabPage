function updateColorPickers() {
	var inputs = document.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.type == 'color') {
			input.style.background = input.value;
		}
	}
}

// Change color on clicking out
var inputs = document.getElementsByTagName('input');
for (var i = 0; i < inputs.length; i++) {
	var input = inputs[i];
	if (input.type == 'color') {
		input.addEventListener('blur', function(event) {
			updateColorPickers();
		});
	}
}

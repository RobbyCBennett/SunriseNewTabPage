function rangeNumbersInit() {
	var containers = document.getElementsByClassName('rangeNumbers');
	var rangeMins = document.getElementsByClassName('rangeNumbersMin');
	var rangeMaxes = document.getElementsByClassName('rangeNumbersMax');

	if (containers.length == rangeMins.length && rangeMins.length == rangeMaxes.length) {
		for (var i = 0; i < containers.length; i++) {
			var container = containers[i];

			var range = container.getElementsByTagName('input')[0];
			var min = range.min;
			var max = range.max;
			var multiplier = range.dataset.multiplier;
			var unit = range.dataset.unit;

			if (multiplier != undefined) {
				min = min * multiplier;
				max = max * multiplier;
			}
			if (unit != undefined) {
				min = min + unit;
				max = max + unit;
			}
			rangeMins[i].innerHTML = min;
			rangeMaxes[i].innerHTML = max;
		}
	}
}

function rangeNumbersLive() {
	var containers = document.getElementsByClassName('rangeNumbers');

	for (var i = 0; i < containers.length; i++) {
		var container = containers[i];

		var range = container.getElementsByTagName('input')[0];
		var multiplier = range.dataset.multiplier;
		var unit = range.dataset.unit;

		text = range.value;

		if (multiplier != undefined) {
			text = text * multiplier;
			text = text * multiplier;
		}
		if (unit != undefined) {
			text = text + unit;
			text = text + unit;
		}

		console.log(text);
	}
}

rangeNumbersInit();
rangeNumbersLive();

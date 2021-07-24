// Make the inputs be better
function rangeNumbersInit() {
	var containers = document.getElementsByClassName('rangeNumbers');
	var rangeMins = document.getElementsByClassName('rangeNumbersMin');
	var rangeMaxes = document.getElementsByClassName('rangeNumbersMax');
	var rangeValues = document.getElementsByClassName('rangeNumbersValue');

	if (containers.length == rangeMins.length && rangeMins.length == rangeMaxes.length && rangeMins.length == rangeValues.length) {
		for (var i = 0; i < containers.length; i++) {
			var container = containers[i];

			var range = container.getElementsByTagName('input')[0];
			var min = range.min;
			var max = range.max;
			var value = range.value;
			var multiplier = range.dataset.multiplier;
			var unit = range.dataset.unit;

			if (multiplier != undefined) {
				min *= multiplier;
				max *= multiplier;
				value *= multiplier;
			}
			if (unit != undefined) {
				min += unit;
				max += unit;
				value += unit;
			}
			rangeMins[i].innerHTML = min;
			rangeMaxes[i].innerHTML = max;
			rangeValues[i].innerHTML = value;
		}
	}
}

function rangeNumbersLive() {
	var containers = document.getElementsByClassName('rangeNumbers');

	for (var i = 0; i < containers.length; i++) {
		var container = containers[i];
		var range = container.getElementsByTagName('input')[0];

		range.oninput = event => {
			var range = event.target;

			var multiplier = range.dataset.multiplier;
			var unit = range.dataset.unit;
			var text = range.value;

			if (multiplier != undefined) {
				text *= multiplier;
			}
			if (unit != undefined) {
				text += unit;
			}

			var valueLabel = range.parentElement.getElementsByClassName('rangeNumbersValue')[0];
			valueLabel.innerHTML = text;
		}
	}
}

function updateColorPickers() {
	var inputs = document.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.type == 'color') {
			input.style.background = input.value;
		}
	}
}

function updateColorPickerOnUnfocus() {
	var inputs = document.getElementsByTagName('input');
	for (var i = 0; i < inputs.length; i++) {
		var input = inputs[i];
		if (input.type == 'color') {
			input.addEventListener('blur', function(event) {
				updateColorPickers();
			});
		}
	}
}
updateColorPickerOnUnfocus();

// Load option helpers
function loadOptionImage(string) {
	chrome.storage.local.get(string, results => {
		optionElement = document.getElementById(string);
		if (results[string]) {
			optionElement.style.backgroundImage = 'url(' + results[string] + ')';
		} else {
			optionElement.style.backgroundImage = 'url(mountain.webp)';
		}
	});
}
function loadOptionValue(string) {
	chrome.storage.sync.get(string, results => {
		document.getElementById(string).value = results[string];
	});
}
function loadOptionChecked(string) {
	chrome.storage.sync.get(string, results => {
		document.getElementById(string).checked = results[string];
	});
}

function loadOptions() {
	// Theme
	loadOptionImage('backgroundImage');
	loadOptionValue('backgroundOverlayColor');
	loadOptionValue('backgroundOverlayOpacity');
	loadOptionValue('textColor');
	loadOptionValue('mainFont');
	loadOptionValue('accentFont');

	// Time & Date
	loadOptionChecked('showTime');
	loadOptionChecked('showSeconds');
	loadOptionChecked('showAMPM');
	loadOptionChecked('showWeekday');
	loadOptionChecked('showDate');
	loadOptionChecked('militaryTime');
	loadOptionValue('dateFormat');

	// Bookmarks
	loadOptionChecked('showBookmarks');
	loadOptionChecked('showBookmarks');
	loadOptionChecked('showLabels');
	loadOptionChecked('allowBookmarksBar');
	loadOptionChecked('allowOtherBookmarks');
	loadOptionChecked('allowMobileBookmarks');
	loadOptionValue('numberOfColumns');
	loadOptionValue('columnWidth');

	// Wait for Chrome storage, then update inputs
	chrome.storage.sync.get('blah', results => {
		rangeNumbersInit();
		rangeNumbersLive();
		updateColorPickers();
	});
}

// Event listeners to save options
function saveOptions() {
	// Background image
	optionElement = document.getElementById('backgroundImage');
	optionElement.onchange = function () {
		backgroundImage = optionElement.files[0];
		var reader = new FileReader();
		if (backgroundImage instanceof Blob) {
			reader.readAsDataURL(backgroundImage);
		}
		reader.onload = function (event) {
			chrome.storage.local.set({'backgroundImage': event.target.result}, function() {
				chrome.storage.local.get('backgroundImage', results => {
					optionElement.style.backgroundImage = 'url(' + results['backgroundImage'] + ')';
					optionElement.classList.remove('dropping');
				});
			});
		}
	}
	optionElement.ondragenter = function (event) {
		optionElement.classList.add('dropping');
	}
	optionElement.ondragleave = function (event) {
		optionElement.classList.remove('dropping');
	}

	// skip = document.getElementById('skip').checked;
	// dual = document.getElementById('dual').checked;
	// chrome.storage.sync.set({
	// 	skip: skip,
	// 	dual: dual
	// }, animateSaved());

	// Cool api for checking if a font is valid
	// document.fonts.check('12px courier');
}

loadOptions();
saveOptions();

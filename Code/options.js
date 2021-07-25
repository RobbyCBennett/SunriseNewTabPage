// Make the inputs be better
// This function was from https://www.w3schools.com/howto/howto_custom_select.asp
function selectDropdownInit() {
	var x, i, j, l, ll, selElmnt, a, b, c;
	x = document.getElementsByClassName('select');
	l = x.length;
	for (i = 0; i < l; i++) {
		selElmnt = x[i].getElementsByTagName('select')[0];
		ll = selElmnt.length;
		/* For each element, create a new DIV that will act as the selected item: */
		a = document.createElement('DIV');
		a.setAttribute('class', 'select-selected');
		a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
		x[i].appendChild(a);
		/* For each element, create a new DIV that will contain the option list: */
		b = document.createElement('DIV');
		b.setAttribute('class', 'select-items select-hide');
		for (j = 0; j < ll; j++) {
			/* For each option in the original select element,
			create a new DIV that will act as an option item: */
			c = document.createElement('DIV');
			c.innerHTML = selElmnt.options[j].innerHTML;
			c.addEventListener('click', function(e) {
				/* When an item is clicked, update the original select box,
				and the selected item: */
				var y, i, k, s, h, sl, yl;
				s = this.parentNode.parentNode.getElementsByTagName('select')[0];
				sl = s.length;
				h = this.parentNode.previousSibling;
				for (i = 0; i < sl; i++) {
					if (s.options[i].innerHTML == this.innerHTML) {
						s.selectedIndex = i;
						h.innerHTML = this.innerHTML;
						y = this.parentNode.getElementsByClassName('same-as-selected');
						yl = y.length;
						for (k = 0; k < yl; k++) {
							y[k].removeAttribute('class');
						}
						this.setAttribute('class', 'same-as-selected');
						break;
					}
				}
				h.click();

				chrome.storage.sync.set({ [s.id]: s.value });
			});
			b.appendChild(c);
		}
		x[i].appendChild(b);
		a.addEventListener('click', function(e) {
			/* When the select box is clicked, close any other select boxes,
			and open/close the current select box: */
			e.stopPropagation();
			closeAllSelect(this);
			this.nextSibling.classList.toggle('select-hide');
			this.classList.toggle('select-arrow-active');
		});
	}
	function closeAllSelect(elmnt) {
		/* A function that will close all select boxes in the document,
		except the current select box: */
		var x, y, i, xl, yl, arrNo = [];
		x = document.getElementsByClassName('select-items');
		y = document.getElementsByClassName('select-selected');
		xl = x.length;
		yl = y.length;
		for (i = 0; i < yl; i++) {
			if (elmnt == y[i]) {
				arrNo.push(i)
			} else {
				y[i].classList.remove('select-arrow-active');
			}
		}
		for (i = 0; i < xl; i++) {
			if (arrNo.indexOf(i)) {
				x[i].classList.add('select-hide');
			}
		}
	}
	document.addEventListener('click', closeAllSelect);
}

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

function updateColorPickersOnUnfocus() {
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
	loadOptionChecked('showSettingsButton');

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
		selectDropdownInit();
	});
}

// Save option helpers
function saveOptionImage(string) {
	optionElement = document.getElementById(string);
	optionElement.onchange = function () {
		image = optionElement.files[0];
		var reader = new FileReader();
		if (image instanceof Blob) {
			reader.readAsDataURL(image);
		}
		reader.onload = function (event) {
			chrome.storage.local.set({ [string]: event.target.result }, function() {
				chrome.storage.local.get(string, results => {
					optionElement.style.backgroundImage = 'url(' + results[string] + ')';
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
}
function saveOptionValue(string) {
	document.getElementById(string).onchange = event => {
		chrome.storage.sync.set({ [string]: event.target.value });
	}
}
function saveOptionChecked(string) {
	document.getElementById(string).onchange = event => {
		chrome.storage.sync.set({ [string]: event.target.checked });
	}
}
function saveOptions() {
	// Theme
	saveOptionImage('backgroundImage');
	saveOptionValue('backgroundOverlayColor');
	saveOptionValue('backgroundOverlayOpacity');
	saveOptionValue('textColor');
	saveOptionValue('mainFont');
	saveOptionValue('accentFont');
	saveOptionChecked('showSettingsButton');

	// Time & Date
	saveOptionChecked('showTime');
	saveOptionChecked('showSeconds');
	saveOptionChecked('showAMPM');
	saveOptionChecked('showWeekday');
	saveOptionChecked('showDate');
	saveOptionChecked('militaryTime');
	saveOptionValue('dateFormat');

	// Bookmarks
	saveOptionChecked('showBookmarks');
	saveOptionChecked('showIcons');
	saveOptionChecked('showLabels');
	saveOptionChecked('allowBookmarksBar');
	saveOptionChecked('allowOtherBookmarks');
	saveOptionChecked('allowMobileBookmarks');
	saveOptionValue('numberOfColumns');
	saveOptionValue('columnWidth');
}

updateColorPickersOnUnfocus();
loadOptions();
saveOptions();

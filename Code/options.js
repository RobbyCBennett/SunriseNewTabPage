function loadOptions() {
	optionElement = document.getElementById('backgroundImage');
	chrome.storage.local.get('backgroundImage', result => {
		optionElement.style.backgroundImage = 'url(' + result['backgroundImage'] + ')';
	});

	// chrome.storage.sync.get({skip: true}, function(items) {
	// 	document.getElementById('skip').checked = items.skip;
	// });
	// chrome.storage.sync.get({dual: true}, function(items) {
	// 	document.getElementById('dual').checked = items.dual;
	// });
}

// Event listeners to save options
function saveOptions() {
	// Background image
	optionElement = document.getElementById('backgroundImage');
	optionElement.onchange = function () {
		backgroundImage = optionElement.files[0];
		var reader = new FileReader();
		reader.readAsDataURL(backgroundImage);
		reader.onload = function (event) {
			chrome.storage.local.set({'backgroundImage': event.target.result}, function() {
				chrome.storage.local.get('backgroundImage', result => {
					optionElement.style.backgroundImage = 'url(' + result['backgroundImage'] + ')';
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

function loadOptions() {
	// chrome.storage.sync.get({skip: true}, function(items) {
	// 	document.getElementById('skip').checked = items.skip;
	// });
	// chrome.storage.sync.get({dual: true}, function(items) {
	// 	document.getElementById('dual').checked = items.dual;
	// });
}

function saveOptions() {
	// skip = document.getElementById('skip').checked;
	// dual = document.getElementById('dual').checked;
	// chrome.storage.sync.set({
	// 	skip: skip,
	// 	dual: dual
	// }, animateSaved());
}

// Load options
document.addEventListener('DOMContentLoaded', loadOptions);

// Watch for option changes
window.onload = function() {

	// Background image
	optionElement = document.getElementById('backgroundImage');
    optionElement.onchange = function () {
		backgroundImage = optionElement.files[0];

		// Limited to 5 MB
		// Save image
		var reader = new FileReader();
		reader.readAsDataURL(backgroundImage);
        reader.onload = function (event) {
			try {
				localStorage.setItem('imgData', event.target.result);
				optionElement.classList.remove('error');
			} catch(error) {
				console.log(error);
				optionElement.classList.add('error');
			}

			// Load image
			var dataImage = localStorage.getItem('imgData');
			document.body.style.backgroundImage = 'url(' + dataImage + ')';
			// document.getElementById('testImage').src = dataImage;
        }
    }

	// Cool api for checking if a font is valid
	// document.fonts.check('12px courier');
};

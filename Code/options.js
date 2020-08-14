function loadOptions() {
	// chrome.storage.sync.get({skip: true}, function(items) {
	// 	document.getElementById("skip").checked = items.skip;
	// });
	// chrome.storage.sync.get({dual: true}, function(items) {
	// 	document.getElementById("dual").checked = items.dual;
	// });
}

function saveOptions() {
	// var skip = document.getElementById("skip").checked;
	// var dual = document.getElementById("dual").checked;
	// chrome.storage.sync.set({
	// 	skip: skip,
	// 	dual: dual
	// }, animateSaved());
}

// Load options
document.addEventListener("DOMContentLoaded", loadOptions);

// Watch for option changes
window.onload = function() {
    var options = document.getElementsByTagName("input");
    for (var i = 0; i < options.length; i++) {
        var optionElement = options[i];
		if (!optionElement.classList.contains("close")) {
			optionElement.onclick = function() {
	            saveOptions();
	        }
		}
    }
};

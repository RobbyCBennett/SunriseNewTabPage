// Links

// Main click, other click, and keypress
function clickAndKeypress(el, fn) {
	el.onclick = fn;
	el.onauxclick = fn;
	el.onkeypress = fn;
}

// Link: Big options page
function bigOptions(e) {
	// Skip other keys or right click
	if ((e.code && e.code != 'Enter') || e.button == 2) {
		return;
	}

	// Create tab
	chrome.runtime.openOptionsPage();
}
const bigOptionsLink = document.getElementById('bigOptions');
clickAndKeypress(bigOptionsLink, bigOptions);
if (location.hash != '#popup') {
	bigOptionsLink.className = 'hidden';
}



// Options

// Load all options
async function loadOptions() {
	const options = await chrome.storage.local.get();

	// View options on inputs
	for (const [key, value] of Object.entries(options)) {
		const field = document.getElementById(key);
		if (! field) continue;

		if (field.type == 'checkbox') {
			// Load option
			field.checked = value;

			// Hide/show the options
			if (! value) toggleOptions(field);
		}
		else if (field.type == 'range') {
			// Load option
			field.value = value;
			const id = field.id + 'Number';
			document.getElementById(id).value = value;
		}
		else if (field.type == 'file') {
			// Load option
			document.getElementById(key).style.backgroundImage = `url(${value})`;
		}
		else {
			// Load option
			field.value = value;
		}
	}
}
loadOptions();

// Save changed option
let autoSaveTimestamp = 0;
function saveOption(key, value, autoSaveDelay=0) {
	autoSaveTimestamp = Date.now();

	setTimeout(() => {
		// Wait a bit until the user stops
		if (autoSaveTimestamp + autoSaveDelay > Date.now())
			return;

		// Save data
		chrome.storage.local.set({ [key]: value });

		// Remove close warning
		window.onbeforeunload = null;

	}, autoSaveDelay);
}

// Show/hide options
function toggleOptions(el) {
	const hideClass = el.dataset.hide;
	if (hideClass) {
		for (const option of document.getElementsByClassName(hideClass)) {
			option.classList.toggle('hidden');
		}
	}
}



// Inputs

// Checkbox
function checkboxChanged(e) {
	const target = e.target;

	const key = target.id;
	const value = target.checked;

	// Hide/show the options
	toggleOptions(target);

	// Set option with storage local immediately
	saveOption(key, value);
}
for (const checkbox of document.querySelectorAll('input[type="checkbox"]')) {
	checkbox.oninput = checkboxChanged;
}

// Text, color, textarea
function otherChanged(e) {
	const key = e.target.id;
	const value = e.target.value;

	// Set option with storage local after the user stops typing
	saveOption(key, value, 750);
}
for (const input of document.querySelectorAll('input[type="text"], input[type="color"], textarea')) {
	input.oninput = otherChanged;
}

// Range
function rangeChanged(e) {
	const target = e.target;
	let value = parseInt(target.value);

	// Sync range & input
	let otherId, key;
	if (target.type == 'range') {
		// Get key
		key = target.id;

		// Get id of number input
		otherId = key + 'Number';
	}
	else {
		// Get key
		key = target.id.slice(0, -6)

		// Make value stay in range and style as invalid
		const min = parseInt(target.dataset.min);
		const max = parseInt(target.dataset.max);
		const below = value < min;
		if (below || value > max) {
			// Make value stay in range
			if (below) value = min;
			else value = max;

			// Style as invalid
			target.classList.add('invalid');
		}
		else {
			target.classList.remove('invalid');
		}

		// Get id of range input
		otherId = key;
	}
	document.getElementById(otherId).value = value;

	// Set option with storage local after the user stops using the slider
	saveOption(key, value, 250);
}
const BACKSPACE = 8;
const DELETE = 46;
const ZERO = 48;
const NINE = 57;
function rangeNumber(e) {
	if (e.keyCode == BACKSPACE || e.keyCode == DELETE || (e.keyCode >= ZERO && e.keyCode <= NINE)) {
		const id = e.target.id + 'Number';
		const number = document.getElementById(id);
		number.value = '';
		number.focus();
	}
}
for (const range of document.querySelectorAll('input[type="range"]')) {
	// Go to number input on key down
	range.onkeydown = rangeNumber;

	// Make container for range, number, & unit
	const containerAll = document.createElement('div');
	containerAll.className = 'flex'
	range.parentNode.appendChild(containerAll);
	containerAll.appendChild(range);

	// Make container for number & unit
	const container = document.createElement('div');
	container.className = 'rangeNumberAndUnit flex'
	containerAll.appendChild(container);

	// Make number input
	const number = document.createElement('input');
	number.type = 'number';
	number.className = 'rangeNumber';
	number.dataset.min = range.min;
	number.dataset.max = range.max;
	number.id = range.id + 'Number';
	number.tabIndex = -1;
	container.appendChild(number);

	// Make number input unit
	const unit = range.dataset.unitSup || range.dataset.unit;
	if (unit) {
		const unitTagName = range.dataset.unitSup ? 'sup' : 'small';

		const unitContainer = document.createElement('div');
		unitContainer.className = 'rangeNumberUnit flex';
		container.appendChild(unitContainer);

		const unitElement = document.createElement(unitTagName);
		unitElement.innerHTML = unit;
		unitContainer.appendChild(unitElement);
	}

	// Sync both inputs
	range.oninput = rangeChanged;
	number.oninput = rangeChanged;
}

// File
function fileChanged(e) {
	const target = e.target;
	const key = target.id;
	const image = target.files[0];

	// Read file as data URL
	const reader = new FileReader();
	reader.readAsDataURL(image);
	reader.onload = e => {
		const value = e.target.result;

		// Set option with storage local
		saveOption(key, value);

		// Preview image
		target.style.backgroundImage = `url(${value})`;
	}
}
for (const input of document.querySelectorAll('input[type="file"]')) {
	input.oninput = fileChanged;
}

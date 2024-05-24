// @ts-check
'use strict';


const SVG_FOLDER = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve"><path class="st0" d="M9.6,2.4H2.4C1.1,2.4,0,3.5,0,4.8l0,14.4c0,1.3,1.1,2.4,2.4,2.4h19.2c1.3,0,2.4-1.1,2.4-2.4v-12 c0-1.3-1.1-2.4-2.4-2.4H12L9.6,2.4z"/></svg>';

const SVG_LINK = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve"><path class="st0" d="M12,0C5.4,0,0,5.4,0,12s5.4,12,12,12s12-5.4,12-12S18.6,0,12,0z M10.8,21.5c-4.7-0.6-8.4-4.6-8.4-9.5 c0-0.7,0.1-1.5,0.3-2.1l5.7,5.7v1.2c0,1.3,1.1,2.4,2.4,2.4V21.5z M19.1,18.5c-0.3-1-1.2-1.7-2.3-1.7h-1.2v-3.6 c0-0.7-0.5-1.2-1.2-1.2H7.2V9.6h2.4c0.7,0,1.2-0.5,1.2-1.2V6h2.4c1.3,0,2.4-1.1,2.4-2.4V3.1c3.5,1.4,6,4.9,6,8.9 C21.6,14.5,20.6,16.8,19.1,18.5z"/></svg>';

const options = {
	// Theme
	backgroundImage: '',
	backgroundOverlayColor: '#000000',
	backgroundOverlayOpacity: 35,
	textColor: '#FFFFFF',
	mainFont: 'Montserrat',
	accentFont: 'Marck Script',
	zoomLevel: 100,
	verticallyCenterEverything: false,
	showSettingsButton: true,

	// Time
	showTime: true,
	showSeconds: false,
	showAMPM: false,
	militaryTime: false,

	// Weekday
	showWeekday: true,

	// Date
	showDate: true,
	dateFormat: 'm d, y',

	// Bookmarks
	showBookmarks: true,
	showIcons: true,
	showLabels: true,
	bookmarkAlignment: 'left',
	allowBookmarksBar: true,
	allowOtherBookmarks: false,
	allowMobileBookmarks: false,
	dimBookmarks: true,
	numberOfColumns: 5,
	columnWidth: 8,

	// Advanced
	customCSS: '',
};


async function displayPage()
{
	/** @type {HTMLElement | null} */
	let element = null;

	// Background image
	if (element = document.getElementById('background')) {
		if (options.backgroundImage.length)
			element.style.backgroundImage = `url(${options.backgroundImage})`;
		else
			element.style.backgroundImage = 'url(/assets/mountain.webp)';
	}

	// Overlay color & opacity
	const color = hexToRGB(options.backgroundOverlayColor);
	const fullOverlayColor = `rgba(${color.r}, ${color.g}, ${color.b}, ${options.backgroundOverlayOpacity / 100})`;
	if (element = document.getElementById('overlay'))
		element.style.backgroundColor = fullOverlayColor;

	// Text color
	const cssVariables = document.documentElement.style;
	cssVariables.setProperty('--textColor', options.textColor);

	// Fonts
	cssVariables.setProperty('--mainFont', options.mainFont);
	cssVariables.setProperty('--accentFont', options.accentFont);

	// Zoom level
	cssVariables.setProperty('--zoomLevel', `${options.zoomLevel}%`);

	// Vertically center everything
	if (options.verticallyCenterEverything) {
		if (element = document.getElementById('timeAndDate'))
			element.classList.add('topThird');
		if (element = document.getElementById('favoritesContainer'))
			element.classList.add('bottomThird');
	} else {
		if (element = document.getElementById('timeAndDate'))
			element.classList.add('verticalCenter');
		if (element = document.getElementById('favoritesContainer'))
			element.classList.add('bottom');
	}

	// Show settings button
	if (options.showSettingsButton === true)
		if (element = document.getElementById('settings'))
			element.classList.remove('hidden');

	// Show time
	if (options.showTime === true)
		if (element = document.getElementById('time'))
			element.classList.remove('hidden');

	// Show seconds
	if (options.showSeconds === false)
		if (element = document.getElementById('second'))
			element.classList.add('hidden');

	// Show AM/PM
	if (options.showAMPM === false)
		if (element = document.getElementById('amPM'))
			element.classList.add('hidden');

	// Show weekday
	if (options.showWeekday === false)
		if (element = document.getElementById('weekday'))
			element.classList.add('hidden');

	// Show date
	if (options.showDate === true)
		if (element = document.getElementById('date'))
			element.classList.remove('hidden');

	// Date format
	if (options.dateFormat === 'd m y')
		if (element = document.getElementById('date'))
			element.innerHTML = '<span id="day"></span><span id="month"></span><span id="year"></span>'

	// Show bookmarks
	if (options.showBookmarks === false)
		if (element = document.getElementById('favoritesContainer'))
			element.classList.add('hidden');

	// Show icons
	if (options.showIcons === false)
		cssVariables.setProperty('--showIcons', 'none');

	// Show labels
	if (options.showLabels === false)
		cssVariables.setProperty('--showLabels', 'none');

	// Bookmark alignment
	if (element = document.getElementById('favorites')) {
		if (options.bookmarkAlignment === 'center')
			element.classList.add('center');
		else if (options.bookmarkAlignment === 'right')
			element.classList.add('right');
		else
			element.classList.add('left');
	}

	// Dim bookmarks
	if (options.dimBookmarks === true)
		cssVariables.setProperty('--dimBookmarks', '50%');

	// Column width
	cssVariables.setProperty('--columnWidth', options.columnWidth + 'rem');

	// Advanced
	if (element = document.getElementById('customCSS'))
		element.innerHTML = options.customCSS;

	// Display the rest of the UI
	drawTimeEverySecond(options.militaryTime);
	if (options.showBookmarks)
		displayBookmarks(getRootFolderId(), false);
}


/**
 * @param {boolean} militaryTime
 */
function drawTime(militaryTime)
{
	const date = new Date();

	let hour = date.getHours().toString();
	let minute = date.getMinutes().toString();
	let second = date.getSeconds().toString();
	let amPM = '';

	// Set hour
	if (militaryTime) {
		if (date.getHours() < 10)
			hour = '0' + date.getHours().toString();
	}
	// Set hour and AM/PM
	else {
		amPM = 'AM';
		if (date.getHours() == 0) {
			hour = '12';
		}
		else if (date.getHours() > 12) {
			amPM = 'PM';
			hour = (date.getHours() - 12).toString();
		}
		else if (date.getHours() == 12) {
			amPM = 'PM';
		}
	}

	// Set minutes
	if (date.getMinutes() < 10)
		minute = `0${date.getMinutes()}`;
	// Set seconds
	if (date.getSeconds() < 10)
		second = `0${date.getSeconds()}`;

	/** @type {HTMLElement | null} */
	let element = null;

	// Display time
	if (element = document.getElementById('hour'))
		element.textContent = hour;
	if (element = document.getElementById('minute'))
		element.textContent = minute;
	if (element = document.getElementById('second'))
		element.textContent = second;
	if (element = document.getElementById('amPM'))
		element.textContent = amPM;

	// Display weekday
	if (element = document.getElementById('weekday'))
		element.textContent = date.toLocaleString('default', {weekday: 'long'});;

	// Display date
	if (element = document.getElementById('month'))
		element.textContent = date.toLocaleString('default', {month: 'long'});
	if (element = document.getElementById('day'))
		element.textContent = date.getDate().toString();
	if (element = document.getElementById('year'))
		element.textContent = date.getFullYear().toString();
}


/**
 * @param {string} currentFolderID
 * @param {boolean} shouldFocus
 */
async function displayBookmarks(currentFolderID, shouldFocus)
{
	/** @type {HTMLElement | null} */
	let element = null;

	// Clear the current view of favorites
	if (element = document.getElementById('favorites'))
		element.innerHTML = '';

	/** @ts-ignore @type {{id: string, title: string, url: string | undefined}[]} */
	const currentFolder = await chrome.bookmarks.getChildren(currentFolderID);

	// Each link or folder
	let rowI = -1;
	for (let i = 0; i < currentFolder.length; i++) {
		// Get child of current folder
		const linkOrFolder = currentFolder[i];

		// New row
		const colI = i % options.numberOfColumns;
		if (colI === 0) {
			rowI++;
			const row = document.createElement('div');
			row.className = 'row';
			row.id = `row${rowI}`;
			if (element = document.getElementById('favorites'))
				element.appendChild(row);
		}

		// Get row
		const row = document.getElementById(`row${rowI}`);
		if (row === null)
			continue;

		// Link
		if (linkOrFolder.url !== undefined) {
			// Favorite container
			const favorite = document.createElement('div');
			favorite.dataset.col = colI.toString();
			favorite.dataset.row = rowI.toString();
			favorite.className = 'favorite website';
			row.appendChild(favorite);

			// Link
			let anchor = document.createElement('a');
			anchor.className = 'linkOrFolder';
			anchor.href = linkOrFolder.url;
			anchor.dataset.col = colI.toString();
			anchor.dataset.row = rowI.toString();
			anchor.innerHTML = SVG_LINK;
			favorite.appendChild(anchor);

			// Text
			const paragraph = document.createElement('p');
			paragraph.innerHTML = linkOrFolder.title;
			anchor.appendChild(paragraph);
		}
		// Folder
		else {
			// At the root, skip certain folders
			if (currentFolderID === '0')
				if ((linkOrFolder.id === '1' && !options.allowBookmarksBar)
				|| (linkOrFolder.id === '2' && !options.allowOtherBookmarks)
				|| (linkOrFolder.id === '3' && !options.allowMobileBookmarks))
					continue;

			// Favorite container
			const favorite = document.createElement('div');
			favorite.className = 'favorite folder';
			row.appendChild(favorite);

			// Button
			const button = document.createElement('button');
			button.className = 'linkOrFolder';
			button.dataset.id = linkOrFolder.id;
			button.dataset.col = colI.toString();
			button.dataset.row = rowI.toString();
			button.onclick = onClickFolder;
			button.innerHTML = SVG_FOLDER;
			favorite.appendChild(button);

			// Text
			const paragraph = document.createElement('p');
			paragraph.innerHTML = linkOrFolder.title;
			button.appendChild(paragraph);
		}
	}

	// Now that the bookmarks exist, possibly focus on them
	if (shouldFocus)
		focusOnBookmarks();

	// Clear the title and back button
	if (currentFolderID === getRootFolderId()) {
		if (element = document.getElementById('currentFolder'))
			element.innerHTML = '';

		if (element = document.getElementById('back'))
			element.className = '';
	}
	// Set up the title and back button
	else {
		/** @ts-ignore @type {{title: string, parentId: string | undefined}[]} */
		const currentFolderNodeResults = await chrome.bookmarks.get(currentFolderID);
		if (currentFolderNodeResults.length === 0)
			return;
		const currentFolderNode = currentFolderNodeResults[0];

		// Title
		if (element = document.getElementById('currentFolder'))
			element.innerHTML = currentFolderNode.title;

		const parentFolderId = currentFolderNode.parentId;
		if (!parentFolderId)
			return;

		// Back button
		if (element = document.getElementById('back')) {
			element.className = 'visible';
			element.dataset.id = parentFolderId;
			element.onclick = onClickFolder;
		}
	}
}


/**
 * @param {boolean} militaryTime
 */
function drawTimeEverySecond(militaryTime)
{
	drawTime(militaryTime);

	setTimeout(function() {
		setInterval(function() {
			drawTime(militaryTime);
		}, 1000);
		drawTime(militaryTime);
	}, 1000 - new Date().getMilliseconds());
}


function focusOnBookmarks()
{
	const newFocus = document.querySelector('#row0 .favorite:first-child :first-child');
	if (newFocus instanceof HTMLElement)
		newFocus.focus();
}


/**
 * @arg {HTMLElement} linkOrFolder
 */
function getPosition(linkOrFolder)
{
	// Fail if somehow not a link/folder
	if (linkOrFolder.dataset.col === undefined || linkOrFolder.dataset.row === undefined)
		return null;

	// Fail if somehow not in a row
	const rowElement = linkOrFolder.parentElement?.parentElement;
	if (!rowElement)
		return null;

	// Fail if somehow not in a row
	const rowsElement = rowElement.parentElement;
	if (!rowsElement)
		return null;

	return {
		col: parseInt(linkOrFolder.dataset.col),
		colCount: rowElement.children.length,
		row: parseInt(linkOrFolder.dataset.row),
		rowCount: rowsElement.children.length,
	};
}


function getRootFolderId()
{
	if (options.allowBookmarksBar && !options.allowOtherBookmarks && !options.allowMobileBookmarks)
		return '1';
	else if (!options.allowBookmarksBar && options.allowOtherBookmarks && !options.allowMobileBookmarks)
		return '2';
	else if (!options.allowBookmarksBar && !options.allowOtherBookmarks && options.allowMobileBookmarks)
		return '3';
	else
		return '0';
}


/**
 * @param {string} hex like '#000000'
 */
function hexToRGB(hex)
{
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return {
		r: (result !== null) ? parseInt(result[1], 16) : 0,
		g: (result !== null) ? parseInt(result[2], 16) : 0,
		b: (result !== null) ? parseInt(result[3], 16) : 0,
	};
}


/**
 * @param {KeyboardEvent} event
 */
function navigateWithKey(event)
{
	/** @type {HTMLElement | null} */
	let element = null;

	// Decide the action
	const ACTION_LEFT = 0;
	const ACTION_RIGHT = 1;
	const ACTION_DOWN = 2;
	const ACTION_UP = 3;
	const ACTION_BACK = 4;
	let action = ACTION_LEFT;
	switch (event.key) {
		case 'ArrowLeft':
			action = ACTION_LEFT;
			break;
		case 'ArrowRight':
			action = ACTION_RIGHT;
			break;
		case 'ArrowUp':
			action = ACTION_UP;
			break;
		case 'ArrowDown':
			action = ACTION_DOWN;
			break;
		case 'Backspace':
		case 'Escape':
			action = ACTION_BACK;
			break;
		default:
			return;
	}

	// Stop early if the focused element isn't a favorite link/folder
	if (!(document.activeElement instanceof HTMLElement) || !document.activeElement.classList.contains('linkOrFolder'))
		return focusOnBookmarks();

	// Get position
	const position = getPosition(document.activeElement);
	if (position === null)
		return;
	const col = position.col;
	const colCount = position.colCount;
	const row = position.row;
	const rowCount = position.rowCount;

	// Handle each action
	switch (action) {
		case ACTION_LEFT:
			// Move left
			if (col > 0) {
				if (element = document.querySelector(`#row${row} .favorite:nth-child(${col}) :first-child`))
					element.focus();
			}
			// Move up & far right
			else if (row > 0) {
				if (element = document.querySelector(`#row${row - 1} .favorite:last-child :first-child`))
					element.focus();
			}
			break;
		case ACTION_RIGHT:
			// Move right
			if (col < colCount - 1) {
				if (element = document.querySelector(`#row${row} .favorite:nth-child(${col + 2}) :first-child`))
					element.focus();
			}
			// Move down & far left
			else if (row < rowCount - 1) {
				if (element = document.querySelector(`#row${row + 1} .favorite:nth-child(1) :first-child`))
					element.focus();
			}
			break;
		case ACTION_UP:
			// Move up
			if (row > 0) {
				// Figure out the new column
				let newCol = col + 1;
				const newColCount = document.querySelector(`#row${row - 1}`)?.children.length;
				if (newColCount === undefined)
					break;
				if (newColCount !== colCount) {
					if (options.bookmarkAlignment == 'center')
						newCol = col + 1 - Math.ceil((colCount - newColCount) / 2);
					else if (options.bookmarkAlignment == 'right')
						newCol = col + 1 - (colCount - newColCount);
				}

				if (element = document.querySelector(`#row${row - 1} .favorite:nth-child(${newCol}) :first-child`))
					element.focus();
			}
			break;
		case ACTION_DOWN:
			// Move down
			if (row < rowCount - 1) {
				// Figure out the new column
				let newCol = col + 1;
				const newColCount = document.querySelector(`#row${row + 1}`)?.children.length;
				if (newColCount === undefined)
					break;
				if (newColCount != colCount) {
					if (options.bookmarkAlignment == 'left' && newCol > newColCount) {
						newCol = newColCount;
					} else if (options.bookmarkAlignment == 'center') {
						newCol = col + 1 - Math.ceil((colCount - newColCount) / 2);
						if (newCol < 1)
							newCol = 1;
						else if (newCol > newColCount)
							newCol = newColCount;
					} else if (options.bookmarkAlignment == 'right') {
						newCol = col + 1 - (colCount - newColCount);
						if (newCol < 1)
							newCol = 1;
					}
				}

				if (element = document.querySelector(`#row${row + 1} .favorite:nth-child(${newCol}) :first-child`))
					element.focus();
			}
			break;
		case ACTION_BACK:
			if (element = document.getElementById('back'))
				if (element.classList.contains('visible'))
					element.click();
			break;
	}
}


/**
 * @param {MouseEvent} event
 */
function onClickFolder(event)
{
	// Fail if no target
	if (!(event.target instanceof HTMLElement))
		return;

	// Fail if no folder ID
	const newFolderID = event.target.dataset.id;
	if (newFolderID === undefined)
		return;

	// Should focus if it wasn't a single click
	const shouldFocus = event.detail !== 1;

	displayBookmarks(newFolderID, shouldFocus);
}


/**
 * @param {MouseEvent} event
 */
function onClickSettings(event)
{
	// @ts-ignore
	chrome.tabs.create({'url': '/options/options.html'});
}


async function setOptions()
{
	// Get user options into the result and remember the unsaved options
	/** @ts-ignore @type {{}} */
	const userOptions = await chrome.storage.local.get();
	const unsavedOptions = {};
	let hasUnsavedOptions = false;
	for (const key of Object.keys(options)) {
		// Overwrite with a valid user option
		if (userOptions.hasOwnProperty(key) && typeof(options[key]) === typeof(userOptions[key])) {
			options[key] = userOptions[key];
		}
		// Remember to save the unsaved option
		else {
			unsavedOptions[key] = options[key];
			hasUnsavedOptions = true;
		}
	}

	// Save unsaved options
	if (hasUnsavedOptions) {
		// @ts-ignore
		chrome.storage.local.set(unsavedOptions);
	}
}


async function main()
{
	// Set event handlers
	document.onkeydown = navigateWithKey;
	const settingsButton = document.getElementById('settings');
	if (settingsButton !== null)
		settingsButton.onclick = onClickSettings;

	// Set variables
	await setOptions();

	displayPage();
}


main();

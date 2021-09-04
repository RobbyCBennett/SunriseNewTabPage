rootFolderID = null;
currentFolderID = null;

// Swiped from https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRGB(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function loadBackgroundImage() {
	bg = document.getElementById('background');
	chrome.storage.local.get('backgroundImage', result => {
		if (result['backgroundImage']) {
			bg.style.backgroundImage = 'url(' + result['backgroundImage'] + ')';
		} else {
			bg.style.backgroundImage = 'url(mountain.webp)';
		}
	});
}

function defaultOptions() {
	chrome.storage.local.get(null, options => {
		if (Object.keys(options).length == 0) {
			chrome.storage.local.set({
				// Theme
				backgroundOverlayColor: '#000000',
				backgroundOverlayOpacity: 35,
				textColor: '#FFFFFF',
				mainFont: 'Montserrat',
				accentFont: 'Marck Script',
				zoomLevel: 100,
				verticallyCenterEverything: false,
				showSettingsButton: true,

				// Time & Date
				showTime: true,
				showSeconds: false,
				showAMPM: false,
				showWeekday: true,
				showDate: true,
				militaryTime: false,
				dateFormat: 'm d, y',

				// Bookmarks
				showBookmarks: true,
				showIcons: true,
				showLabels: true,
				bookmarkAlignment: 'left',
				allowBookmarksBar: true,
				allowOtherBookmarks: false,
				allowMobileBookmarks: false,
				numberOfColumns: 5,
				columnWidth: 8,

			}, result => {
				loadOptions();
			});
		} else {
			loadOptions();
		}
	});
}

function loadOptions() {
	chrome.storage.local.get(null, options => {
		// Overlay Color & Opacity
		color = hexToRGB(options.backgroundOverlayColor);
		fullOverlayColor = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + options.backgroundOverlayOpacity / 100 + ')';
		document.getElementById('overlay').style.backgroundColor = fullOverlayColor;

		// Text Color
		cssVariables = document.documentElement.style;
		cssVariables.setProperty('--color', options.textColor);

		// Main Font
		cssVariables.setProperty('--mainFont', options.mainFont);

		// Accent Font
		cssVariables.setProperty('--accentFont', options.accentFont);

		// Accent Font
		cssVariables.setProperty('--zoomLevel', String(options.zoomLevel) + '%');

		// Vertically Center Everything
		if (options.verticallyCenterEverything === true) {
			document.getElementById('timeAndDate').classList.add('topThird');
			document.getElementById('favoritesContainer').classList.add('bottomThird');
		} else {
			document.getElementById('timeAndDate').classList.add('verticalCenter');
			document.getElementById('favoritesContainer').classList.add('bottom');
		}

		// Show Settings Button
		if (options.showSettingsButton === true) {
			document.getElementById('settings').classList.remove('hidden');
		}

		// Show Time
		if (options.showTime === true) {
			document.getElementById('time').classList.remove('hidden');
		}

		// Show Seconds
		if (options.showSeconds === false) {
			document.getElementById('second').classList.add('hidden');
		}

		// Show AP/PM
		if (options.showAMPM === false) {
			document.getElementById('amPM').classList.add('hidden');
		}

		// Show Weekday
		if (options.showWeekday === false) {
			document.getElementById('weekday').classList.add('hidden');
		}

		// Show Date
		if (options.showDate === true) {
			document.getElementById('date').classList.remove('hidden');
		}

		// Date Format
		if (options.dateFormat === 'd m y') {
			document.getElementById('date').innerHTML = '<span id="day"></span><span id="month"></span><span id="year"></span>'
		}

		// Show Bookmarks
		if (options.showBookmarks === false) {
			document.getElementById('favoritesContainer').classList.add('hidden');
		}

		// Show Icons
		if (options.showIcons === false) {
			cssVariables.setProperty('--showIcons', 'none');
		}

		// Show Labels
		if (options.showLabels === false) {
			cssVariables.setProperty('--showLabels', 'none');
		}

		// Bookmark Alignment
		if (options.bookmarkAlignment === 'center') {
			document.getElementById('favorites').classList.add('center');
		} else if (options.bookmarkAlignment === 'right') {
			document.getElementById('favorites').classList.add('right');
		} else {
			document.getElementById('favorites').classList.add('left');
		}

		// Column Width
		cssVariables.setProperty('--columnWidth', options.columnWidth + 'rem');

		// Load the UI
		updateTimeEverySecond(options.militaryTime);
		displayBookmarks(options.showBookmarks, options.allowBookmarksBar, options.allowOtherBookmarks, options.allowMobileBookmarks, currentFolderID, options.numberOfColumns);
	});
}

function updateTime(militaryTime) {
	// Time
	hourSpan = document.getElementById('hour');
	minuteSpan = document.getElementById('minute');
	secondSpan = document.getElementById('second');
	amPMSpan = document.getElementById('amPM');

	date = new Date();
	hour = date.getHours();
	minute = date.getMinutes();
	second = date.getSeconds();
	amPM = '';

	if (militaryTime) {
		if (hour < 10) {
			hour = '0' + hour;
		}
	}
	else {
		amPM = 'AM';
		if (hour == 0) {
			hour = 12;
		}
		else if (hour > 12) {
			amPM = 'PM';
			hour -= 12;
		}
		else if (hour == 12) {
			amPM = 'PM';
		}
	}

	if (minute < 10) {
		minute = '0' + minute;
	}
	if (second < 10) {
		second = '0' + second;
	}

	if (hourSpan != null) {
		hourSpan.textContent = hour;
	}
	if (minuteSpan != null) {
		minuteSpan.textContent = minute;
	}
	if (secondSpan != null) {
		secondSpan.textContent = second;
	}
	if (amPMSpan != null) {
		amPMSpan.textContent = amPM;
	}


	// Weekday
	weekdaySpan = document.getElementById('weekday');
	weekday = date.toLocaleString('default', { weekday: 'long' });
	if (weekdaySpan != null) {
		weekdaySpan.textContent = weekday;
	}


	// Date
	monthSpan = document.getElementById('month');
	month = date.toLocaleString('default', { month: 'long' });
	if (monthSpan != null) {
		monthSpan.textContent = month;
	}

	daySpan = document.getElementById('day');
	day = date.getDate();
	if (daySpan != null) {
		daySpan.textContent = day;
	}

	yearSpan = document.getElementById('year');
	year = date.getFullYear();
	if (yearSpan != null) {
		yearSpan.textContent = year;
	}
}


// Update the time every second
function updateTimeEverySecond(militaryTime) {
	updateTime(militaryTime);

	date = new Date();
	millisecondsLeft = date.getMilliseconds();

	setTimeout(function() {
		updateTime(militaryTime);
		setInterval(function() {
			updateTime(militaryTime);
		}, 1000);
	}, millisecondsLeft);
}



// Bookmarks
function displayBookmarks(showBookmarks, allowBookmarksBar, allowOtherBookmarks, allowMobileBookmarks, currentFolderID, numberOfColumns) {
	if (showBookmarks) {
		// Clear the current view of favorites
		favorites = document.getElementById('favorites');
		favorites.innerHTML = '';

		// Decide what folders to start with
		if (rootFolderID == null) {
			rootFolderID = '0';

			if (allowBookmarksBar && !allowOtherBookmarks && !allowMobileBookmarks) {
				rootFolderID = '1';
			}
			else if (!allowBookmarksBar && allowOtherBookmarks && !allowMobileBookmarks) {
				rootFolderID = '2';
			}
			else if (!allowBookmarksBar && !allowOtherBookmarks && allowMobileBookmarks) {
				rootFolderID = '3';
			}

			currentFolderID = rootFolderID;
		}

		chrome.bookmarks.getChildren(currentFolderID, function getBookmarks(currentFolder) {
			rowI = -1;
			for (var i = 0; i < currentFolder.length; i++) {
				linkOrFolder = currentFolder[i];

				// New row
				if (i % numberOfColumns == 0) {
					rowI++;

					var row = document.createElement('div');
					row.className = 'row';
					row.id = 'row' + rowI;
					favorites.appendChild(row)
				}

				// Link
				row = document.getElementById('row' + rowI);
				if (linkOrFolder.url != null) {
					var favorite = document.createElement('div');
					favorite.dataset.id = 'link' + String(i);
					favorite.className = 'favorite website';
					row.appendChild(favorite);

					var anchor = document.createElement('a');
					anchor.href = linkOrFolder.url;
					favorite.appendChild(anchor);

					var image = document.createElement('img');
					image.src = 'website.svg';
					// image.src = 'chrome://favicon/' + linkOrFolder.url;
					anchor.appendChild(image);

					var paragraph = document.createElement('p');
					paragraph.innerHTML = linkOrFolder.title;
					anchor.appendChild(paragraph);
				}
				// Folder
				else {
					shouldMakeThisFolder = true;
					if (currentFolderID == 0) {
						if ((linkOrFolder.id == 1 && !allowBookmarksBar) || (linkOrFolder.id == 2 && !allowOtherBookmarks) || (linkOrFolder.id == 3 && !allowMobileBookmarks)) {
							shouldMakeThisFolder = false;
						}
					}

					if (shouldMakeThisFolder) {
						var favorite = document.createElement('div');
						favorite.className = 'favorite folder';
						favorite.dataset.id = linkOrFolder.id;
						row.appendChild(favorite);

						var button = document.createElement('button');
						favorite.appendChild(button);

						var image = document.createElement('img');
						image.src = 'folder.svg';
						button.appendChild(image);

						var paragraph = document.createElement('p');
						paragraph.innerHTML = linkOrFolder.title;
						button.appendChild(paragraph);
					}
				}
			}

			// Set up the click detection
			folders = document.getElementsByClassName('folder');
			for (var i = 0; i < folders.length; i++) {
				folder = folders[i];
				folder.onclick = function() {
					newFolderID = this.dataset.id;
					displayBookmarks(showBookmarks, allowBookmarksBar, allowOtherBookmarks, allowMobileBookmarks, newFolderID, numberOfColumns);
				}
			}

			// Set up the back button and title
			back = document.getElementById('back');
			currentFolderSpan = document.getElementById('currentFolder');

			if (currentFolderID != null && currentFolderID != rootFolderID) {
				chrome.bookmarks.get(currentFolderID, function test(currentFolderNode) {
					parentFolderID = currentFolderNode[0].parentId;

					back.className = 'visible';
					back.onclick = function() {
						displayBookmarks(showBookmarks, allowBookmarksBar, allowOtherBookmarks, allowMobileBookmarks, parentFolderID, numberOfColumns);
					}

					currentFolderSpan.innerHTML = currentFolderNode[0].title;
				});
			}
			else {
				back.className = '';

				currentFolderSpan.innerHTML = '';
			}

			focusOnBookmarks();
		});
	}
}

function settingsLink() {
	document.getElementById('settings').onclick = function() {
		chrome.tabs.create({'url': '/options.html' });
	};
}

function navigate() {
	document.onkeydown = function () {
		// Get key
		key = event.key;

		// Get row and column
		rowElement = event.path[2];
		if (! rowElement.classList || ! rowElement.classList.contains('row'))
			return;
		row = parseInt(rowElement.id.split('row')[1]);
		rowCount = event.path[3].children.length;
		columns = rowElement.children;
		colCount = columns.length;
		columnId = event.path[1].dataset.id;
		col = 0;
		for (col = 0; col < columns.length; col++) {
			if (columns[col].dataset.id == columnId) {
				break;
			}
		};

		// Get alignment
		alignment = event.path[3].className;

		// Handle each key
		if (key == 'ArrowLeft') {
			// Move left
			if (col > 0) {
				newFocus = document.querySelector('#row' + String(row) + ' .favorite:nth-child(' + String(col) + ') :first-child');
				newFocus.focus();
			}

			// Move up & far right
			else if (row > 0) {
				newFocus = document.querySelector('#row' + String(row-1) + ' .favorite:last-child :first-child');
				newFocus.focus();
			}
		}
		else if (key == 'ArrowRight') {
			// Move right
			if (col < colCount - 1) {
				newFocus = document.querySelector('#row' + String(row) + ' .favorite:nth-child(' + String(col+2) + ') :first-child');
				newFocus.focus();
			}

			// Move down & far left
			else if (row < rowCount - 1) {
				newFocus = document.querySelector('#row' + String(row+1) + ' .favorite:nth-child(1) :first-child');
				newFocus.focus();
			}
		}
		else if (key == 'ArrowUp') {
			// Move up
			if (row > 0) {
				// Figure out the new column
				newCol = col+1;
				newColCount = document.querySelector('#row' + String(row-1)).children.length;
				if (newColCount != colCount) {
					if (alignment == 'center') {
						newCol = col+1 - Math.ceil((colCount-newColCount)/2);
					} else if (alignment == 'right') {
						newCol = col+1 - (colCount - newColCount);
					}
				}

				newFocus = document.querySelector('#row' + String(row-1) + ' .favorite:nth-child(' + String(newCol) + ') :first-child');
				newFocus.focus();
			}
		}
		else if (key == 'ArrowDown') {
			// Move down
			if (row < rowCount - 1) {
				// Figure out the new column
				newCol = col+1;
				newColCount = document.querySelector('#row' + String(row+1)).children.length;
				if (newColCount != colCount) {
					if (alignment == 'left' && newCol > newColCount) {
						newCol = newColCount;
					} else if (alignment == 'center') {
						newCol = col+1 - Math.ceil((colCount-newColCount)/2);
						if (newCol < 1)
							newCol = 1;
						else if (newCol > newColCount)
							newCol = newColCount;
					} else if (alignment == 'right') {
						newCol = col+1 - (colCount - newColCount);
						if (newCol < 1)
							newCol = 1;
					}
				}

				newFocus = document.querySelector('#row' + String(row+1) + ' .favorite:nth-child(' + String(newCol) + ') :first-child');
				newFocus.focus();
			}
		}
		else if (key == 'Backspace' || key == 'Escape') {
			backButton = document.getElementById('back');
			if (backButton.classList.contains('visible'))
				backButton.click();
		}
	};
}

function focusOnBookmarks() {
	newFocus = document.querySelector('#row0 .favorite:first-child :first-child');
	if (newFocus) {
		newFocus.focus();
	}
}

loadBackgroundImage();
defaultOptions();
settingsLink();
navigate();
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
	chrome.storage.sync.get(null, options => {
		if (Object.keys(options).length == 0) {
			chrome.storage.sync.set({
				// Theme
				backgroundOverlayColor: '#000000',
				backgroundOverlayOpacity: 35,
				textColor: '#FFFFFF',
				mainFont: 'Montserrat',
				accentFont: 'Marck Script',
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
	chrome.storage.sync.get(null, options => {
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
		});
	}
}

function settingsLink() {
	document.getElementById('settings').onclick = function() {
		chrome.tabs.create({'url': '/options.html' });
	};
}

loadBackgroundImage();
defaultOptions();
settingsLink();
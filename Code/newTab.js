// Variables
militaryTime = false;

bookmarksVisible = true;
bookmarksBarVisible = true;
otherBookmarksVisible = false;
mobileBookmarksVisible = false;
rootFolderID = null;
currentFolderID = null;
numberOfColumns = 3;

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
function displayBookmarks(bookmarksVisible, bookmarksBarVisible, otherBookmarksVisible, mobileBookmarksVisible, rootFolderID, currentFolderID, numberOfColumns) {
	if (bookmarksVisible) {
		favorites = document.getElementById('favorites');

		// Decide what folders to start with
		if (rootFolderID == null) {
			rootFolderID = '0';

			if (bookmarksBarVisible && !otherBookmarksVisible && !mobileBookmarksVisible) {
				rootFolderID = '1';
			}
			else if (!bookmarksBarVisible && otherBookmarksVisible && !mobileBookmarksVisible) {
				rootFolderID = '2';
			}
			else if (!bookmarksBarVisible && !otherBookmarksVisible && mobileBookmarksVisible) {
				rootFolderID = '2';
			}

			currentFolderID = rootFolderID;
		}

		chrome.bookmarks.getChildren(currentFolderID, function getBookmarks(currentFolder) {
			for (var i = 0; i < currentFolder.length; i++) {
				linkOrFolder = currentFolder[i];

				console.log(numberOfColumns);
				if (i % numberOfColumns == 0) {
					console.log('new row');
				}
				console.log(i);

				// Link
				if (linkOrFolder.url != null) {
					console.log('Link: ' + linkOrFolder.title + ', ' + linkOrFolder.url);
				}
				// Folder
				else {
					console.log('Folder: ' + linkOrFolder.title + ', ' + linkOrFolder.id);
				}
			}
		}, numberOfColumns);
	}
}



updateTimeEverySecond(militaryTime);
displayBookmarks(bookmarksVisible, bookmarksBarVisible, otherBookmarksVisible, mobileBookmarksVisible, currentFolderID, numberOfColumns);

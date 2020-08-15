// Constants
militaryTime = false;
weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function updateTime(militaryTime, weekdays, months) {
	// Time
	hourSpan = document.getElementById('hour');
	minuteSpan = document.getElementById('minute');
	secondSpan = document.getElementById('second');

	date = new Date();
	hour = date.getHours();
	minute = date.getMinutes();
	second = date.getSeconds();

	if (militaryTime) {
		if (hour < 10) {
			hour = '0' + hour;
		}
	}
	else {
		if (hour == 0) {
			hour = 12;
		}
		else if (hour > 12) {
			hour -= 12;
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


	// Weekday
	weekdaySpan = document.getElementById('weekday');
	weekday = date.getDay();
	if (weekdaySpan != null) {
		weekdaySpan.textContent = weekdays[weekday];
	}


	// Date
	monthSpan = document.getElementById('month');
	month = date.getMonth();
	if (monthSpan != null) {
		monthSpan.textContent = months[month];
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
function updateTimeEverySecond(militaryTime, weekdays, months) {
	updateTime(militaryTime, weekdays, months);

	date = new Date();
	millisecondsLeft = date.getMilliseconds();

	setTimeout(function() {
		updateTime(militaryTime, weekdays, months);
		setInterval(function() {
			updateTime(militaryTime, weekdays, months);
		}, 1000);
	}, millisecondsLeft);
}

updateTimeEverySecond(militaryTime, weekdays, months);

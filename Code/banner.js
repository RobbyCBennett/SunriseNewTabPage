function displayBanner() {
	message1 = "<a href='mailto:rob@codebyrob.com?Subject=Swift%20Tab%20Switcher%20-%20Support' target='_blank'>Contact me</a> about questions, feature requests, bugs, and feedback";
	message2 = "<a href='https://www.paypal.me/rcbennett' target='_blank'>Support me</a> with a donation";
	message3 = "<a href='https://chrome.google.com/webstore/detail/pdncaffclfaalcafoebejjbefknohkjg/reviews' target='_blank'>Rate this extension</a> on the Chrome Web Store";
	message4 = "<a href='https://chrome.google.com/webstore/detail/pdncaffclfaalcafoebejjbefknohkjg' target='_blank'>Share this extension</a> with others";

	min = 1;
	max = 4;
	num = Math.floor(Math.random() * (max - min + 1)) + min;

	if (num == 1) {
		document.getElementById("bannerMessage").innerHTML = message1;
	}
	else if (num == 2) {
		document.getElementById("bannerMessage").innerHTML = message2;
	}
	else if (num == 3) {
		document.getElementById("bannerMessage").innerHTML = message3;
	}
	else if (num == 4) {
		document.getElementById("bannerMessage").innerHTML = message4;
	}

	// First time message
	firstTimeMessage = "Thanks for installing my extension!";

	chrome.storage.sync.get(null,
		function (values) {
			if (!values.firstTime) {
				document.getElementById("bannerMessage").innerHTML = firstTimeMessage;
				chrome.storage.sync.set({ firstTime: true });
			}
		}
	);

	document.styleSheets[0].addRule("#banner", "display: block");
}

displayBanner();



// Close banner on click
document.getElementById("close").addEventListener("click", function closeBanner() {
	document.styleSheets[0].addRule("#banner", "display: none");
});

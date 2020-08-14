// Set defaults
chrome.storage.sync.get(["skip", "dual"], function(obj) {
    if (obj.skip == undefined) {
        chrome.storage.sync.set({
            skip: false
        }, function() {})
    }
	if (obj.dual == undefined) {
        chrome.storage.sync.set({
            dual: true
        }, function() {})
    }
});

// Main
chrome.commands.onCommand.addListener(function getCommand(command) {
    chrome.tabs.query({currentWindow: true}, function getAmountOfTabs(allTabs) {
        var len = allTabs.length;
        chrome.tabs.query({active: true, currentWindow: true}, function getCurrentAndSwitch(tabs) {
            var activeTab = tabs[0];
            if (activeTab != undefined) {
                var newTabIndex = activeTab.index;
                if (command == "rightTab") {
					chrome.windows.getLastFocused({windowTypes: ["normal"]}, function getCurrentWindow(currentWindow) {
						chrome.windows.getAll({windowTypes: ["normal"]}, function getWindows(windows) {
							var leftWindow = null;
							var rightWindow = null;
							if (windows.length == 2) {
								if (windows[0].left < windows[1].left) {
									leftWindow = windows[0];
									rightWindow = windows[1];
								}
								else {
									leftWindow = windows[1];
									rightWindow = windows[0];
								}
							}

							var switchWindow = null;

							chrome.storage.sync.get(["skip", "dual"], function getOptions(options) {
								if (options.skip == true) {
									newTabIndex += 1;
									if (newTabIndex >= len) {
										newTabIndex = 0;
										if (options.dual == true) {
											if (rightWindow != null) {
												if (rightWindow.id != currentWindow.id) {
													switchWindow = rightWindow.id;
												}
												else {
													switchWindow = leftWindow.id;
												}
											}
										}
									}
								}
								else {
									if (newTabIndex < len - 1) {
										newTabIndex += 1;
									}
									else if (options.dual == true) {
										if (rightWindow != null) {
											if (rightWindow.id != currentWindow.id) {
												switchWindow = rightWindow.id;
											}
										}
									}
								}
								if (switchWindow != null) {
									chrome.tabs.query({currentWindow: false}, function getCurrentAndSwitch(allOtherTabs) {
										chrome.windows.update(switchWindow, {focused: true}, function() {
											chrome.tabs.update(allOtherTabs[0].id, {active: true}, function() {});
										});
									});
								}
								else {
									chrome.tabs.update(allTabs[newTabIndex].id, {active: true}, function() {});
								}
							});
						});
					});

                }
                else if (command == "leftTab") {

					chrome.windows.getLastFocused({windowTypes: ["normal"]}, function getCurrentWindow(currentWindow) {
						chrome.windows.getAll({windowTypes: ["normal"]}, function getWindows(windows) {
							var leftWindow = null;
							var rightWindow = null;
							if (windows.length == 2) {
								if (windows[0].left < windows[1].left) {
									leftWindow = windows[0];
									rightWindow = windows[1];
								}
								else {
									leftWindow = windows[1];
									rightWindow = windows[0];
								}
							}

							var switchWindow = null;

							chrome.storage.sync.get(["skip", "dual"], function getOptions(options) {
								if (options.skip == true) {
									newTabIndex -= 1;
									if (newTabIndex < 0) {
										newTabIndex = len - 1;
										if (options.dual == true) {
											if (leftWindow != null) {
												if (rightWindow.id != currentWindow.id) {
													switchWindow = rightWindow.id;
												}
												else {
													switchWindow = leftWindow.id;
												}
											}
										}
									}
								}
								else {
									if (newTabIndex > 0) {
										newTabIndex -= 1;
									}
									else if (options.dual == true) {
										if (leftWindow != null) {
											if (leftWindow.id != currentWindow.id) {
												switchWindow = leftWindow.id;
											}
										}
									}
								}
								if (switchWindow != null) {
									chrome.tabs.query({currentWindow: false}, function getCurrentAndSwitch(allOtherTabs) {
										var otherLen = allOtherTabs.length;
										chrome.windows.update(switchWindow, {focused: true}, function() {
											chrome.tabs.update(allOtherTabs[otherLen - 1].id, {active: true}, function() {});
										});
									});
								}
								else {
									chrome.tabs.update(allTabs[newTabIndex].id, {active: true}, function() {});
								}
							});
						});
					});

                }
            }
        });
    });
});

// Browser icon button
chrome.browserAction.onClicked.addListener(function openOptions() {
    window.open("options.html", "_blank");
});

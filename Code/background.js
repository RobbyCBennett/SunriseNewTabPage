// Set defaults
// chrome.storage.sync.get(['skip', 'dual'], function(obj) {
//     if (obj.skip == undefined) {
//         chrome.storage.sync.set({
//             skip: false
//         }, function() {})
//     }
// 	if (obj.dual == undefined) {
//         chrome.storage.sync.set({
//             dual: true
//         }, function() {})
//     }
// });

// Browser icon button
chrome.browserAction.onClicked.addListener(function openOptions() {
    window.open('options.html', '_blank');
});

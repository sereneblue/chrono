browser.browserAction.onClicked.addListener(activeTab => {
  browser.runtime.openOptionsPage();
});

browser.commands.onCommand.addListener(command => {
  browser.runtime.openOptionsPage();
});

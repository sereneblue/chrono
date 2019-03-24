import * as types from './mutation-types';

export const changeMonth = ({ commit }, payload) => {
  commit(types.CHANGE_MONTH, payload);
};

export const changeTheme = ({ commit }, payload) => {
  commit(types.CHANGE_THEME, payload);
  browser.storage.local.set({'themeColor': payload });
};

export const removeHistory = ({ commit, state }, payload) => {
  let browserHistory = state.visits;

  for (var i in browserHistory) {
    browserHistory[i].visits = browserHistory[i].visits.filter(v => v.url !== payload);
  }

  commit(types.UPDATE_VISITS, browserHistory);
};

export const toggleDarkMode = ({ commit }, payload) => {
  commit(types.TOGGLE_DARK_MODE, payload);
  browser.storage.local.set({'darkModeEnabled': payload });
};

export const updateGroupByDomain = ({ commit }, payload) => {
  commit(types.UPDATE_GROUP_BY_DOMAIN, payload);
  browser.storage.local.set({'groupByDomain': payload });
};

export const updateHistoryOpen = ({ commit }, payload) => {
  commit(types.UPDATE_HISTORY_OPEN, payload);
};

export const updateMainTab = ({ commit }, payload) => {
  commit(types.UPDATE_MAIN_TAB, payload);
  browser.storage.local.set({'mainTab': payload });
};

export const updateRange = ({ commit }, payload) => {
  commit(types.UPDATE_RANGE, payload);
  browser.storage.local.set({'statsRange': payload });
};

export const updateSettings = async ({ commit }) => {  
  let settings = await browser.storage.local.get();

  if (settings.hasOwnProperty('mainTab')) {
    commit(types.UPDATE_MAIN_TAB, settings.mainTab);
    commit(types.UPDATE_TAB, settings.mainTab);
  }
  if (settings.hasOwnProperty('darkModeEnabled')) commit(types.TOGGLE_DARK_MODE, settings.darkModeEnabled);
  if (settings.hasOwnProperty('statsRange')) commit(types.UPDATE_RANGE, settings.statsRange);
  if (settings.hasOwnProperty('themeColor')) commit(types.CHANGE_THEME, settings.themeColor);
  if (settings.hasOwnProperty('groupByDomain')) commit(types.UPDATE_GROUP_BY_DOMAIN, settings.groupByDomain);

  commit(types.LOADED);
}

export const updateViewDay = ({ commit }, payload) => {
  commit(types.UPDATE_VIEW_DAY, payload);
};

export const updateVisits = ({ commit }, payload) => {
  commit(types.UPDATE_VISITS, payload);
}
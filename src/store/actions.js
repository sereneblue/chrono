import * as types from './mutation-types';

export const changeTheme = ({ commit }, payload) => {
  commit(types.CHANGE_THEME, payload);
  browser.storage.local.set({'themeColor': payload });
};

export const toggleDarkMode = ({ commit }, payload) => {
  commit(types.TOGGLE_DARK_MODE, payload);
  browser.storage.local.set({'darkModeEnabled': payload });
};

export const updateRange = ({ commit }, payload) => {
  commit(types.UPDATE_RANGE, payload);
  browser.storage.local.set({'statsRange': payload });
};

export const updateSettings = async ({ commit }) => {  
  let settings = await browser.storage.local.get();

  if (settings.hasOwnProperty('mainView')) {
    commit(types.UPDATE_TAB, settings.mainView);
    commit(types.UPDATE_VIEW, settings.mainView);
  }
  if (settings.hasOwnProperty('darkModeEnabled')) commit(types.TOGGLE_DARK_MODE, settings.darkModeEnabled);
  if (settings.hasOwnProperty('statsRange')) commit(types.UPDATE_RANGE, settings.statsRange);
  if (settings.hasOwnProperty('themeColor')) commit(types.CHANGE_THEME, settings.themeColor);

  commit(types.LOADED);
}

export const updateView = ({ commit }, payload) => {
  commit(types.UPDATE_VIEW, payload);
  browser.storage.local.set({'mainView': payload });
};
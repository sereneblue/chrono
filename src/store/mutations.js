import * as types from './mutation-types';

export default {
  [types.CHANGE_THEME](state, payload) {
    state.themeColor = payload;
  },
  [types.LOADED](state) {
    state.loaded = true;
  },
  [types.TOGGLE_DARK_MODE](state, payload) {
    state.darkModeEnabled = payload;
  },
  [types.UPDATE_TAB](state, payload) {
    state.activeTab = payload;
  },
  [types.UPDATE_VIEW](state, payload) {
    state.mainView = payload;
  }
};

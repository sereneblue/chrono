import * as types from './mutation-types';

export default {
  [types.CHANGE_THEME](state, payload) {
    state.themeColor = payload;
  },
  [types.CHANGE_VIEW](state, payload) {
    state.mainView = payload;
  },
  [types.LOADED](state) {
  	state.loaded = true;
  },
  [types.TOGGLE_DARK_MODE](state, payload) {
    state.darkModeEnabled = payload;
  }
};

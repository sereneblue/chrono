import Vue from 'vue';
import * as types from './mutation-types';

export default {
  [types.CHANGE_MONTH](state, payload) {
    state.month = payload;
  },
  [types.CHANGE_THEME](state, payload) {
    state.themeColor = payload;
  },
  [types.LOADED](state) {
    state.loaded = true;
  },
  [types.TOGGLE_DARK_MODE](state, payload) {
    state.darkModeEnabled = payload;
  },
  [types.UPDATE_HISTORY_OPEN](state, payload) {
    state.historyOpen = payload;
  },
  [types.UPDATE_MAIN_TAB](state, payload) {
    state.mainTab = payload;
  },
  [types.UPDATE_RANGE](state, payload) {
    state.statsRange = payload;
  },
  [types.UPDATE_TAB](state, payload) {
    state.activeTab = payload;
  },
  [types.UPDATE_VIEW_DAY](state, payload) {
    state.viewDay = payload;
  },
  [types.UPDATE_VISITS](state, payload) {
    state.visits.length = 0;
    Vue.set(state, 'visits', payload);
  }
};

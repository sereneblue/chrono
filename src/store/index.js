import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	activeTab: 'history',
    darkModeEnabled: true,
    mainView: 'history',
    loaded: false,
    statsRange: '3m',
    themeColor: 'indigo'
  },
  mutations,
  actions
});

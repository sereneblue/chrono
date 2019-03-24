import Vue from 'vue';
import Vuex from 'vuex';

import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
  	activeTab: 'history',
    darkModeEnabled: true,
    groupByDomain: false,
    historyOpen: false,
    loaded: false,
    mainTab: 'history',
    month: '',
    statsRange: '3m',
    themeColor: 'indigo',
    viewDay: "",
    visits: []
  },
  mutations,
  actions
});

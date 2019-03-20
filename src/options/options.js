import 'material-design-icons-iconfont/dist/material-design-icons.css'

import Vue from 'vue';
import App from './App';
import Chart from 'chart.js';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'typeface-roboto';

import moment from 'moment'
import store from '../store';

Vue.prototype.$moment = moment;
Vue.use(Vuetify);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store
});

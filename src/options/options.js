import 'material-design-icons-iconfont/dist/material-design-icons.css'

import Vue from 'vue';
import App from './App';
import Chart from 'chart.js';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'typeface-roboto';

import colors from 'vuetify/es5/util/colors';
import moment from 'moment'
import store from '../store';

Vue.prototype.$copy = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
Vue.prototype.$colors = colors;
Vue.prototype.$moment = moment;

Vue.use(Vuetify);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store
});

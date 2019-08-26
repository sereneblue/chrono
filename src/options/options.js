import Vue from 'vue';
import App from './App';
import Chart from 'chart.js';
import vuetify from '../plugins/vuetify';
import 'typeface-roboto';

import colors from 'vuetify/es5/util/colors';
import moment from 'moment';
import store from '../store';

Vue.prototype.$copy = text => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
Vue.prototype.$colors = colors;
Vue.prototype.$moment = moment;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  store,
  vuetify,
});

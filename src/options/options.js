import 'material-design-icons-iconfont/dist/material-design-icons.css'

import Vue from 'vue';
import App from './App';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import 'typeface-roboto';

Vue.use(Vuetify);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
});

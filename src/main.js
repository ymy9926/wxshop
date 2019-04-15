// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import App from './App';
import goods from './components/goods/goods';
import seller from './components/seller/seller';
import tatings from './components/tatings/tatings';

import './assets/iconfont.eot';
import './assets/iconfont.svg';
import './assets/iconfont.ttf';
import './assets/iconfont.woff';
import './assets/iconfont.woff2';

import './common/stylus/index.styl';
import './assets/iconfont.css';

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false;

let router = new VueRouter({
  linkActiveClass: 'active',
  routes: [{
    path: '/',
    component: goods
  },{
    path: '/goods',
    component: goods
  }, {
    path: '/tatings',
    component: tatings
  }, {
    path: '/seller',
    component: seller
  }]
});



/* eslint-disable no-new */
var app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});


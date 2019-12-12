import Vue from 'vue'
import App from './App.vue'
import router from "./common/router"
import store from './common/store'
import http from './common/http'

Vue.config.productionTip = false
Vue.prototype.$http = http

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')

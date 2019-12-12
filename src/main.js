import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import axios from 'axios'
// import VueFetch from 'vue-fetch'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.config.productionTip = false
axios.defaults.baseURL = 'api/10221482807763886'
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'
// axios.defaults.headers.common['Access-Control-Allow-Credentials'] = true
// axios.defaults.headers.common['Access-Control-Max-Age'] = 1
// axios.interceptors.response.use((response) => {
//     return response
// }, (error) => {
//     if (error.response && error.response.data && error.response.data.location) {
//         window.location = error.response.data.location
//     } else {
//         return Promise.reject(error)
//     }
// })

Vue.prototype.$http = axios
// Vue.use(VueFetch, {
//    // polyfill: true   //should vue-fetch load promise polyfill, set to false to use customer polyfill
// });


import Home from './pages/Home.vue'

const routes = [
    {path: '/', component: Home},
]

const router = new VueRouter({
    routes
})

const store = new Vuex.Store({
    state: {
        user: null,
        heroData: [],
    },
    mutations: {
        addUser(state, user) {
            state.user = user
        },
        removeUser(state) {
            state.user = null
        },
        addHero(state, hero) {
            state.heroData.push(hero)
        },
        setHeroData(state, heroData) {
            state.heroData = heroData
        },
        clearHeroData(state) {
            state.heroData = [];
        }
    },
    getters: {
        getUser: (state) => {
            return state.user
        },
        getHeroData: (state) => {
            return state.heroData
        }
    }
})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')

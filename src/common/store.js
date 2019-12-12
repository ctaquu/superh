import Vue from 'vue'
import Vuex from 'vuex'
import * as actionTypes from '../common/action-types'
import * as mutationTypes from '../common/mutation-types'
import http from '../common/http'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        user: null,
        heroData: [],
    },
    mutations: {
        [mutationTypes.ADD_USER](state, user) {
            state.user = user
        },
        [mutationTypes.REMOVE_USER](state) {
            state.user = null
        },
        [mutationTypes.ADD_HERO](state, hero) {
            state.heroData.push(hero)
        },
        [mutationTypes.SET_HERO_DATA](state, heroData) {
            state.heroData = heroData
        },
        [mutationTypes.CLEAR_HERO_DATA](state) {
            state.heroData = [];
        }
    },
    actions: {
        [actionTypes.ADD_RANDOM_HERO]({commit}) {
            return new Promise(resolve => {

                http.get(`${Math.floor(Math.random() * 731)}`)
                    .then(response => {
                        commit(mutationTypes.ADD_HERO, response.data)
                        resolve()
                    })
                    .catch(e => {
                        // eslint-disable-next-line no-console
                        console.error('E0006', e)
                    })
            })
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

export default store
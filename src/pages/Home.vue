<template>
    <div v-if="user !== null">
        <div class="search field has-addons">
            <div class="control">
                <input class="input" placeholder="Call for a SuperHero" type="text" v-model="heroSearchString">
            </div>
            <div class="control">
                <a :disabled="searchButtonDisabled" @click.prevent="searchForHeroes" class="button is-info">
                    Deploy
                </a>
                <a :disabled="resetButtonDisabled" @click.prevent="handleResetHeroes"
                   class="button btn-recall is-info">
                    Recall
                </a>
            </div>
        </div>
        <progress class="progress is-small is-primary" max="100" v-if="fetchingData">15%</progress>
        <div id="container">
            <hero :hero-data="heroDatum" :key="index" v-for="(heroDatum, index) in heroData"/>
        </div>
    </div>
</template>

<script>

    import * as constants from '../common/constants'
    import * as actionTypes from '../common/action-types'
    import * as mutationTypes from '../common/mutation-types'
    import Hero from '../components/Hero'

    export default {
        name: 'Home',
        components: {
            Hero
        },
        data() {
            return {
                heroSearchString: '',
                fetchingData: true,
                mode: constants.APP_MODE_DEFAULT,
            }
        },
        beforeMount() {
            this.getRandomNHeroes(6)
        },
        mounted() {
            this.scroll();
        },
        props: {},
        computed: {
            heroData() {
                return this.$store.getters.getHeroData
            },
            user() {
                return this.$store.getters.getUser
            },
            searchButtonDisabled() {
                return this.heroSearchString.length < 2
            },
            resetButtonDisabled() {
                return this.mode === constants.APP_MODE_DEFAULT
            }
        },
        methods: {
            searchForHeroes() {
                this.fetchingData = true;
                this.$http.get(`search/${this.heroSearchString}`)
                    .then(response => {
                        this.$store.commit(mutationTypes.SET_HERO_DATA, response.data.results)
                        this.fetchingData = false;
                        this.mode = constants.APP_MODE_SEARCH;
                    })
                    .catch(e => {
                        // eslint-disable-next-line no-console
                        console.error('E0003', e)
                    })
            },
            handleResetHeroes() {
                this.$store.commit(mutationTypes.CLEAR_HERO_DATA)
                this.getRandomNHeroes(6)
            },
            addRandomHero() {
                this.fetchingData = true
                this.$store.dispatch(actionTypes.ADD_RANDOM_HERO)
                    .then(() => {
                        this.fetchingData = false;
                    })
            },
            getRandomNHeroes(numberOfHeroes) {
                this.fetchingData = true
                this.mode = constants.APP_MODE_DEFAULT

                for (let i = 0; i < numberOfHeroes; i++) {
                    this.addRandomHero()
                }

                this.fetchingData = false;
            },
            scroll() {
                window.onscroll = () => {
                    let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight === document.documentElement.offsetHeight;

                    if (bottomOfWindow && this.mode === constants.APP_MODE_DEFAULT) {
                        this.getRandomNHeroes(6)
                    }
                };
            },
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #container {
        display: flex;
        justify-content: space-evenly;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .search {
        margin: 0 auto 20px auto;
        justify-content: center;
    }

    .progress {
        width: 90vw;
        position: fixed;
        bottom: 10px;
        left: 5vw;
        z-index: 1000;
    }

    .btn-recall {
        margin-left: 20px;
        background-color: #e83535 !important;
    }

    h3 {
        margin: 40px 0 0;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        display: inline-block;
        margin: 0 10px;
    }

    a {
        color: #42b983;
    }

    @media only screen
    and (min-device-width: 375px)
    and (max-device-width: 667px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
        #container {
            flex-direction: column;
        }
    }


</style>

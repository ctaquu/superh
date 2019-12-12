<template>
    <div v-if="user !== null">
        <div class="search field has-addons" v-if="!isAppModeFilter">
            <div class="control">
                <input class="input" placeholder="Call for a SuperHero" type="text" v-model="heroSearchString"
                       v-on:keyup.enter="searchForHeroes">
            </div>
            <div class="control">
                <a :disabled="searchButtonDisabled" @click.prevent="searchForHeroes" class="button is-info">
                    Deploy
                </a>
                <a :disabled="!isAppModeSearch" @click.prevent="handleResetHeroes"
                   class="button btn-recall is-info">
                    Recall
                </a>
            </div>
        </div>
        <div>
            <a @click.prevent="openFilters" class="button btn-open-filters is-info" v-if="!isAppModeFilter">
                &#11015; Open Awesome!! Filters &#11015;
            </a>
            <a @click.prevent="closeFilters" class="button btn-recall is-info" v-if="isAppModeFilter">
                &#11014; Close Awesome!! Filters &#11014;
            </a>
            <div id="filter-container" v-if="isAppModeFilter">
                <HeroFilter :val="intelligenceFilter" color="#ff0000" key="filter-intelligence" name="intelligence"
                            v-on:filter-change="handleSliderChange"/>
                <HeroFilter :val="strengthFilter" color="#307bbb" key="filter-strength" name="strength"
                            v-on:filter-change="handleSliderChange"/>
                <HeroFilter :val="speedFilter" color="#000000" key="filter-speed" name="speed"
                            v-on:filter-change="handleSliderChange"/>
                <HeroFilter :val="durabilityFilter" color="#ff22ff" key="filter-durability" name="durability"
                            v-on:filter-change="handleSliderChange"/>
                <HeroFilter :val="powerFilter" color="#e08833" key="filter-power" name="power"
                            v-on:filter-change="handleSliderChange"/>
                <HeroFilter :val="combatFilter" color="#5fd400" key="filter-combat" name="combat"
                            v-on:filter-change="handleSliderChange"/>

            </div>
        </div>
        <progress class="progress is-small is-primary" max="100" v-if="fetchingData">15%</progress>
        <div id="container">
            <Hero :hero-data="heroDatum" :key="index" v-for="(heroDatum, index) in heroData"/>
        </div>
    </div>
</template>

<script>

    import * as constants from '../common/constants'
    import * as actionTypes from '../common/action-types'
    import * as mutationTypes from '../common/mutation-types'
    import Hero from '../components/Hero'
    import HeroFilter from '../components/HeroFilter'

    export default {
        name: 'Home',
        components: {
            HeroFilter,
            Hero
        },
        data() {
            return {
                heroSearchString: '',
                fetchingData: true,
                mode: constants.APP_MODE_DEFAULT,
                allHeroes: [],
                // filters
                intelligenceFilter: this.getRandomishFilterStartValue(),
                strengthFilter: this.getRandomishFilterStartValue(),
                speedFilter: this.getRandomishFilterStartValue(),
                durabilityFilter: this.getRandomishFilterStartValue(),
                powerFilter: this.getRandomishFilterStartValue(),
                combatFilter: this.getRandomishFilterStartValue(),
            }
        },
        beforeMount() {
            this.getRandomNHeroes(6)
        },
        mounted() {
            this.scroll()
        },
        props: {},
        computed: {
            powerstatTypes() {
                return constants.POWERSTATS_TYPES;
            },
            heroData() {
                return this.$store.getters.getHeroData
            },
            user() {
                return this.$store.getters.getUser
            },
            searchButtonDisabled() {
                return this.heroSearchString.length < 2
            },
            isAppModeDefault() {
                return this.mode === constants.APP_MODE_DEFAULT
            },
            isAppModeSearch() {
                return this.mode === constants.APP_MODE_SEARCH
            },
            isAppModeFilter() {
                return this.mode === constants.APP_MODE_FILTER
            },
        },
        methods: {
            handleSliderChange(data) {
                this[`${data.type}Filter`] = parseInt(data.event.target.value);
                this.updateFilteredHeroes()
            },
            getRandomishFilterStartValue() {
                return constants.STARTING_POWERSTAT_VALUE + Math.floor(Math.random() * 10);
            },
            updateFilteredHeroes() {
                const updatedHeroData = this.allHeroes
                    .filter(heroData => {

                        const valid = {};
                        constants.POWERSTATS_TYPES.forEach(powerstatType => valid[powerstatType] = false)

                        constants.POWERSTATS_TYPES.forEach(powerstatType => {
                            if (isNaN(heroData.powerstats[powerstatType])) {
                                // do nothing
                            } else {
                                if (parseInt(heroData.powerstats[powerstatType]) >= this[`${powerstatType}Filter`]) {
                                    valid[powerstatType] = true;
                                }
                            }
                        })

                        return Object.keys(valid).every(function (k) {
                            return valid[k] === true
                        });
                    })
                this.$store.commit(mutationTypes.SET_HERO_DATA, updatedHeroData)
            },
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
                        console.info('E0003', e)
                    })
            },
            handleResetHeroes() {
                this.$store.commit(mutationTypes.CLEAR_HERO_DATA)
                this.heroSearchString = ''
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

                    if (bottomOfWindow) {
                        if (this.mode === constants.APP_MODE_DEFAULT) {
                            this.getRandomNHeroes(6)
                        }
                        if (this.mode === constants.APP_MODE_FILTER) {
                            this.updateFilteredHeroes()
                        }
                    }
                };
            },
            getOneHeroByID(heroID) {
                return new Promise(resolve => {

                    this.$http.get(heroID)
                        .then(response => {
                            resolve(response.data)
                        })
                        .catch(e => {
                            // eslint-disable-next-line no-console
                            console.info('E0008', e)
                        })
                })
            },
            async getAllHeroesForFiltering() {

                //TODO: not every API is successful, check how to fallback...

                this.$store.commit(mutationTypes.CLEAR_HERO_DATA)
                this.fetchingData = true;
                this.mode = constants.APP_MODE_FILTER

                for (let i = 0; i < constants.ESTIMATED_TOTAL_NUMBER_OF_HEROES; i++) {
                    this.getOneHeroByID(`${i}`)
                        .then(heroData => {
                            if (heroData.response === 'success') {
                                this.allHeroes.push(heroData)
                            }
                        })
                }

                setTimeout(() => {
                    this.updateFilteredHeroes()
                    this.fetchingData = false;
                }, 5000)

                //TODO: consider setInterval for this.updateFilteredHeroes()

            },
            openFilters() {
                this.getAllHeroesForFiltering()
            },
            closeFilters() {
                this.$store.dispatch(mutationTypes.CLEAR_HERO_DATA)
                this.getRandomNHeroes(6)
            }
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

    #filter-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        margin: 15px;
        border: 1px solid #0202021a;
        padding: 10px;
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

        .btn-open-filters {
            display: none;
        }
    }


</style>

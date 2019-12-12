<template>
    <div v-if="user !== null">
        <div class="search field has-addons">
            <div class="control">
                <input class="input" placeholder="Call for a SuperHero" type="text" v-model="heroSearchString">
            </div>
            <div class="control">
                <a :disabled="heroSearchString.length < 2" @click.prevent="searchForHeroes" class="button is-info">
                    Deploy
                </a>
                <a :disabled="!searched" @click.prevent="getRandomNHeroes(6)" class="button btn-recall is-info">
                    Recall
                </a>
            </div>
        </div>
        <progress class="progress is-small is-primary" max="100" v-if="fetchingData">15%</progress>
        <div id="container" v-if="!fetchingData">
            <hero :hero-data="heroDatum" :key="index" v-for="(heroDatum, index) in heroData"/>
        </div>
    </div>
</template>

<script>

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
                searched: false,
                // heroData: [],
            }
        },
        mounted() {
            this.getRandomNHeroes(6)
        },
        props: {},
        computed: {
            heroData() {
                return this.$store.getters.getHeroData
            },
            user() {
                return this.$store.getters.getUser
            },
        },
        methods: {
            searchForHeroes() {
                this.fetchingData = true;
                this.$http.get(`search/${this.heroSearchString}`)
                    .then(response => {
                        this.$store.commit('setHeroData', response.data.results)
                        this.fetchingData = false;
                        this.searched = true;
                    })
                    .catch(e => {
                        // eslint-disable-next-line no-console
                        console.error('E0003', e)
                    })
            },
            getRandomNHeroes(numberOfHeroes) {
                this.fetchingData = true
                this.searched = false
                this.$store.commit('clearHeroData')
                for (let i = 0; i < numberOfHeroes; i++) {
                    this.$http.get(`${Math.floor(Math.random() * 731)}`)
                        .then(response => {
                            this.$store.commit('addHero', response.data)
                        })
                        .catch(e => {
                            // eslint-disable-next-line no-console
                            console.error('E0004', e)
                        })
                }

                this.fetchingData = false;
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

    .progress {
        width: 66vw;
        margin: 0 auto;
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

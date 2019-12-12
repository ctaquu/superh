<template>
    <div id="app">
        <div v-if="user !== null">
            <img alt="Superheroes Banner Online" class="img-banner" id="img-banner-online" src="./assets/banner.png">
            <div @click.prevent="toggleProfileDropdown" class="dropdown" id="logged-in-hero-icon"
                 v-bind:class="{'is-active' : profileDropdownActive}">
                <div class="dropdown-trigger">
                    <button @blur.prevent="hideProfileDropdown" aria-controls="dropdown-menu2" aria-haspopup="true"
                            class="button btn-logged-in-hero">
                        <img :src="userProfileImage"
                             alt="Hero Profile Image"
                             id="img-hero-profile">
                        <span class="icon is-small">
                            <i aria-hidden="true" class="fas fa-angle-down"></i>
                        </span>
                    </button>
                </div>
                <div class="dropdown-menu" id="dropdown-menu2" role="menu">
                    <div class="dropdown-content">
                        <a @click.prevent="logout" class="dropdown-item" href="#">
                            Logout
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="user === null">
            <img alt="Superheroes Banner Offline" class="img-banner" id="img-banner-offline"
                 src="./assets/banner-gray.jpg">
            <div id="firebaseui-auth-container"></div>
        </div>
        <router-view>
        </router-view>
    </div>
</template>

<script>
    import {firebaseApp, authStatic, auth} from './common/firebase'
    import * as firebaseui from 'firebaseui'
    import * as _ from 'lodash'


    export default {
        name: 'app',
        components: {},
        data() {
            return {
                profileDropdownActive: false,
            }
        },
        mounted() {
            auth.onAuthStateChanged(user => {
                if (user) {
                    this.$store.commit('addUser', _.pick(user, [
                        'displayName',
                        'photoURL',
                        'email',
                        'phoneNumber'
                    ]))
                } else {
                    // User is signed out.
                    this.$store.commit('removeUser');
                }
            })
        },
        computed: {
            user() {
                return this.$store.getters.getUser
            },
            userProfileImage() {
                return this.user.photoURL ? this.user.photoURL : require('./assets/profile-image-placeholder.png')
            }
        },
        methods: {
            logout() {
                auth.signOut().then(function () {
                }).catch(e => {
                    // eslint-disable-next-line no-console
                    console.error('E0001', e)
                });
            },
            toggleProfileDropdown() {
                this.profileDropdownActive = !this.profileDropdownActive
            },
            hideProfileDropdown() {
                setTimeout(() => {
                    this.profileDropdownActive = false
                }, 1000)
            }
        }
    }


    doFirebaseAuthStuff();

    function doFirebaseAuthStuff() {
        // firebase UI config
        const uiConfig = {
            signInSuccessUrl: '/',
            signInOptions: [
                authStatic.GoogleAuthProvider.PROVIDER_ID,
                authStatic.EmailAuthProvider.PROVIDER_ID,
                authStatic.PhoneAuthProvider.PROVIDER_ID,
            ],
        };

        // Initialize the FirebaseUI Widget using Firebase.
        const ui = new firebaseui.auth.AuthUI(firebaseApp.auth());

        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);
    }

</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        /*margin-top: 60px;*/
    }

    .img-banner {
        width: 60vw;
    }

    #logged-in-hero-icon {
        position: absolute;
        top: 2vh;
        right: 2vw;
        width: 100px;
        cursor: pointer;
    }

    .btn-logged-in-hero {
        border: 0;
        height: 80px;
        background-color: #fff0;
    }

    #img-hero-profile {
        border-radius: 50%;
        width: 100%;
        border: 2px solid #eee;
    }
</style>

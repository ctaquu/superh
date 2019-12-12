<template>
    <div class="hero">
        <div class="card" v-if="heroData.name">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img :src="imageURL" @error="handleImageNotFound" alt="Placeholder image" class="img-cover">
                </figure>
            </div>
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img :src="imageURL" alt="Placeholder image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4">{{ heroData.name }}</p>
                        <p class="subtitle is-6">{{ heroData.biography['full-name'] }}</p>
                    </div>
                </div>

                <div class="content">
                    <bio-detail :data="heroData.work['base']" title="Location"/>
                    <bio-detail :data="heroData.appearance['gender']" title="Gender"/>
                    <bio-detail :data="heroData.appearance['race']" title="Race"/>
                    <bio-detail :data="heroData.appearance['height'][1]" title="Height"/>
                    <bio-detail :data="heroData.appearance['weight'][1]" title="Weight"/>
                    <bio-detail :data="heroData.biography['first-appearance']" title="First Appearance"/>
                    <bio-detail :data="heroData.biography['publisher']" title="Publisher"/>
                    <bio-detail :data="heroData.biography['alignment']" title="Alignment"/>
                    <div class="powerstats">
                        <powerstat :percentage="heroData.powerstats['intelligence']" color="red" title="intelligence"/>
                        <powerstat :percentage="heroData.powerstats['strength']" color="" title="strength"/>
                        <powerstat :percentage="heroData.powerstats['speed']" color="black" title="speed"/>
                        <powerstat :percentage="heroData.powerstats['durability']" color="purple" title="durability"/>
                        <powerstat :percentage="heroData.powerstats['power']" color="orange" title="power"/>
                        <powerstat :percentage="heroData.powerstats['combat']" color="green" title="combat"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import BioDetail from "./Hero/BioDetail";
    import Powerstat from "./Hero/Powerstat";

    export default {
        props: {
            heroData: Object
        },
        components: {
            Powerstat,
            BioDetail
        },
        computed: {
            imageURL() {
                return this.heroData.image.url ? this.heroData.image.url : require('../assets/profile-image-placeholder.png')
            }
        },
        methods: {
            handleImageNotFound() {
                this.heroData.image.url = require('../assets/profile-image-placeholder.png')
            }
        },
        mounted() {
        }
    };
</script>

<style scoped>
    .hero {
        margin: 10px;
        max-width: 350px;
    }

    .img-cover {
        object-fit: cover;
    }

    .lbl-biography {
        font-weight: bold;
    }

    .content {
        text-align: left;
    }

    .powerstats {
        margin-top: 20px;
        display: flex;
        flex-flow: wrap;
        justify-content: space-between;
    }

    @media only screen
    and (min-device-width: 375px)
    and (max-device-width: 667px)
    and (-webkit-min-device-pixel-ratio: 2)
    and (orientation: portrait) {
        .hero {
            margin: 10px auto;
        }
    }
</style>

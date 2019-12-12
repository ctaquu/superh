<template>
    <div class="root" v-if="data !== 'null' && data !== '0 kg' && data !== '0 cm' && data !== '-'">
        <span class="lbl-biography">{{ title }}:</span> {{ data }}
    </div>
</template>

<script>
    export default {
        props: {
            title: String,
            data: String,
        },
    };
</script>

<style scoped>
    .root {
        margin-bottom: 2px;
    }

    .lbl-biography {
        font-weight: bold;
    }
</style>

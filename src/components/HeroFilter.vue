<template>
    <div class="HeroFilter">
        <div class="container">
            <label :for="`slider-${name}`" :style="cssVars" class="lbl-filter">{{ name }}</label>
            <input :id="`slider-${name}`"
                   :value="val"
                   @input="handleSliderChange"
                   max="100"
                   min="0"
                   name="points"
                   type="range">
            <span :style="cssVars" class="span-value">{{ val }}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            val: Number,
            name: String,
            color: String
        },
        computed: {
            cssVars() {
                return {
                    '--bg-color': this.color,
                }
            }
        },
        methods: {
            handleSliderChange(event) {
                this.$emit('filter-change', {
                    type: this.name,
                    event: event,
                })
            }
        },
    };
</script>

<style scoped>
    .container {
    }

    .lbl-filter {
        margin: 0 20px;
        display: block;
        color: var(--bg-color);
    }

    .span-value {
        display: block;
        color: var(--bg-color);
    }
</style>

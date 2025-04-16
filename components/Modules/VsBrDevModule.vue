<template>
    <div v-html="module.html" />
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

const props = defineProps<{
    module: Object,
}>();

const module: any = props.module;

const links = [];

for (let x = 0; x < module.headContributions.length; x++) {
    links.push({
        rel: 'stylesheet',
        href: module.headContributions[x],
    });
}

const scripts = [];

for (let x = 0; x < module.footerContributions.length; x++) {
    scripts.push({
        src: module.footerContributions[x],
    });
}

useHead({
    link: links,
    script: scripts,
});

</script>

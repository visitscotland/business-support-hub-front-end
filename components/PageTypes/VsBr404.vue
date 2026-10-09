<template>
    <VsBrHeroSectionModule
        :content="documentData"
    />
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';

import type { Component, Page } from '@bloomreach/spa-sdk';
import VsBrHeroSectionModule from '~/components/Modules/VsBrHeroSectionModule.vue';

const props = defineProps<{ component: Component, page: Page }>();

const { page } = toRefs(props);

let document : any = {
};
let documentData : any = {
};

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
}

</script>

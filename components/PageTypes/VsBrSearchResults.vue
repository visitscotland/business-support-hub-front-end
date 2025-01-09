<template>
    <!-- <VsBrHeroSectionModule :content="documentData" /> -->
    <div class="layout container-lg">
        <h1 class="vs-heading vs-heading--display-s mt-250 mb-250">Search results</h1>
        <div class="row">
            <div class="sidebar col-12 col-lg-3 ">
                <fieldset class="filter-box">
                    <legend class="control-heading">
                        Filter results
                    </legend>
                    <div class="cludo-search-controls"></div>
                </fieldset>
            </div>
            <div class="main-content col-12 col-lg-9">
                <div class="cludo-search-results"></div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue';
import type { Component, Page } from '@bloomreach/spa-sdk';
import type { TableOfContentLink } from '~/types/types';
import useConfigStore from '~/stores/configStore';
import VsBrHeroSectionModule from '~/components/Modules/VsBrHeroSectionModule.vue';
import VsBrPageIntro from '~/components/Modules/VsBrPageIntro.vue';
import VsBrModuleBuilder from '~/components/Modules/VsBrModuleBuilder.vue';
import VsBrNewsletterSignpost from '../Modules/VsBrNewsletterSignpost.vue';

const props = defineProps<{
    component: Component,
    page: Page,
}>();

const { page } = toRefs(props);

let document: any = {
};
let documentData: any = {
};
let pageItems: any[] = [];

const configStore = useConfigStore();

if (page.value) {
    document = page.value.getDocument();
    documentData = document.getData();
    pageItems = configStore.pageItems;
}

</script>

<style lang="scss">
.filter-box {
    border: solid 1px #9F9AB8;
    border-radius: 4px;
    overflow: auto;
}

.control-heading {
    display: flex;
    gap: 8px;
    background-color: #F0EFF4;
    padding: 12px 20px;
    border-bottom: solid 1px #9F9AB8;
    font-weight: 600;
    font-size: 1.25rem;
}

.control-heading::before {
    font-family: icon;
    content: '';
}
.vs-details {
    --vs-color-highlight: #A8308C;
    padding: 12px 20px;
        
        label {
            display: flex;
            gap: 8px;
            font-size: 16px;
        }
}

@font-face {
  font-family: 'icon';
  font-style: normal;
  font-weight: 900;
  font-display: block;
  src: url("/fonts/fa-regular-400.woff2");
}

.cludo-theme-current-facets {
    gap: 20px;
}

.vs-summary {
    display: flex;
    justify-content: space-between;
}
.vs-summary::after {
    font-family: icon;
    color: var(--vs-color-highlight);
    transition: all 0.5s ease;
    content: "\2b" / "";
}

.vs-details[open] {
    .vs-summary {
        margin-bottom: 12px;
        
        ::after {
            transform: rotate(180deg);
            transition: all 0.5s ease;
        }
    }
}

.vs-details[open] .vs-summary::after {
    content: "\f068" / "";
    font-family: icon;
}

.cludo-results-current-facets {
    --vs-saltire-10: #D6E5FF;
    --vs-color-text-primary: #200f2e;
    --font-size-1: 0.625rem;
    --font-size-2: 0.75rem;
    --font-size-3: 0.875rem;
    --font-size-4: 1rem;
    --font-size-5: 1.125rem;
    --font-size-6: 1.25rem;
    --font-size-7: 1.375rem;
    --font-size-8: 1.5rem;
    --font-size-9: 1.875rem;
    --font-size-10: 2.5rem;
    --font-size-body: 1rem;
    --font-size-body-md: 1.125rem;
    --font-size-lead: 1.125rem;
    --font-size-lead-md: 1.25rem;
    --font-size-teaser: 1rem;
    --font-weight-bold: 700;
    --font-weight-semi-bold: 600;
    --font-weight-normal: 400;
    --font-weight-light: 300;
    --font-family-sans-serif: "Source Sans Pro",
        --spacer-0: 0;
    --spacer-0125: 0.125rem;
    --spacer-025: 0.25rem;
    --spacer-050: 0.5rem;
    --spacer-075: 0.75rem;
    --spacer-100: 1rem;
    --spacer-125: 1.25rem;
    --spacer-150: 1.5rem;
    --spacer-175: 1.75rem;
    --spacer-200: 2rem;
    --spacer-250: 2.5rem;
    --spacer-300: 3rem;
    --spacer-400: 4rem;
    --spacer-500: 5rem;
    --spacer-600: 6rem;
    --spacer-700: 7rem;
 
    padding-bottom: var(--spacer-250);

    label {
        display: none;
    }

    >div {
        display: flex;
        gap: 2rem;
    }

    span {
        background-color: var(--vs-saltire-10);
        color: var(--vs-color-text-primary);
        font-family: var(--font-family-sans-serif);
        font-size: var(--font-size-3);
        padding: var(--spacer-025) var(--spacer-075);
        margin-right:1rem;
        border-radius: 4px;
    }

}


.cludo-theme-results-list {
    margin-top: 1rem
}

.cludo-theme-result-title {
    font-size: 1.5rem !important;
    color: #200F2E;
    font-weight: 500;
    padding-bottom: 1rem;
}
.cludo_result {
    padding: 1.5rem 0 !important;
    border-bottom: 1px solid #D3D3D3;

    a {
        color: #200f2e;
    }
}
</style>

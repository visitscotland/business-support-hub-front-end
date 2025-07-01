<template>
    <VsContainer>
        <div class="my-250">
            <VsRow>
                <VsCol
                    cols="12"
                    sm="10"
                    md="9"
                    lg="7"
                >
                    <VsHeading
                        class="vs-hero-section__heading m-lg-0"
                        level="1"
                        heading-style="display-xs"
                    >
                        Search results
                    </VsHeading>
                </VsCol>
            </VsRow>
        </div>
        <VsRow>
            <div class="col-12 col-lg-3 offset-lg-0 mb-200">
                <div class="cludo-search-controls" />
            </div>
            <div class="main-content col-12 col-lg-8  offset-lg-1">
                <div class="cludo-search-results" />
            </div>
        </VsRow>
    </VsContainer>
</template>

<script lang="ts" setup>
/* eslint no-undef: 0 */

import {
    VsContainer,
    VsHeading,
    VsRow,
} from '@visitscotland/component-library/components';

useHead({
    link: [
        {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'styles/cludo-search-results.css',
        },
    ],
    script: [
        {
            src: 'https://kit.fontawesome.com/01f07a4485.js',
            crossorigin: 'anonymous',
        },
    ],
});
</script>

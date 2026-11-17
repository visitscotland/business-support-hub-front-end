<template>
    <div class="vs-section-header mb-200 mb-xl-300">
        <VsContainer>
            <VsRow>
                <VsCol>
                    <span class="vs-section-header__divider" />
                </VsCol>
            </VsRow>
            <VsRow>
                <VsCol
                    cols="12"
                    :sm="businessSupport ? 12 : 7"
                    :md="businessSupport ? 12 : 6"
                    :lg="businessSupport ? 12 : 4"
                >
                    <VsHeading
                        :level="headingLevel"
                        :heading-style="headingStyle"
                        no-margins
                        class="mb-175 mb-lg-0"
                        :id="anchorId"
                    >
                        {{ heading }}
                    </VsHeading>
                </VsCol>
                <VsCol
                    v-if="lede"
                    cols="12"
                    :sm="businessSupport ? 12 : 10"
                    :md="businessSupport ? 12 : 9"
                    :lg="businessSupport ? 12 : 8"
                >
                    <VsBody variant="lead">
                        <div v-html="lede" />
                    </VsBody>
                </VsCol>
            </VsRow>
        </VsContainer>
    </div>
</template>

<script lang="ts" setup>
import {
    VsBody,
    VsCol,
    VsContainer,
    VsHeading,
    VsRow,
} from '@visitscotland/component-library/components';

withDefaults(defineProps<{
    anchorId?: string,
    businessSupport?: boolean,
    heading: string,
    headingLevel?: string | number,
    headingStyle?: string,
    lede?: string,
}>(), {
    anchorId: undefined,
    businessSupport: false,
    headingLevel: 2,
    headingStyle: 'heading-l',
    lede: undefined,
});
</script>

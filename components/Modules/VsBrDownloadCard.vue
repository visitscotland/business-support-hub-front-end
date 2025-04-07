<template>
    <!-- <pre>{{ props.link }}</pre> -->

    <div
        class="vs-download-card"
        data-test="vs-download-card"
    >
        <div>
            <VsIcon
                :name="`${props.link.extension}-link`"
                size="xl"
            />
        </div>

        <div>
            <VsHeading
                heading-style="heading-s"
                :level="withinNested ? 5 : 4"
            >
                {{ props.link.label }}
            </VsHeading>

            <div class="vs-download-card__published">{{ publishedText }}</div>

            <p>{{ props.link.teaser }}</p>
        </div>

        <div class="vs-download-card__cta">
            <VsButton
                :href="props.link.link"
                icon="download-link"
                icon-position="right"
            >
                {{ buttonLabel }}
            </VsButton>
        </div>
    </div>    
</template>

<script setup lang="ts">
import type { DownloadCardLink } from '~/types/types';
import { VsButton, VsHeading, VsIcon } from '@visitscotland/component-library/components';
import useConfigStore from '~/stores/configStore';

const configStore = useConfigStore();

type Props = {
    link: DownloadCardLink;
    withinNested?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    link: undefined,
    withinNested: false,
});

const buttonLabel = `${configStore.getLabel('download', 'download')} (${props.link.size})`;
const publishedText = `${configStore.getLabel('download', 'published')} ${props.link.publishedDate}`;
</script>

<style lang="scss">
.vs-download-card {
    border-radius: 0.5rem;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.30), 0px 1px 3px 1px rgba(0, 0, 0, 0.15);
    display: grid;
    gap: 1.5rem;
    grid-template-columns: 1fr;
    margin: 1.5rem 0;
    padding: 1.5rem;

    &__published {
        font-weight: 600;
        margin-bottom: 0.5rem;
    }

    &__cta {
        align-self: center;
    }

    @media (min-width: 992px) {
        grid-template-columns: auto 3fr 1fr;
    }
}
</style>

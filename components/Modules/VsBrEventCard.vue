<template>
    <VsCard
        class="vs-event-card mt-100"
        data-test="vs-event-card"
        card-style="elevated"
        :fill-color="highlight ? '#E5E5F0' : '#fff'"
    >
        <template #vs-card-header>
            <div
                class="vs-event-card__header"
            >
                <VsHeading
                    class="vs-event-card__heading"
                    heading-style="heading-xxs"
                    level="3"
                    data-test="vs-event-card__heading"
                >
                    <!-- @slot for the title of the event -->
                    <slot name="event-card-header" />
                </VsHeading>
                <VsDetail 
                    v-if="$slots['event-card-date']"
                    icon="fa-regular fa-calendar-range"
                    class="mb-100"
                    :variant="highlight ? 'tertiary' : 'secondary'"
                    :icon-variant="highlight ? 'tertiary' : 'secondary'"
                >
                    <slot name="event-card-date" />
                </VsDetail>
            </div>
        </template>

        <template #vs-card-body>
            <div
                class="vs-event-card__content"
                data-test="vs-event-card__content"
                v-if="$slots['event-card-content']"
            >
                <!-- @slot holds any content on the card (description, details, etc)-->
                <slot name="event-card-content" />
            </div>
        </template>
        <template #vs-card-footer>
            <div
                class="vs-event-card__cta"
                data-test="vs-event-card__cta"
                v-if="props.ctaHref && props.ctaLabel"
            >
                <VsButton
                    :href="props.ctaHref"
                    :icon="props.ctaIcon"
                    icon-position="right"
                    data-test="vs-event-card__cta"
                >
                    {{ props.ctaLabel }}
                </VsButton>
            </div>
        </template>

    </VsCard>
</template>

<script setup lang="ts">
import {
    VsButton,
    VsCard,
    VsDetail,
    VsHeading,
} from '@visitscotland/component-library/components';

const props = defineProps<{
    ctaHref: string,
    ctaLabel: string,
    ctaIcon: string,
    isFeatured: boolean,
}>();

const highlight = false;

</script>

<style lang="scss">
.vs-event-card {
    padding: 1rem;
    border: none;

    // &__body {
    //     width: 100%;
    //     border-bottom: 1px solid #E9E9E9;
    // }

    &__date {
        margin: auto 0;
        font-size: 1.25rem;
        font-weight: 400;
    }

    &__heading {
        margin: 0;
    }
    
    &__header {
        display: flex;
        flex-direction: column;
        margin: 0.5rem 0;
    }

    &__cta {
        margin: 1rem 0 0 0;
    }

    @media (min-width: 768px) {
        margin: 0 1rem 0 0;

        &__header {
            display: flex;
            justify-content: space-between;
            margin: 0 0 0 0;
        }

        &__heading {
            margin: 0.5rem 0;
        }

        &__date {
            text-align: right;
        }

        &__cta {
            width: fit-content;
        }
    }
}

// For some reason the card wants to be 100% by default?
.vs-card{
    height: auto;
}

.vs-card:hover {
    cursor: initial;
}
</style>

<template>
    <VsCard
        card-style="elevated"
        class="vs-br-event-card"
        v-bind="cardProps"
    >
        <template #vs-card-body>
            <div class="px-125">
                <VsBadge
                    v-if="props.isFeatured"
                    class="mt-075"
                    variant="highlight"
                >
                    <!-- TODO: Add "Featured" label from CMS. -->
                    Featured
                </VsBadge>

                <VsHeading
                    class="vs-br-event-card__heading"
                    data-test="vs-event-card__heading"
                    heading-style="heading-xxs"
                    level="3"
                >
                    <!-- @slot for the title of the event -->
                    <slot name="event-card-header" />
                </VsHeading>

                <VsDetail
                    v-if="hasCardDateSlot()"
                    class="mb-125"
                    :color="props.isFeatured ? 'tertiary' : 'secondary'"
                    icon="fa-regular fa-calendar-range"
                    :icon-variant="props.isFeatured ? 'tertiary' : 'secondary'"
                >
                    <!-- @slot for the event date -->
                    <slot name="event-card-date" />
                </VsDetail>

                <VsBody
                    v-if="hasCardContentSlot()"
                    class="vs-br-event-card__body mb-125"
                >
                    <!-- @slot holds any content on the card -->
                    <slot name="event-card-content" />
                </VsBody>
            </div>
        </template>

        <template #vs-card-footer>
            <div class="px-125">
                <VsButton
                    v-if="props.ctaHref && props.ctaLabel"
                    class="vs-br-event-card__cta mb-075"
                    data-test="vs-br-event-card__cta"
                    :href="props.ctaHref"
                    v-bind="ctaIconProps"
                >
                    {{ props.ctaLabel }}
                </VsButton>
            </div>
        </template>
    </VsCard>
</template>

<script setup lang="ts">
import {
    VsBadge,
    VsBody,
    VsButton,
    VsCard,
    VsDetail,
    VsHeading,
} from '@visitscotland/component-library/components';

type Props = {
    /** URL for the CTA button. */
    ctaHref?: string;
    /** Icon name for the CTA button. */
    ctaIcon?: string | undefined;
    /** Label for the CTA button. */
    ctaLabel?: string;
    /** Option to use the featured card styles */
    isFeatured?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    ctaHref: undefined,
    ctaIcon: undefined,
    ctaLabel: undefined,
    isFeatured: false,
});

/**
 * Set the icon props for the VsButton component if the `ctaIcon` prop has been
 * passed in.
 */
const ctaIconProps = computed(() => 
    props.ctaIcon !== undefined
        ? {
            icon: props.ctaIcon,
            'icon-position': 'right',
        }
        : {
        },
);

/** Set the `fill-color` prop for the card if it is featured. */
const cardProps = computed(() =>
    props.isFeatured
        ? {
            'fill-color': 'vs-color-background-information',
        }
        : {
        },
);

// Check if the named slots have content.
const slots = useSlots();

const hasCardDateSlot = () => !!slots['event-card-date']?.().length;
const hasCardContentSlot = () => !!slots['event-card-content']?.().length;
</script>

<style lang="scss">
.vs-br-event-card {
    margin-bottom: 0.75rem;

    &:hover {
        cursor: initial;
    }

    .vs-badge {
        border-radius: 0.25rem;
    }

    &__body .vs-list {
        padding-left: 0;
    }

    @media (min-width: 768px) {
        &__cta {
            width: fit-content;
        }
    }
}
</style>
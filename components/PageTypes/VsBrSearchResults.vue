<template>
    <div class="container-lg">
        <h1 class="vs-heading vs-heading--display-s mt-250 mb-250">
            Search results
        </h1>
        <div class="row">
            <div class="col-12 col-md-8 offset-md-2 col-lg-3 offset-lg-0">
                <fieldset class="vs-control-group">
                    <legend class="vs-control-group__legend">
                        Filter results
                    </legend>
                    <div class="cludo-search-controls" />
                </fieldset>
            </div>
            <div class="main-content col-12 col-lg-8  offset-lg-1">
                <div class="cludo-search-results" />
            </div>
        </div>
    </div>
</template>

<style lang="scss">
    .cludo-search-results nav {
        padding: 40px;
    }

    .cludo_result {
        position: relative;
    }

    .vs-cludo-custom-result {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

            &__link {
                text-decoration: none;
                display: inline-flex;
                align-items: baseline;
            }
    }

    .vs-cludo-custom-result__link:hover .vs-cludo-custom-result__heading {
        text-decoration: underline;
    }

    .vs-cludo-custom-result__link::after {
        content: "\f061";
        font-family: icon;
        color: #A8308C;
        text-decoration: none;
        margin-left: 0.75rem;
    }

    .vs-cludo-custom-result__link::before {
        content: "";
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        pointer-events: all;
    }

    .vs-control-group {
        border: solid 1px #9F9AB8;
        border-radius: 4px;
        overflow: auto;

        &__legend {
            display: flex;
            gap: 8px;
            background-color: #F0EFF4;
            padding: 12px 20px;
            border-bottom: solid 1px #9F9AB8;
            font-weight: 600;
            font-size: 1.25rem;

            &::before {
                font-family: icon;
                content: '';
            }
        }
    }

    .vs-details-facet-wrapper:not(:last-child) {
        border-bottom: solid 1px #9F9AB8;
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

    .vs-summary {
        display: flex;
        justify-content: space-between;

        &::after {
            font-family: icon;
            color: var(--vs-color-highlight);
            transition: all 0.5s ease;
            content: "\f078" / "";
        }
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
        content: "\f077" / "";

    }

    .cludo-results-current-facets {
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

    .cludo_result {
        padding: 1.5rem 0 !important;
        border-bottom: 1px solid #D3D3D3;

        a {
            color: #200f2e;
        }
    }

    .cludo-pagination {
        display: flex;
        gap: 0.75rem;
        justify-content: center;
        align-items: center;
    }

    .cludo-pagination li button {
        border: none;
        background-color: transparent;
        color: #200f2E ;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        line-height: 1;
    }

    .cludo-pagination li button:hover:not([aria-current="true"]) {
        text-decoration: underline;
        text-decoration-skip-ink: none;
    }

    .cludo-pagination li button[aria-label*="Page"] {
        width: 28px;
        height: 28px;
    }

    .cludo-pagination li button[aria-label="Previous page"] {
        margin-right: 1rem;
    }

    .cludo-pagination li button[aria-label="Next page"],
    .cludo-pagination li button[aria-label="Previous page"] {
        font-size: 0.875rem;
        color: #1f49d6;
        text-transform: uppercase;
        font-weight: 600;
    }

    .cludo-pagination li button[aria-label="Next page"] {
        margin-left: 1rem;
    }

    .cludo-pagination li button[aria-label="Next page"]::after {
        content: "\f061";
        font-family: icon;
        padding-left: 0.5rem;
    }

    .cludo-pagination li button[aria-label="Previous page"]::before {
        content: "\f060";
        font-family: icon;
        padding-right: 0.5rem;
    }

    .cludo-pagination li button[aria-current="true"] {
        background-color: #1f49d6;
        color: white;
        border-radius: 100px;
    }

    .cludo-clear-all-facets {
        width: 100%;
        padding: 1.5rem;
    }
</style>

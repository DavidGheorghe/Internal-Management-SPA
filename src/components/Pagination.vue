<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    pages: number[],
    pageNumber: number,
    last: boolean | undefined
}>();
const emits = defineEmits<{
    (e: 'updatePage', newPage: number): void
}>();

const currentPage = ref({
    first: true,
    last: props.pages.length === 1 ? true : false,
    currentNumber: (props.pageNumber + 1) // + 1 because the page number on server side is 0 index based.
});
if (props.pages.length === 1) {
    currentPage.value.first = true;
    currentPage.value.last = true;
}
/** Return the first 5 page numbers when the navigation is at most at the second page, 
 * the last 5 page numbers when the navigation is at least at the number before the last one,
 * and 5 elements by default, 2 before and 2 after current page number. */
const availablePages = computed(() => {
    const auxPages = Array.from(props.pages);
    let returnedPages;
    if(currentPage.value.currentNumber <= 3) {
        returnedPages = auxPages.slice(0, 5);
    } else if (currentPage.value.currentNumber + 3 > auxPages.length) {
        returnedPages = auxPages.slice(-5);
    } else {
        returnedPages = auxPages.slice(currentPage.value.currentNumber - 3, currentPage.value.currentNumber + 2);
    }
    return returnedPages;
});

function updateCurrentPage(newPage: number) {
    currentPage.value.currentNumber = newPage;
    if (newPage === props.pages.length) {
        currentPage.value.first = false;
        currentPage.value.last = true;
    } else if (newPage === 1) {
        currentPage.value.first = true;
        currentPage.value.last = false;       
    } else {
        currentPage.value.first = false;
        currentPage.value.last = false;
    }
}

function isCurrentPage(page: number) {
    return currentPage.value.currentNumber === page;
}

function sendNewPageNumber(page: number) {
    if (page !== currentPage.value.currentNumber) {
        emits("updatePage", page);
        updateCurrentPage(page);
    }
}
</script>

<template>
<div class="pagination">
    <div class="left-stepper-button" v-show="!currentPage.first" @click="sendNewPageNumber(1)">
        &lt;&lt;
    </div>
    <div class="left-stepper-button" v-show="!currentPage.first" @click="sendNewPageNumber(currentPage.currentNumber - 1)">
        &lt;
    </div>
    <div class="page" :class="{'current-page': isCurrentPage(pageNumber)}" :disable="isCurrentPage(pageNumber)" v-for="pageNumber in availablePages" :key="pageNumber" @click="sendNewPageNumber(pageNumber)">
        {{pageNumber}}
    </div>
    <div class="right-stepper-button" v-show="!currentPage.last" @click="sendNewPageNumber(currentPage.currentNumber + 1)">
        &gt;
    </div>
    <div class="right-stepper-button" v-show="!currentPage.last" @click="sendNewPageNumber(pages[pages.length-1])">
        &gt;&gt;
    </div>
</div>
</template>

<style scoped>
.pagination {
    display: flex;
}

.page, .left-stepper-button, .right-stepper-button {
    padding: 5px;
    cursor: pointer;
}

.page.current-page {
    color: red;
}
</style>
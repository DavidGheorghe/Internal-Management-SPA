<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    // pageNumber: number,
    last: boolean,
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number
}>();
const emits = defineEmits<{
    (e: 'updatePage', newPage: number): void
}>();

const currentPage = ref({
    first: props.pageNo === 0,
    last: props.last,
    currentNumber: (props.pageNo + 1) // + 1 because the page number on server side is 0 index based.
});

const resultsLabelFrom = computed(() => props.pageNo * props.pageSize + 1);
const resultsLabelTo = computed(() => {
    let to = resultsLabelFrom.value + props.pageSize - 1;
    if (to > props.totalElements) {
        to = props.totalElements;
    }
    return to;
});

/** 
 * Return the first 5 page numbers when the navigation is at most at the second page, 
 * the last 5 page numbers when the navigation is at least at the number before the last one,
 * and 5 elements by default, 2 before and 2 after current page number. 
 */
const availablePages = computed(() => {
    const auxPages = createAllPagesArray();
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

function createAllPagesArray() {
    return [...Array(props.totalPages).keys()].map(i => ++i);
}

function updateCurrentPage(newPage: number) {
    currentPage.value.currentNumber = newPage;
    if (newPage === availablePages.value.length) {
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
    return props.pageNo + 1 === page;
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
        <div 
            class="left-stepper-button" 
            v-show="pageNo !== 0" 
            @click="sendNewPageNumber(1)"
        >
            <span class="material-symbols-outlined">keyboard_double_arrow_left</span>
        </div>
        <div 
            class="left-stepper-button" 
            v-show="pageNo !== 0"
            @click="sendNewPageNumber(currentPage.currentNumber - 1)"
        >
            <span class="material-symbols-outlined">navigate_before</span>
        </div>
        <div 
            class="page" 
            
            :disable="isCurrentPage(pageNo)" 
            v-for="pageNumber in availablePages" 
            :key="pageNumber" 
            :class="{'current-page': isCurrentPage(pageNumber)}" 
            @click="sendNewPageNumber(pageNumber)"
        >
            {{pageNumber}}
        </div>
        <div 
            class="right-stepper-button" 
            v-show="!last" 
            @click="sendNewPageNumber(currentPage.currentNumber + 1)"
        >
            <span class="material-symbols-outlined">navigate_next</span>
        </div>
        <div 
            class="right-stepper-button" 
            v-show="!last" 
            @click="sendNewPageNumber(availablePages[availablePages.length-1])"
        >
            <span class="material-symbols-outlined">keyboard_double_arrow_right</span>
        </div>
        <div class="results-label">
            <!-- <span>{{resultsLabel}}</span> -->
            <span>
                Results from 
                <strong>{{resultsLabelFrom}}</strong> 
                to 
                <strong>{{resultsLabelTo}}</strong>
                of 
                <strong>{{totalElements}}</strong>
            </span>
        </div>
    </div>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}
/* , .left-stepper-button, .right-stepper-button */ 
.page {
    padding: 5px;
    cursor: pointer;
    font-size: 18px;
    border: 1px solid transparent;
    &:hover {
        // box-shadow: -1px 1px 1px  black;
        border: 1px solid grey;
        border-radius: 10%;
        background-color: #efefef; //rgba(255, 255, 255, 0.2);
    }
}

.page.current-page {
    background-color: #22c55e; /*rgba(0, 0, 255, 0.7);*/
    border-radius: 10%;
    border: 1px solid black;
    color: white;
    margin: 1px;
}

.material-symbols-outlined {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 48;
  font-size: 24px;
  cursor: pointer;
}

.results-label {
    position: absolute;
    right: 2%;
}
</style>
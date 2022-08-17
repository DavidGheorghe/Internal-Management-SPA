<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import { EntityData, PaginationParams } from '@/types/UtilsTypes';
import { SizeType } from '@/utils/Utils';
import { Color } from "@/types/ColorTypes";
import { deleteColorById, fetchColors } from '@/services/ColorService';
import { useRouter } from 'vue-router';
import paginationParamsDefaults from "@/utils/PaginationParamsDefaults";
import PageSizeIconsOptions from '@/components/controls/PageSizeIconsOptions.vue';
import RadioGroup from '@/components/controls/RadioGroup.vue';
import SearchBar from '@/components/controls/SearchBar.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import Pagination from '@/components/controls/Pagination.vue';

const router = useRouter();

/* Variables declaration. */
const paginationParams = reactive<PaginationParams>({...paginationParamsDefaults});
paginationParams.sortBy = "name";
// const pageNo = ref(0);
// const pageSize = ref(15);
// const sortBy = ref("name");
// const sortDir = ref("asc");
const searchText = ref("");

const currentPigmentOption = ref("All");
const allPigmentOptions = ["All", "One Pigment", "Two Pigments", "Three Pigments"]
const currentNumberOfPigments = computed(() => {
    let numberOfPigments = -1;
    if (currentPigmentOption.value === "Three Pigments") {
        numberOfPigments = 3;
    } else if(currentPigmentOption.value === "Two Pigments") {
        numberOfPigments = 2;
    } else if (currentPigmentOption.value === "One Pigment") {
        numberOfPigments = 1;
    }
    return numberOfPigments;
})

const isDeleteModalDisplayed = ref(false);
const deletedColorName = ref<string>();
const deletedColorId = ref<number>()

const colorsData = ref<EntityData<Color>>();

(await updateColorsData());

async function updateColorsData() {
    colorsData.value = (await fetchColors(currentNumberOfPigments.value, paginationParams.pageNo, paginationParams.pageSize, paginationParams.sortBy, paginationParams.sortDir, searchText.value));
}

function updatePageSize(sizeOption: SizeType) {
    switch (sizeOption) {
        case SizeType.SMALL:
            paginationParams.pageSize = 15;
            break;
        case SizeType.MEDIUM:
            paginationParams.pageSize = 10;
            break;
        case SizeType.LARGE:
            paginationParams.pageSize = 5;
            break;
        default:
            paginationParams.pageSize = 15;
    }
}

function updatePageNumber(newPageNumber: number) {
    paginationParams.pageNo = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
}

function goToAddPage() {
    const addColorPageURL = "/colors/add-color";
    router.push(addColorPageURL);
}

function goToEditPage(id: number) {
    const editColorPageURL = "/colors/update-color/" + id;
    router.push(editColorPageURL);
}

function deleteProduct(id: number) {
    deleteColorById(id);
    updateColorsData();
    hideDeleteModal();
}

function displayDeleteModal(id: number, name: string) {
    deletedColorId.value = id;
    deletedColorName.value = name;
    isDeleteModalDisplayed.value = true;
}

function hideDeleteModal() {
    isDeleteModalDisplayed.value = false;
}

watchEffect(async () => {
    await updateColorsData();
});

watch(currentNumberOfPigments, (newIndex, oldIndex) => {
    if (newIndex !== oldIndex) {
        searchText.value = "";
    }
})

watch(currentPigmentOption, async (newOption, oldOption) => {
    if (newOption !== oldOption) {
        searchText.value = "";
        await updateColorsData();
    }
});
</script>

<template>
<div class="colors-home">
    <div class="container">
        <div class="controls-container">
            <SearchBar
                class="search-bar"
                v-model="searchText"
                placeholder="Search by name"
            />
            <PageSizeIconsOptions
                class="select-page-size"
                @selected-option="updatePageSize"
            />
            <RadioGroup
                v-model="currentPigmentOption"
                :required="false"
                :options="allPigmentOptions"
                :is-displayed-as-column="true"
            />
            <ActionButton 
                class="add-button"
                label="New Color"
                action-type="add"
                @click="goToAddPage"
            />
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>First Pigment</th>
                        <th class="numerical-cell-header">First Pigment %</th>
                        <th>Second Pigment</th>
                        <th class="numerical-cell-header">Second Pigment %</th>
                        <th>Third Pigment</th>
                        <th class="numerical-cell-header">Third Pigment %</th>
                        <th class="actions-header" colspan="2"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="color in colorsData?.content"
                        :key="color.id"
                    >
                        <td>{{color.id}}</td>
                        <td class="name">{{color.name}}</td>
                        <td>{{color.firstPigment}}</td>
                        <td class="numerical-cell">{{color.firstPigmentPercentage}}</td>
                        <td>{{color.secondPigment ? color.secondPigment : 'N/A'}}</td>
                        <td class="numerical-cell">{{color.secondPigmentPercentage?? 'N/A'}}</td>
                        <td>{{color.thirdPigment ? color.thirdPigment : 'N/A'}}</td>
                        <td class="numerical-cell">{{color.thirdPigmentPercentage?? 'N/A'}}</td>
                        <td class="edit-cell">
                                <div class="edit-cell-content-wrapper">
                                    <span 
                                        class="material-symbols-outlined edit"
                                        @click="goToEditPage(color.id)"
                                    >edit</span>
                                    <span class="icon-label">Edit</span> 
                                </div>
                            </td>
                            <td class="delete-cell">
                                <div class="delete-cell-content-wrapper">
                                    <span 
                                        class="material-symbols-outlined delete"
                                        @click="displayDeleteModal(color.id, color.name)"
                                    >delete</span>
                                    <span class="icon-label">Delete</span>
                                </div>
                            </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Pagination
            :last="colorsData!.last"
            :page-no="colorsData!.pageNo"
            :page-size="colorsData!.pageSize"
            :total-elements="colorsData!.totalElements"
            :total-pages="colorsData!.totalPages"
            @update-page="updatePageNumber"
        />
    </div>
    <div class="delete-color-modal">
        <Teleport to="#modals">
            <CustomModal 
                :display="isDeleteModalDisplayed"
                @x-button-click="hideDeleteModal"
            >
                <template #title>
                    <h2>Delete color <span class="deleted-color-name">{{deletedColorName}}</span>?</h2>
                </template>
                <template #cancel-button>
                    <SimpleButton 
                        class="no-button"
                        label="No"
                        @click="hideDeleteModal"
                    />
                </template>
                <template #ok-button>
                    <SimpleButton 
                        class="ok-button"
                        label="Ok"
                        @click="deleteProduct(deletedColorId!)"
                    />
                </template>
            </CustomModal>
        </Teleport>
    </div>
</div>
</template>

<style lang="less" scoped>
@import url("https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0");
@import "@/assets/colors.less";

.colors-home {
    width: 100%;
    height: 100%;
    background-color: #efefef;
}
.container {
    height: 80%;
    width: 80%;
    position: fixed;
    top: 10%;
    left: 10%;
    right: 10%;
    bottom: 10%;
    padding: 1%;
    display: flex;
    flex-direction: column;
    background-color: white;
    border-radius: 5px;
    box-shadow: 2px 2px 2px 2px #959da0;
}

.controls-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 1%;
    height: 10%;
}

.search-bar {
    margin-left: 1%;
    width: 50%;
    height: 50%;
}

.select-page-size {
    height: 35%;
}
.add-button {
    background-color: @custom-green;//#77b994;
    // color: white;
    height: 40%;
    // &:hover {
    //     color: white;
    // }
}

table {
    table-layout: auto;
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    box-shadow: 2px 2px 2px 2px whitesmoke;
}

.table-container {
    position: relative;
    padding: 1%;
    max-height: 80vh;
}

thead {
    background-color: @custom-green;//#77b994;
    color: black;
}

th {
    padding: 0.3% 0.3% 0.3% 0.3%;
    font-size: 1.1rem;//20px;
}

.header-sort-down::after, .header-sort-up::after {
    content: ' ';
    position: relative;
    left: 8px;
    border: 7px solid transparent;
    cursor: pointer;
}
.header-sort-down::after {
    top: 15px;
    border-top-color: black; //silver;
}
.header-sort-up::after {
    bottom: 15px;
    border-bottom-color:black;// silver;
}
.header-sort-down,
.header-sort-up {
    padding-left: 20px;
}
td {
    padding: 0.5%;
    text-align: left;
    font-weight: 490;
    font-size: 1.1rem;//18px;
    &.name {
        padding-left: 1%;
    }
}

tbody tr {
    border-bottom: 1px solid rgb(215, 209, 209);
}

tbody tr:nth-child(odd) {
    background-color: #efefef;
}
.numerical-cell-header {
    width: 7%;
    line-break: normal;
    font-size: 1rem;
}
.numerical-cell {
    text-align: right;
    font-variant-numeric: proportional-nums;
}
.edit-cell, .delete-cell {
    &-content-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
.material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 48;
    font-size: 22px;
    cursor: pointer;
    &.edit {
        color: #fde047;
    }
    &.delete {
        color: #dc2626;
    }
}
.deleted-color-name {
    color: @custom-blue;
}
.ok-button {
    width: 5rem;
    height: 2rem;
    background-color: #1e3a8a;
    font-weight: 600;
    &:hover {
        background-color: #2563eb;
    }
}
.no-button {
    background-color: @custom-green;
    width: 5rem;
    height: 2rem;
    font-weight: 600;
}
</style>
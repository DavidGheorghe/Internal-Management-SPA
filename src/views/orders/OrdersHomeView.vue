<script setup lang="ts">
import { deleteOrderById, fetchOrders, fetchOrdersByStatus } from '@/services/OrderService';
import { Order } from '@/types/OrderTypes';
import { EntityData, PaginationParams } from '@/types/UtilsTypes';
import paginationParamsDefaults from "@/utils/PaginationParamsDefaults";
import { reactive, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import OrderCard from '@/components/visual/order/OrderCard.vue';
import SearchBar from '@/components/controls/SearchBar.vue';
import Pagination from '@/components/controls/Pagination.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import SelectItem from '@/components/controls/SelectItem.vue';
import { statusesAsStrings } from '@/utils/Utils';
import { computeStatusFromString, getIdFromStatus } from '@/utils/OrderServiceUtils';
import { useRemoveElement } from '@/composables/useRemoveElement';
import { useIsCurrentUserSupervisor } from '@/composables/rolesComposables';

const router = useRouter();

const paginationParams = reactive<PaginationParams>({...paginationParamsDefaults});

paginationParams.sortBy = "dueDate";
paginationParams.sortDir = "desc";
paginationParams.pageSize = 6;

const ordersData = ref<EntityData<Order>>();
const searchText = ref("");
const isDeleteModalDisplayed = ref(false);
const orderToBeDeleted = ref<Order>();

const statusFilterOptions = ["ALL", ...statusesAsStrings];
const currentStatusFilter = ref("ALL");

const isCurrentUserSupervisor = useIsCurrentUserSupervisor();

(await initOrdersData());

async function initOrdersData() {
    ordersData.value = (await fetchOrders(paginationParams.pageNo, paginationParams.pageSize, paginationParams.sortBy, paginationParams.sortDir, searchText.value));
}

function updatePageNumber(newPageNumber: number) {
    paginationParams.pageNo = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
}

async function updateStatusFilter(newFilter: string) {
    if (newFilter === "All") {
        await initOrdersData();
    } else {
        const newStatusFilter = computeStatusFromString(newFilter);
        const newStatusFilterId = getIdFromStatus(newStatusFilter!);
        ordersData.value = (await fetchOrdersByStatus(newStatusFilter!, paginationParams.pageNo, paginationParams.pageSize, paginationParams.sortBy, paginationParams.sortDir, searchText.value))
    }
}

function goToAddPage() {
    const url = "orders/add-order";
    router.push(url);
}

async function deleteOrder() {
    if (orderToBeDeleted.value) {
        await deleteOrderById(orderToBeDeleted.value.id);
        hideDeleteModal();
        if (ordersData.value?.content) {
            const index = getIndexById(orderToBeDeleted.value.id);
            ordersData.value.content = useRemoveElement(index, ordersData.value.content);
        }
    }
    (await initOrdersData());
}

function getIndexById(id: number) {
    let finalIndex: number = -1;
    ordersData.value?.content.forEach((element, index) => {
        if (element.id === id) {
            finalIndex = index;
        }
    })
    return finalIndex;
}

function showDeleteModal(order: Order) {
    isDeleteModalDisplayed.value = true;
    orderToBeDeleted.value = order;
}

function hideDeleteModal() {
    isDeleteModalDisplayed.value = false;
}

watch(currentStatusFilter, async (newFilter, oldFilter) => {
    if (newFilter === "ALL") {
        await initOrdersData();
    } else {
        const newStatusFilter = computeStatusFromString(newFilter);
        const newStatusFilterId = getIdFromStatus(newStatusFilter!);
        ordersData.value = (await fetchOrdersByStatus(newStatusFilter!, paginationParams.pageNo, paginationParams.pageSize, paginationParams.sortBy, paginationParams.sortDir, searchText.value))
    }
})

watchEffect(() => {
    initOrdersData();
})
</script>

<template>
    <div class="order-home">
        <main class="content">
            <div class="controls-container">
            <SearchBar
                class="search-bar"
                v-model="searchText"
                placeholder="Search by customer"
            />
            <SelectItem 
                v-model="currentStatusFilter"
                class="select-item"
                :options="statusFilterOptions"
            />
            <ActionButton
                class="add-button"
                action-type="add"
                :disabled="isCurrentUserSupervisor === false"
                label="Add Order"
                @click="goToAddPage"
            />
            </div>
            <div class="orders-wrapper">
                <el-scrollbar always>
                    <div 
                        class="orders-cards"
                    >
                        <OrderCard 
                            v-for="order in ordersData?.content"
                            :key="order.id"
                            :order="order" 
                            @delete-order="showDeleteModal(order)"
                        />
                    </div>
                </el-scrollbar>
            </div>
            <Pagination
                :last="ordersData!.last"
                :page-no="ordersData!.pageNo"
                :page-size="ordersData!.pageSize"
                :total-elements="ordersData!.totalElements"
                :total-pages="ordersData!.totalPages"
                @update-page="updatePageNumber"
            />
        </main>
        <Teleport to="#modals"> 
            <CustomModal 
                :display="isDeleteModalDisplayed"
                @x-button-click="hideDeleteModal"
            >
                <template #title>
                    <h2>Delete order
                        <span class="modal-title-order-id">#{{orderToBeDeleted?.id}}</span> 
                        for customer 
                        <span class="modal-title-order-customer">{{orderToBeDeleted?.customer.companyName}}</span>  
                        ?
                    </h2>
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
                        @click="deleteOrder"
                    />
                </template>
            </CustomModal>
        </Teleport>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.order-home {
    overflow-x: hidden;
    width: 100%;
    background-color: @pages-background;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}
.content {
    width: 95rem;
    height: 40rem;
    display: grid;
    grid-template-rows: 5rem 30rem 5rem;
    background-color: white;
    border-radius: 0.5rem;
    margin-top: 5rem;
    box-shadow: 2px 2px 2px 2px #959da0;
}
.controls-container {
    position: relative;
    display: grid;
    grid-template-columns: 30rem 10rem;
    margin-left: 3.1rem;
    & .search-bar {
        width: 25.3rem;
        height: 2rem;
        align-self: center;
        justify-self: start;
    }
    & .add-button {
        position: absolute;
        right: 3.1rem;
        width: 8rem;
        height: 2rem;
        align-self: center;
        justify-self: start;
        background-color: @custom-green;
    }
    & .select-item {
        align-self: center;
        justify-self: start;
        margin-left: 1.5rem;
    }
}
.orders-cards {
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: max-content auto;
    align-items: center;
    justify-items: center;
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
.modal-title-order-customer, .modal-title-order-id {
    color: @custom-blue;
}
</style>
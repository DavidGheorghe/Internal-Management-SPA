<script setup lang="ts">
import { deleteOrderById, fetchOrders } from '@/services/OrderService';
import { Order } from '@/types/OrderTypes';
import { EntityData, PaginationParams } from '@/types/UtilsTypes';
import paginationParamsDefaults from "@/utils/PaginationParamsDefaults";
import { ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import OrderCard from '@/components/visual/OrderCard.vue';
import SearchBar from '@/components/controls/SearchBar.vue';
import Pagination from '@/components/controls/Pagination.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import OrderStatusSelect from '@/components/controls/OrderStatusSelect.vue';

const router = useRouter();

const paginationParams = ref<PaginationParams>(paginationParamsDefaults);
paginationParams.value.sortBy = "dueDate";
paginationParams.value.sortDir = "desc";

const ordersData = ref<EntityData<Order>>();
const searchText = ref("");
const isDeleteModalDisplayed = ref(false);
const orderToBeDeleted = ref<Order>();

(await initOrdersData());

async function initOrdersData() {
    ordersData.value = (await fetchOrders(paginationParams.value.pageNo, paginationParams.value.pageSize, paginationParams.value.sortBy, paginationParams.value.sortDir, searchText.value));
}

function updatePageNumber(newPageNumber: number) {
    paginationParams.value.pageNo = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
}

function goToAddPage() {
    const url = "orders/add-order";
    router.push(url);
}

async function deleteOrder() {
    if (orderToBeDeleted.value) {
        deleteOrderById(orderToBeDeleted.value.id);
        hideDeleteModal();
    }
    (await initOrdersData());
}

function showDeleteModal(order: Order) {
    isDeleteModalDisplayed.value = true;
    orderToBeDeleted.value = order;
}

function hideDeleteModal() {
    isDeleteModalDisplayed.value = false;
}

watchEffect(() => {
    initOrdersData();
})
</script>

<template>
    <div class="order-home">
        <h3>Orders page</h3>
        <div class="controls-container">

        <SearchBar
            v-model="searchText"
        />
        <!-- <div class="add-order-button"> -->
        <ActionButton
            action-type="add"
            label="Add Order"
            @click="goToAddPage"
        />
        <!-- <OrderStatusSelect /> -->
        <!-- </div> -->
        </div>
        <div 
            class="orders-cards"
            v-for="order in ordersData?.content"
            :key="order.id"
        >
            <OrderCard 
                :order="order" 
                @delete-order="showDeleteModal(order)"
            />
        </div>
        <Pagination
            :last="ordersData!.last"
            :page-no="ordersData!.pageNo"
            :page-size="ordersData!.pageSize"
            :total-elements="ordersData!.totalElements"
            :total-pages="ordersData!.totalPages"
            @update-page="updatePageNumber"
        />
        <Teleport to="#modals">
            <CustomModal 
            :display="isDeleteModalDisplayed"
            @x-button-click="hideDeleteModal"
        >
                <template #title>
                    <h2>Delete order #{{orderToBeDeleted?.id}} for customer {{orderToBeDeleted?.customer.companyName}} ?</h2>
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
.order-home {
    overflow: hidden;
}
</style>
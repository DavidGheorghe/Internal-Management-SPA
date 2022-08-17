<script setup lang="ts">
import { deleteCustomerById, fetchCustomers, updateCustomer } from '@/services/CustomerSerivce';
import { Customer } from '@/types/CustomerTypes';
import { EntityData, PaginationParams } from '@/types/UtilsTypes';
import { reactive, ref, watchEffect } from 'vue';
import CustomerCard from '@/components/visual/CustomerCard.vue';
import SearchBar from '@/components/controls/SearchBar.vue';
import Pagination from '@/components/controls/Pagination.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import { useRouter } from 'vue-router';
import paginationParamsDefaults from '@/utils/PaginationParamsDefaults';

const customersData = ref<EntityData<Customer>>();
const router = useRouter();
const paginationParams = reactive<PaginationParams>({...paginationParamsDefaults});
paginationParams.pageSize = 4;

const searchText = ref("");

const isDeleteModalDisplayed = ref(false);
const customerToBeDeleted = ref<Customer>();

(await initCustomersData());

function updatePageNumber(newPageNumber: number) {
    paginationParams.pageNo = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
}

async function initCustomersData() {
    customersData.value = (await fetchCustomers(paginationParams.pageNo, paginationParams.pageSize, paginationParams.sortBy, paginationParams.sortDir, searchText.value));
}

async function saveCustomer(customer: Customer) {
    updateCustomer(customer.id, customer);
    (await initCustomersData());
}

async function deleteCustomer(id: number) {
    deleteCustomerById(id);
    hideDeleteModal();
}

function showDeleteModal(customer: Customer) {
    isDeleteModalDisplayed.value = true;
    customerToBeDeleted.value = customer;
}

function hideDeleteModal() {
    isDeleteModalDisplayed.value = false;
}

function goToAddPage() {
    const url = "/customers/add-customer";
    router.push(url);
}

watchEffect(async () => {
    initCustomersData();
})
</script>

<template>
    <div class="customers-home">
        <main class="content">
            <div class="controls-container">
                <SearchBar
                    class="search-bar"
                    v-model="searchText"
                    placeholder="Search by all fields"
                />
                <ActionButton
                    class="add-button"
                    action-type="add"
                    label="New Customer"
                    @click="goToAddPage"
                />
            </div>
            <div class="cards-container">
                <!-- <div 
                    class="customers-card-container" 
                    v-for="customer in customersData?.content"
                    :key="customer.id"
                > -->
                    <CustomerCard 
                        v-for="customer in customersData?.content"
                        :key="customer.id"
                        class="customer-card"
                        :customer="customer"
                        @customer-edited="saveCustomer"
                        @customer-deleted="showDeleteModal"
                    />
                <!-- </div> -->
            </div>
            <Pagination
                class="pagination"
                :last="customersData!.last"
                :page-no="customersData!.pageNo"
                :page-size="customersData!.pageSize"
                :total-elements="customersData!.totalElements"
                :total-pages="customersData!.totalPages"
                @update-page="updatePageNumber"
            />
        </main>
        <Teleport to="#modals">
            <CustomModal 
                :display="isDeleteModalDisplayed"
                @x-button-click="hideDeleteModal"
            >
                    <template #title>
                        <h2>Delete customer <div class="deleted-customer-name">{{`${customerToBeDeleted?.firstName} ${customerToBeDeleted?.lastName}`}}</div>?</h2>
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
                            @click="deleteCustomer(customerToBeDeleted?.id!)"
                        />
                    </template>
                </CustomModal>
        </Teleport>
    </div>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";

.customers-home {
    width: 100%;
    background-color: @pages-background;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
}
.controls-container {
    position: relative;
    display: grid;
    grid-template-columns: 30rem 10rem;
    & .search-bar {
        width: 25.3rem;
        height: 2rem;
        align-self: center;
        justify-self: start;
    }
    & .add-button {
        width: 10rem;
        height: 2rem;
        align-self: center;
        justify-self: start;
        background-color: @custom-green;
    }
}
.content {
    width: 95rem;
    height: 50rem;
    display: grid;
    grid-template-rows: 5rem 40rem 5rem;
    grid-template-columns: auto;
    background-color: white;
    border-radius: 0.5rem;
    margin-top: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
    box-shadow: 2px 2px 2px 2px #959da0;
    box-sizing: border-box;
}
.deleted-customer-name {
    color: @custom-blue;
    display: inline;
}
.cards-container {
    grid-row: 2 / 3;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr 1fr 1fr;
    .customer-card {
        height: 92%;
    }
}
.pagination {
    grid-row: 3 / 4;
}
.ok-button {
    width: 5rem;
    height: 2rem;
    background-color: #1e3a8a;
    &:hover {
        background-color: #2563eb;
    }
}
.no-button {
    background-color: @custom-green;
    width: 5rem;
    height: 2rem;
}
</style>
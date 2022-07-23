<script setup lang="ts">
import { deleteCustomerById, fetchCustomers, updateCustomer } from '@/services/CustomerSerivce';
import { Customer } from '@/types/CustomerTypes';
import { EntityData, PaginationParams } from '@/types/UtilsTypes';
import { ref, watchEffect } from 'vue';
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
const paginationParams = ref<PaginationParams>(paginationParamsDefaults);

const searchText = ref("");

const isDeleteModalDisplayed = ref(false);
const customerToBeDeleted = ref<Customer>();

(await initCustomersData());

function updatePageNumber(newPageNumber: number) {
    paginationParams.value.pageNo = newPageNumber - 1; // substract 1 because the page number on server side is 0 index based.
}

async function initCustomersData() {
    customersData.value = (await fetchCustomers(paginationParams.value.pageNo, paginationParams.value.pageSize, paginationParams.value.sortBy, paginationParams.value.sortDir, searchText.value));
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
        <div class="controls-container">
            <SearchBar
                class="search-bar"
                v-model="searchText"
            />
            <ActionButton
                class="add-button"
                action-type="add"
                label="New Customer"
                @click="goToAddPage"
            />
        </div>
        <div 
            class="customers-card-container" 
            v-for="customer in customersData?.content"
            :key="customer.id"
        >
            <CustomerCard 
                class="customer-card"
                :customer="customer"
                @customer-edited="saveCustomer"
                @customer-deleted="showDeleteModal"
            >
            </CustomerCard>
        </div>
        <Pagination
            :last="customersData!.last"
            :page-no="customersData!.pageNo"
            :page-size="customersData!.pageSize"
            :total-elements="customersData!.totalElements"
            :total-pages="customersData!.totalPages"
            @update-page="updatePageNumber"
        />
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
.customers-home {
    width: 100%;
    background-color: #efefef;
    overflow: hidden;
}
.controls-container {
    padding-left: 2%;
    padding-top: 1%;
    display: flex;
    flex-direction: row;
}
.search-bar {
    background-color: white;
    width: 30%;
}
.add-button {
    background-color: green;
}
.customer-card {
    width: 80%;
    height: 15%;
}
.customers-card-container {
    flex-basis: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    padding-left: 2%;
    padding-top: 1%
}
</style>
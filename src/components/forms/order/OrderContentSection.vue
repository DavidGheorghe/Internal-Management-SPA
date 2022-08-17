<script setup lang="ts">
import { computed, reactive, ref, watch, watchEffect } from 'vue';
import OrderContentSearchSelect from '@/components/controls/OrderContentSearchSelect.vue';
import OrderContentCard from '@/components/visual/order/OrderContentCard.vue';
import { AddOrderContentDTO, OrderDTO, Order, OrderContentSearchSelectType, RetrievedOrderContentDTO } from '@/types/OrderTypes';
import { computeContentPrice, fetchContentByOrderId } from '@/services/OrderService';
import { SearchSelectOption } from '@/types/UtilsTypes.js';

const props = defineProps<{
    editedOrder?: Order
}>();

const emit = defineEmits<{
    (e: 'update-content', content: AddOrderContentDTO[]): void
}>();

const content = reactive<AddOrderContentDTO[]>([]);
const contentToDisplay = ref<OrderContentSearchSelectType[]>([]);
const totalPrice = ref(0);
const contentSearchSelect = ref<InstanceType<typeof OrderContentSearchSelect>>();

if (props.editedOrder) {
    initContent(props.editedOrder);
}

async function initContent(order: Order) {
    const fetchedContent = (await fetchContentByOrderId(order.id));
    initContentToAdd(fetchedContent);
    initContentToDisplay(fetchedContent);
}

function initContentToDisplay(fetchedContent: RetrievedOrderContentDTO[]) {
    let initialContentToDisplay: OrderContentSearchSelectType[] = [];
    fetchedContent.forEach((fetchedItem) => {
        const item = {} as OrderContentSearchSelectType;
        item.color = computeColorSearchSelectOption(fetchedItem);
        item.product = computeProductSearchSelectOption(fetchedItem);
        item.quantity = fetchedItem.quantity;
        totalPrice.value = totalPrice.value + fetchedItem.price;
        
        initialContentToDisplay.push(item);
    });
    contentToDisplay.value = initialContentToDisplay;
}

function initContentToAdd(fetchedContent: RetrievedOrderContentDTO[]) {
    let initialContentToAdd: AddOrderContentDTO[] = [];
    fetchedContent.forEach((item) => {
        const newItem = {} as AddOrderContentDTO;
        newItem.colorId = item.color.id;
        newItem.productId = item.product.id;
        newItem.quantity = item.quantity;
        initialContentToAdd.push(newItem);
        content.push(newItem);
    })
}

function computeColorSearchSelectOption(item: RetrievedOrderContentDTO): SearchSelectOption {
    const searchSelectOption = {} as SearchSelectOption;
    searchSelectOption.id = item.color.id;
    searchSelectOption.value = item.color.name;

    return searchSelectOption;
}
function computeProductSearchSelectOption(item: RetrievedOrderContentDTO): SearchSelectOption {
    const searchSelectOption = {} as SearchSelectOption;
    searchSelectOption.id = item.product.id;
    searchSelectOption.value = item.product.name;

    return searchSelectOption;
}

function addContent(newContent: OrderContentSearchSelectType) {
    contentToDisplay.value.push(newContent);
    
    const contentToAdd = computeNewContentDTO(newContent);
    addContentPriceToTotal(contentToAdd);

    content.push(contentToAdd);
}

function deleteContent(contentToDelete: OrderContentSearchSelectType) {
    const index = contentToDisplay.value.indexOf(contentToDelete);
    if (index > -1) {
        const contentToDeleteDTO = computeNewContentDTO(contentToDelete);
        removeContentPriceFromTotal(contentToDeleteDTO);

        contentToDisplay.value.splice(index, 1);
        content.splice(index, 1);
    }
}
function computeNewContentDTO(newContent: OrderContentSearchSelectType) {
    const contentToAdd = {} as AddOrderContentDTO;
    contentToAdd.productId = newContent.product.id;
    contentToAdd.colorId = newContent.color.id;
    contentToAdd.quantity = newContent.quantity;

    return contentToAdd;
}

async function addContentPriceToTotal(content: AddOrderContentDTO) {
    const contentPrice = await getContentPrice(content);
    totalPrice.value = totalPrice.value + contentPrice;
}
async function removeContentPriceFromTotal(content: AddOrderContentDTO) {
    const contentPrice = await getContentPrice(content);
    totalPrice.value = totalPrice.value - contentPrice;
}

async function getContentPrice(content: AddOrderContentDTO) {
    const contentPrice = await computeContentPrice(content.productId, content.quantity);
    return contentPrice;
}

function clearSearchFilter() {
    contentSearchSelect.value?.clearFields();
}

function clearContent() {
    totalPrice.value = 0;
    content.splice(0, content.length);
    contentToDisplay.value.splice(0, contentToDisplay.value.length);
}

defineExpose({
    clearSearchFilter,
    clearContent
});

watch(() => content.length, () => {
    emit('update-content', content);
})
</script>

<template>
    <section class="content-section-container">
        <main>
            <OrderContentSearchSelect 
                ref="contentSearchSelect" 
                :required="editedOrder ? false : true"
                @add-content="addContent" 
            />
            <el-scrollbar always>
                <section class="content">
                    <OrderContentCard 
                        v-for="item in contentToDisplay" 
                        :key="item.product.id"
                        :item="item" 
                        @delete-content="deleteContent"
                    />
                </section>
            </el-scrollbar>
        </main>
        <footer>
            <span>Total Price: {{totalPrice}}RON</span>
        </footer>
    </section>
</template>

<style scoped lang="less">
.content-section-container {
    height: 100%;
    width: 100%;
    display: grid;
    grid-template-rows: auto 5rem;
}
main {
    display: grid;
    grid-template-columns: max-content;
    grid-template-rows: 5rem 35rem;
}
.content {
    display: flex;
    flex-direction: column;
    padding-right: 0.6rem;
    > * {
        margin-top: 1rem;
        height: 5.5rem;
    }
}
footer {
    font-size: 1.2rem;
}
</style>

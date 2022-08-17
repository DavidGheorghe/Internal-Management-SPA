<script setup lang="ts">
import TodosSideBar from '@/components/visual/TodosSideBar.vue';
import DashboardOrderCard from '@/components/visual/order/DashboardOrderCard.vue';
import DashboardOrderExpanded from '@/components/visual/order/DashboardOrderExpanded.vue';
import { useTodosSidebarStore } from '@/stores/TodosSidebarStore';
import { fetchPinnedOrders } from '@/services/OrderService';
import { Order, DashboardOrder, OrderStatus } from '@/types/OrderTypes';
import { reactive, ref } from 'vue';
import OrderProgress from '@/components/visual/order/OrderProgress.vue';
import { useExpandedOrderStore } from '@/stores/ExpandedOrderStore';

const todosSidebarStore = useTodosSidebarStore();
const expandedOrderStore = useExpandedOrderStore();

const pinnedOrders = ref<DashboardOrder[]>([]);

initPinnedOrders();

async function initPinnedOrders() {
    const orders = (await fetchPinnedOrders());
    pinnedOrders.value = orders.map(order => {
        return {...order, isFocused: false}
    }) 
}

function displayProgress(orderToDisplay: DashboardOrder) {
    expandedOrderStore.displayOrder(orderToDisplay);

    pinnedOrders.value = pinnedOrders.value.map(order => {
        if (order.id === orderToDisplay.id) {
            return {
                ...order,
                isFocused: true,
            }
        } else {
            return {
                ...order,
                isFocused: false
            }
        }
    })
}

function hideProgress() {
    expandedOrderStore.hideOrder();

    pinnedOrders.value = pinnedOrders.value.map(order => {
        return {
            ...order,
            isFocused: false
        }
    })
}

function unpinOrder(index: number) {
    pinnedOrders.value = pinnedOrders.value.filter((order, orderIndex) => orderIndex !== index)
    hideProgress();

    // pinnedOrders.value.splice(index, 1);
}

function updateOrderStatus(newStatus: OrderStatus, order: DashboardOrder) {
    expandedOrderStore.updateStatus(newStatus);
    order.status = newStatus;
}

function hideSidebar() {
    setTimeout(() => {
        todosSidebarStore.hideSidebar();
    }, 500);
}

function displaySidebar() {
    setTimeout(() => {
        todosSidebarStore.displaySidebar();
    }, 500);
}
</script>

<template>
    <div class="dashboard-view">
        <main class="main">
            <section class="pinned-orders-container">
                <div class="pinned-orders-wrapper">
                    <span 
                        v-if="!todosSidebarStore.isDisplayed"
                        class="material-symbols-outlined show-todos"
                        @click="displaySidebar"
                    >
                        keyboard_double_arrow_left
                    </span>
                    <el-scrollbar always >
                        <div class="pinned-orders">
                            <DashboardOrderCard 
                                v-for="(order, index) in pinnedOrders"
                                :key="order.id"
                                :id="'order-' + order.id"
                                :order="order"
                                @click="displayProgress(order)"
                                @unpin-order="unpinOrder(index)"
                            />
                            <!-- @update-status="updateOrderStatus(newStatus, order)" -->
                        </div>
                    </el-scrollbar>
                </div>
            </section>
            <section
                v-if="expandedOrderStore.isDisplayed"
                class="order-details"
            >
                <DashboardOrderExpanded 
                    class="progress"
                    :order="expandedOrderStore.getDisplayedOrder!"
                    @hide-order="hideProgress"
                />        
            </section>
        </main>
        <aside class="todos">
            <Transition>
                <TodosSideBar 
                    v-show="todosSidebarStore.isDisplayed"
                     
                    ref="sidebarRef"
                    @hide-sidebar="hideSidebar"
                />
            </Transition>
        </aside>
    </div>
</template>

<style scoped lang="less">
.dashboard-view {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1.55fr auto;
    // grid-template-rows: minmax(70%, 100%) minmax(0, 30%);
    grid-template-rows: 100%;
    // grid-template-rows: minmax(100%, max-content) auto;
    // grid-template-rows: 50% auto;
    grid-auto-flow: column;
    overflow: hidden;
    position: relative;
}
.show-todos {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 99999;
    cursor: pointer;
    font-size: 36px;
    margin: 0;
    margin-right: 1rem;
    // &.with-side-bar {
    //     right: -3rem;
    // }
    // &.without-side-bar {
    //     right: 3rem;
    // }
}
// @media (min-height: 69vh) and (max-height: 100vh){
.main {
    // display: grid;
    // grid-template-rows: max-content auto;
    // grid-auto-flow: row;
    display: flex;
    flex-direction: column;
}
.pinned-orders-container {
    // display: grid;
    // grid-template-columns: 100%;
    // grid-template-rows: 100%;
    order: 1;
    flex-basis: 100%;
    flex-shrink: 4;
    overflow: auto;
}
.pinned-orders-wrapper {
    height: 100%;
    // background-color: red;
    background-color: #efefef;
}
.pinned-orders {
    // padding-top: 2rem;
    // overflow-y: scroll;
    // background-color: #efefef;
    // background-color: red;
    // max-height: 100vh;
    // overflow: scroll;

    grid-row: 1 / 2;
    grid-column: 1 / 1;
    position: relative;
    display: grid;
    grid-template-columns: auto auto auto;
    > * {
        align-self: center;
        justify-self: center;
        margin: 2rem;
    }
}
// }
// @media (min-height: 0vh) and (max-height: 31vh) {

.order-details {
    order: 2;
    // grid-row: 2 / 3;
    // grid-column: 1 / 1;
    height: 31rem;
    // flex-grow: 4;
    border-top: solid 2px #666464;
    // background-color: #aca9a9;
    background-color: #f1f5f9;
    // background-color: yellow;
    // height: 20rem;d
    // width: 100%;
    // position: absolute;
    // bottom: 0;
    .progress {
        // padding-top: 10rem;
        padding-left: 5rem;
        padding-right: 5rem;
    }
}
// }

.todos {
    grid-row-end: span 2;
    border-left: solid 2px #666464;
    box-sizing: border-box;
    // padding-left: 1rem;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #f8fafc;
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

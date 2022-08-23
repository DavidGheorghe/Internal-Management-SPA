<script setup lang="ts">
import DashboardOrderCard from '@/components/visual/order/DashboardOrderCard.vue';
import DashboardOrderExpanded from '@/components/visual/order/DashboardOrderExpanded.vue';
import TodosSideBar from '@/components/visual/todos/TodosSideBar.vue';
import { fetchPinnedOrders } from '@/services/OrderService';
import { useExpandedOrderStore } from '@/stores/ExpandedOrderStore';
import { useTodosSidebarStore } from '@/stores/TodosSidebarStore';
import { DashboardOrder, OrderStatus } from '@/types/OrderTypes';
import { ref } from 'vue';

const todosSidebarStore = useTodosSidebarStore();
const expandedOrderStore = useExpandedOrderStore();

const orders = ref<DashboardOrder[]>(await initPinnedOrders());



async function initPinnedOrders() {
    const orders = (await fetchPinnedOrders());
    return orders.map(order => {
        return {...order, isFocused: false}
    }) 
}

function displayProgress(orderToDisplay: DashboardOrder) {
    expandedOrderStore.displayOrder(orderToDisplay);

    orders.value = orders.value.map(order => {
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

    orders.value = orders.value.map(order => {
        return {
            ...order,
            isFocused: false
        }
    })
}

function unpinOrder(index: number) {
    orders.value = orders.value.filter((order, orderIndex) => orderIndex !== index)
    hideProgress();
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
<script lang="ts">
    export default {
        inheritAttrs: false
    }
</script>

<template>
    <div 
        class="dashboard-view"
        v-bind="$attrs"
    >
        <main 
            v-if="orders.length > 0" 
            class="main"
        >
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
                                v-for="(order, index) in orders"
                                :key="order.id"
                                :id="'order-' + order.id"
                                :order="order"
                                @mousedown="displayProgress(order)"
                                @unpin-order="unpinOrder(index)"
                            />
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
        <main 
            v-else
            class="main-empty"
        >
            <span class="main-empty-text">No Orders Assigned or Pinned.</span>
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
    grid-template-rows: 100%;
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
}
.main {
    display: flex;
    flex-direction: column;
}
.main-empty {
    height: 100%;
    background-color: #efefef;
    display: flex;
    align-items: center;
    justify-content: center;
    &-text {
        color: grey;
        font-size: 3rem;
        line-height: 3rem;
    }
}
.pinned-orders-container {
    order: 1;
    flex-basis: 100%;
    flex-shrink: 4;
    overflow: auto;
}
.pinned-orders-wrapper {
    height: 100%;
    background-color: #efefef;
}
.pinned-orders {
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

.order-details {
    order: 2;
    height: 31rem;
    border-top: solid 2px #666464;
    background-color: #f1f5f9;
    .progress {
        padding-left: 5rem;
        padding-right: 5rem;
    }
}

.todos {
    grid-row-end: span 2;
    border-left: solid 2px #666464;
    box-sizing: border-box;
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

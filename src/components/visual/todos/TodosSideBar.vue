<script setup lang="ts">
import { fetchTodos, addTodo, deleteById } from '@/services/TodoService';
import { useUserStore } from '@/stores/UserStore';
import { Todo } from '@/types/TodoTypes';
import { ref, watch, computed } from 'vue';
import TodoCard from '@/components/visual/todos/TodoCard.vue';
import NewTodoCard from '@/components/visual/todos/NewTodoCard.vue';


defineEmits<{
    (e: 'hide-sidebar'): void
}>();

const userStore = useUserStore();
const todos = ref<Todo[]>([]);

(await initTodos());
const isNewTodoAdded = ref(false);

const isSidebarEmpty = computed(() => todos.value.length === 0 && isNewTodoAdded.value === false);

async function initTodos() {
    todos.value = (await fetchTodos()).reverse();
}

function addTodoFront(text: string) {
    const newTodo = {
        isCompleted: false,
        text: text,
        username: userStore.getCurrentUsername
    } as Todo;
    addTodo(newTodo);
    todos.value.unshift(newTodo);
    isNewTodoAdded.value = false;
}

function addTodoComponent() {
    isNewTodoAdded.value = true;
}
function discardNewTodo() {
    isNewTodoAdded.value = false;
}

function sortTodosById() {
    todos.value.sort((a, b) => b.id - a.id);
}

function deleteTodo(id: number, index: number) {
    deleteById(id);
    todos.value.splice(index, 1);
}

watch(todos, () => {
    sortTodosById();
})
</script>

<template>
    <el-scrollbar always>
        <div 
            class="sidebar-container"
        >
            <header class="header">
                <span 
                    class="material-symbols-outlined close-sidebar-icon"
                    @click="$emit('hide-sidebar')"
                >
                    keyboard_double_arrow_right
                </span>
                <span 
                    class="material-symbols-outlined add-todo-icon"
                    @click="addTodoComponent"
                >
                    add
                </span>
            </header>
            <main>
                <el-space  direction="vertical">
                    <NewTodoCard
                        v-if="isNewTodoAdded"
                        @add-todo="addTodoFront"
                        @discard-todo="discardNewTodo"
                    />
                    <TodoCard 
                        v-for="(todo, index) in todos"
                        :key="todo.id"
                        :todo="todo"
                        @delete-todo="deleteTodo(todo.id, index)"
                    />
                </el-space>
                <div 
                    v-if="isSidebarEmpty"
                    class="empty-todos-placeholder-wrapper"
                >
                    <span class="empty-todos-placeholder">Start Adding Todos.</span>
                </div>
            </main>
        </div>
    </el-scrollbar>
</template>

<style lang="less" scoped>
.sidebar-container {
    width: 22rem;
    position: relative;
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto auto;
}
.close-sidebar-icon {
    cursor: pointer;
    font-size: 36px;
}
.header {
    display: grid;
    grid-template-columns: 50% 50%;
    grid-template-rows: auto;
}
.add-todo-icon {
    cursor: pointer;
    font-size: 36px;
    justify-self: end;
    margin-right: 0.5rem;
}
.empty-todos-placeholder-wrapper {
    text-align: center;
}
.empty-todos-placeholder {
    font-size: 1.5rem;
    color: grey;
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

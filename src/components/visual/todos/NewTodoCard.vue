<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import ActionButton from '@/components/buttons/ActionButton.vue';

const currentText = ref("");
const textarea = ref<HTMLTextAreaElement>();
const isDoneButtonDisabled = computed(() => currentText.value === "");
const emit = defineEmits<{
    (e: 'add-todo', text: string): void,
    (e: 'discard-todo'): void
}>();

onMounted(() => {
    textarea.value?.focus();
});

function addTodo() {
    emit('add-todo', currentText.value);
}

function discardTodo() {
    emit('discard-todo');
}
</script>

<template>
    <el-card class="todo-card-container">
        <div class="todo-card-body">
            <textarea 
                class="todo-content"
                ref="textarea"
                v-model="currentText"
                @keyup.enter="addTodo"
                rows="7"
            >
            </textarea>
            <ActionButton 
                class="delete-button" 
                action-type="close"
                @click="discardTodo"
            />
            <ActionButton 
                class="save-button" 
                action-type="done"
                :disabled="isDoneButtonDisabled"
                @click="addTodo"
            />
        </div>
    </el-card>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";

.todo-card-container {
    width: 20rem;
    height: auto;
    margin-right: 1rem;
    margin-left: 0.5rem;
}
.todo-card-body {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: grid;
    grid-template-columns: auto 3rem 3rem;
    grid-template-rows: auto 3rem;
}
.todo-content {
    grid-row: 1 / 1;
    grid-column: 1 / 4;
    border: 1px solid black;
    resize: none;
}
.delete-button {
    grid-row: 2;
    grid-column: 2 / 3;
    width: 2rem;
    height: 1.5rem;
    background-color: #ef4444;
    align-self: end;
    justify-self: end;
}
.save-button {
    grid-row: 2;
    grid-column: 3 / 4;
    width: 2rem;
    height: 1.5rem;
    background-color: @custom-green;
    align-self: end;
    justify-self: end;
}
</style>


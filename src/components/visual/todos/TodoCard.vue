<script setup lang="ts">
import { Todo } from '@/types/TodoTypes';
import InputTextarea from '@/components/controls/InputTextarea.vue';
import { ref } from 'vue';
import ActionButton from '@/components/buttons/ActionButton.vue';
import { deleteById, updateTodo } from '@/services/TodoService';

const props = defineProps<{
    todo: Todo
}>();

const emit = defineEmits<{
    (e: 'delete-todo'): void
}>();

const textareaRef = ref<HTMLTextAreaElement>();

const currentText = ref(props.todo.text);
const isTodoReadonly = ref(true);

function setTodoAsEditable() {
    isTodoReadonly.value = false;
    textareaRef.value?.focus();
}

function setTodoAsReadonly() {
    isTodoReadonly.value = true;
}

function updateTodoText() {
    if (props.todo.text !== currentText.value) {
        const todoUpdates = {...props.todo};
        todoUpdates.text = currentText.value;
        updateTodo(props.todo.id, todoUpdates);
    }
    setTodoAsReadonly();
}

function updateTodoOnEnter() {
    updateTodoText();
}

function updateTodoOnBlur() {
    if (isTodoReadonly.value === false) {
        updateTodoText();
    }
}

function deleteTodo() {
    emit('delete-todo');
}
</script>

<template>
    <el-card class="todo-card-container">
        <div class="todo-card-body">
            <!-- <el-scrollbar always> -->
                <textarea
                    ref="textareaRef" 
                    class="todo-content"
                    v-model="currentText"
                    :readonly="isTodoReadonly"
                    @keyup.enter="updateTodoOnEnter"
                    @blur="updateTodoOnBlur"
                    rows="7"
                >
                </textarea>
            <!-- </el-scrollbar> -->
            <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                title="Delete todo?"
                @confirm="deleteTodo"
            >
                <template #reference>
                    <ActionButton 
                        class="delete-button" 
                        action-type="delete"
                    />
                </template>
            </el-popconfirm>
            <ActionButton 
                class="edit-button" 
                action-type="edit"
                @click="setTodoAsEditable"
            />
        </div>
    </el-card>
</template>

<style lang="less" scoped>
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
    border: 1px solid #efefef;
    resize: none;
}
.delete-button {
    grid-row: 2;
    grid-column: 2 / 3;
    width: 2.2rem;
    height: 1.5rem;
    background-color: #ef4444;
    align-self: end;
    justify-self: end;
    border-radius: 0.2rem;
}
.edit-button {
    grid-row: 2;
    grid-column: 3 / 4;
    width: 2rem;
    height: 1.5rem;
    align-self: end;
    justify-self: end;
    border-radius: 0.2rem;
    background-color: #facc15;
}
</style>


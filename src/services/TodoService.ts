import { useUserStore } from "@/stores/UserStore";
import { Todo } from "@/types/TodoTypes";
import { APIUrls, computeURLWithId } from "@/utils/APIURLs";
import { axiosInstance } from "@/utils/Utils";
import { AxiosResponse } from "axios";

export async function addTodo(todo: Todo) {
    const url = APIUrls.API_TODOS_ROOT;
    const response = await axiosInstance({
        method: 'post',
        url: url,
        data: todo
    });
    const newTodo = createTodoFromResponse(response);
    return newTodo;
}

export async function fetchTodos() {
    const userStore = useUserStore();
    const url = APIUrls.API_TODOS_ROOT + "/" + userStore.getCurrentUsername;
    const response = await axiosInstance({
        method: 'get',
        url: url
    });
    const todos = createTodosListFromResponse(response);
    return todos;
} 

export async function deleteById(id: number) {
    const url = computeURLWithId(APIUrls.API_TODOS_ROOT, id);
    const response = await axiosInstance({
        method: 'delete',
        url: url
    });
    const deletedTodo = createTodoFromResponse(response);
    return deletedTodo;
}

export async function updateTodo(id: number, todo: Todo) {
    const url = computeURLWithId(APIUrls.API_TODOS_ROOT, id);
    const response = await axiosInstance({
        method: 'put',
        url: url,
        data: todo
    });
    const updateTodo = createTodoFromResponse(response);
    return updateTodo;
}

function createTodoFromResponse(response: AxiosResponse<any>) {
    const todo = {} as Todo;
    todo.id = response.data.id;
    todo.text = response.data.text;
    todo.isCompleted = response.data.isCompleted;
    todo.username = response.data.username;
    return todo;
}

function createTodosListFromResponse(response: AxiosResponse<any>) {
    let todos: Todo[] = [];
    for (let i = 0; i < response.data.length; i++) {
        const todo = {} as Todo;
        const todoFromServer = response.data[i];
        todo.id = todoFromServer.id;
        todo.text = todoFromServer.text;
        todo.username = todoFromServer.username;
        todo.isCompleted = todoFromServer.isCompleted;

        todos.push(todo);
    }
    return todos;
}
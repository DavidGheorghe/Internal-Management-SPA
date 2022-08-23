<script setup lang="ts">
import ActionButton from '@/components/buttons/ActionButton.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import CreateUserModal from '@/components/visual/CreateUserModal.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import UserCard from '@/components/visual/UserCard.vue';
import { useRemoveElement } from '@/composables/useRemoveElement';
import { deleteUserById, fetchUsers } from '@/services/UserService';
import { User } from '@/types/UserTypes';
import { ref } from 'vue';

const users = ref<User[]>([]);

const userToDelete = ref<User>();

const isDeleteModalDisplayed = ref(false);
const isCreateUserModalDisplayed = ref(false);

initUsers();

async function initUsers() {
    const fetchedUsers = await fetchUsers();
    users.value = fetchedUsers;
}

function showDeleteModal(user: User) {
    isDeleteModalDisplayed.value = true;
    userToDelete.value = user;
}

function hideDeleteModal() {
    isDeleteModalDisplayed.value = false;
}

function showCreateUserModal() {
    isCreateUserModalDisplayed.value = true;
}

function hideCreateUserModal() {
    isCreateUserModalDisplayed.value = false;
}

async function deleteUser(id: number) {
    await deleteUserById(id);
    hideDeleteModal();
    if(users.value) {
        const index = getIndexById(id);
        users.value = useRemoveElement(index, users.value);
    }
}

function getIndexById(id: number) {
    let finalIndex: number = -1;
    users.value?.forEach((element, index) => {
        if (element.id === id) {
            finalIndex = index;
        }
    })
    return finalIndex;
}
</script>

<template>
    <main class="view">
        <section class="content">
            <div class="add-button-wrapper">
                <ActionButton 
                    class="add-button"
                    action-type="add"
                    label="New User"
                    @click="showCreateUserModal"
                />
                <!-- <RolesSelect 
                    v-model:roles="rolesStr"
                /> -->
            </div>
            <div class="users-list-wrapper">
                <el-scrollbar always>
                    <ul 
                        class="users-list"
                        v-for="user in users"
                        :key="user.id"
                    >
                        <li>
                            <UserCard 
                                :user="user"
                                @delete-user="showDeleteModal(user)"
                            />
                        </li>
                    </ul>
                </el-scrollbar>
            </div>
        </section>
        <Teleport to="#modals"> 
            <CustomModal 
                :display="isDeleteModalDisplayed"
                @x-button-click="hideDeleteModal"
            >
                <template #title>
                    <h2>Delete user <span class="modal-title-username">{{userToDelete?.username}}</span> ?</h2>
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
                        @click="deleteUser(userToDelete!.id)"
                    />
                </template>
            </CustomModal>
            <CreateUserModal    
                :display="isCreateUserModalDisplayed"
                @hide-modal="hideCreateUserModal"
                @add-user="initUsers"
            />
        </Teleport>
    </main>
    
</template>

<style scoped lang="less">
@import "@/assets/colors.less";

.view {
    background-color: @pages-background;
    display: flex;
    justify-content: center;
    overflow: hidden;
}
.content {
    border-radius: 0.2rem;
    width: 80%;
    height: 72%;
    box-sizing: border-box;
    background-color: white;
    margin-top: 5rem;
    overflow: hidden;
    box-shadow: 2px 2px 2px 2px #959da0;
    display: grid;
    grid-template-rows: 7% 93%;
    grid-template-columns: auto;
}
.add-button-wrapper {
    align-self: center;
    justify-self: center;
    .add-button {
        background-color: @custom-green;
        width: 10rem;
    }
}
.users-list {
    list-style: none;
}
.modal-title-username {
    color: @custom-blue;
}
.ok-button {
    width: 5rem;
    height: 2rem;
    background-color: #1e3a8a;
    font-weight: 600;
    &:hover {
        background-color: #2563eb;
    }
}
.no-button {
    background-color: @custom-green;
    width: 5rem;
    height: 2rem;
    font-weight: 600;
}
</style>
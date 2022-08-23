<script setup lang="ts">
import { Role } from '@/types/Role';
import { computed, ref } from 'vue';
import { roles, rolesAsStr } from '@/utils/Utils';

const props = defineProps<{
    roles: Role[]
}>();

const emit = defineEmits<{
    (e: 'update:roles', newRoles: Role[]): void
}>();

const allRoles = [...rolesAsStr];

const currentRoles = computed({
    get() {
        return props.roles;
    },
    set(newRoles) {
        emit('update:roles', newRoles);
    }
})
</script>

<template>
    <el-select
        v-model="currentRoles"
        multiple
        placeholder="Select Roles"
        :teleported="false"
        style="width: 240px"
    >
        <el-option 
            v-for="role of allRoles"
            :key="role"
            :label="role"
            :value="role"
        />
    </el-select>
</template>

<style lang="less" scoped>

</style>

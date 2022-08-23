<script setup lang="ts">
import { fetchEmployees } from '@/services/UserService';
import { User } from '@/types/UserTypes';
import { computed, ref } from 'vue';

const props = defineProps<{
    employee: User | null
}>();

const emit = defineEmits<{
    (e: 'update:employee', newEmployee: User): void
}>();

const employees = ref(await fetchEmployees());

const currentEmployeeUsername = ref(props.employee ? props.employee.username : 'No one');
// const currentEmployee = computed({
//     get() {
//         return props.employee;
//     },
//     set(newEmployee) {
//         // if (newEmployeeUsername !== props.employee && newEmployeeUsername !== null) {
//         //     const newEmployee = getEmployeeByUsername(newEmployeeUsername);
//         //     console.log("username ", newEmployeeUsername.username)
//         //     console.log("employee ", newEmployee);
//         //     if (newEmployee !== undefined) {
//         //         emit('update:employee', newEmployee);
//         //     }
//         // }
//             console.log("employee ", newEmployee);

//         if (newEmployee) {
//             // emit('update:employee', newEmployee);
//             emit('update:employee', newEmployee);
//         }
//     }
// })

function getEmployeeByUsername(username: string): User | undefined {
    for (let i = 0; i < employees.value.length; i++) {
        const empl = employees.value[i];
        if (empl.username === username) {
            return empl;
        }
    }
}
</script>

<template>
    <el-select
        v-model="currentEmployeeUsername"
        placeholder="Select asignee"
    >
        <el-option
            v-for="employee in employees"
            :key="employee.id"
            :label="employee.username"
            :value="employee.id"
        />
    </el-select>
</template>

<style lang="less" scoped>

</style>

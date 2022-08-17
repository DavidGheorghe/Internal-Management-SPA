<script setup lang="ts">
import ColorForm from '@/components/forms/ColorForm.vue';
import { fetchColorById } from '@/services/ColorService';
import { computed, ref } from '@vue/reactivity';
import { useRoute, useRouter } from 'vue-router';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import XButton from '@/components/buttons/XButton.vue';

const route = useRoute();
const router = useRouter();
// const updatedColorId = route.params.id;
const props = defineProps<{
    id: string
}>();
const updatedColor = (await fetchColorById(Number.parseInt(props.id)));


const isModalDisplayed = ref(false);

function displayModal() {
    isModalDisplayed.value = true;
}

function hideModal() {
    isModalDisplayed.value = false;
}
</script>

<template>
    <div class="edit-color">
        <h3 class="title">Edit color <div class="color-name">{{updatedColor.name}}</div></h3>
        <ColorForm 
            class="color-form"
            :updated-color="updatedColor"
            @form-submitted="displayModal"
        />
        <Teleport to="#modals">
            <CustomModal
                :display="isModalDisplayed"
                @x-button-click="router.back"
                @hidden-modal="router.back">
                <template v-slot:title>
                    <h2>color edited successfully!</h2>
                </template>
                <template v-slot:ok-button>
                    <SimpleButton 
                        class="ok-button"
                        label="Ok"
                        @click="router.back"
                    />
                </template>
            </CustomModal>
        </Teleport>
    </div>
</template>

<style scoped lang="less">
@import "@/assets/colors.less";
.title {
    text-align: center;
    font-family: TimesNewRoman, "Times New Roman", Times;
    font-size: 1.9rem;
}

.edit-color {
    // height: calc(100% - 7vh);
    // margin-top: 7vh;
    overflow: hidden;
    background-color:#efefef;
}
.color-form {
    position: fixed;
    height: 75%;
    width: 50%;
    left: 25%;
}
.color-name {
    display: inline;
    color: @custom-blue;
}
</style>
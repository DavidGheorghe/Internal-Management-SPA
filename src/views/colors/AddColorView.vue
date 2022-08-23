<script setup lang="ts">
import ColorForm from '@/components/forms/ColorForm.vue';
import CustomModal from '@/components/visual/CustomModal.vue';
import SimpleButton from '@/components/buttons/SimpleButton.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const isModalDisplayed = ref(false);

function displayModal() {
    isModalDisplayed.value = true;
}

function hideModal() {
    isModalDisplayed.value = false;
}
</script>

<template>
    <div class="add-color">
        <h3 class="title">Add Color</h3>
        <ColorForm 
            class="color-form"
            @form-submitted="displayModal"
        />
        <Teleport to="#modals">
            <CustomModal 
                    :display="isModalDisplayed"
                    @x-button-click="router.back"
                    @hidden-modal="router.back"
                >
                <template v-slot:title>
                    <h2>Color added successfully!</h2>
                </template>
                <template v-slot:text>
                    <h4>Would you like to add another color?</h4>
                </template>
                <template v-slot:cancel-button>
                    <SimpleButton 
                        class="no-button"
                        label="No"
                        @click="router.back"
                    />
                </template>
                <template v-slot:ok-button>
                    <SimpleButton 
                        class="yes-button"
                        label="Yes"
                        @click="hideModal"
                    />
                </template>
            </CustomModal>
        </Teleport>
    </div>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";

.title {
    text-align: center;
    font-family: TimesNewRoman, "Times New Roman", Times;
    font-size: 1.9rem;
}

.add-color {
    overflow: hidden;
    background-color:#efefef;
}
.color-form {
    position: fixed;
    height: 75%;
    width: 50%;
    left: 25%;
}
.yes-button {
    background-color: @custom-green;
}
.no-button {
    background-color: @custom-blue;
}
.no-button, .yes-button {
    border: 1px solid black;
    border-radius: 0.3rem;
    width: 3.7rem;
    height: 2rem;
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
    }
}
</style>
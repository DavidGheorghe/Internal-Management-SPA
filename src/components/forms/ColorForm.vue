<script setup lang="ts">
import InputString from '@/components/controls/InputString.vue';
import InputNumber from '@/components/controls/InputNumber.vue';
import SubmitButton from '../buttons/SubmitButton.vue';
import SimpleButton from '../buttons/SimpleButton.vue';
import { Color, ColorDTO } from '@/types/ColorTypes';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { addColor, updateColor } from '@/services/ColorService';

const router = useRouter();

const props = defineProps<{
    updatedColor?: Color
}>();

const emits = defineEmits<{
    (e: 'form-submitted'): void
}>();

const name = ref<string>(props.updatedColor?.name || "");
const firstPigment = ref<string>(props.updatedColor?.firstPigment || "");
const firstPigmentPercentage = ref<number | null>(props.updatedColor?.firstPigmentPercentage || null);
const secondPigment = ref<string>(props.updatedColor?.secondPigment || "");
const secondPigmentPercentage = ref<number | null>(props.updatedColor?.secondPigmentPercentage || null);
const thirdPigment = ref<string>(props.updatedColor?.thirdPigment || "");
const thirdPigmentPercentage = ref<number | null>(props.updatedColor?.thirdPigmentPercentage || null);

const isSubmitButtonDisabled = computed(() => name.value === "" && firstPigment.value === "" && firstPigmentPercentage.value === null);

function saveColor() {
    const auxColor = {
        "name": name.value!,
        "firstPigment": firstPigment.value!,
        "firstPigmentPercentage": firstPigmentPercentage.value!,
        "secondPigment": secondPigment.value!,
        "secondPigmentPercentage": secondPigmentPercentage.value!,
        "thirdPigment": thirdPigment.value!,
        "thirdPigmentPercentage": thirdPigmentPercentage.value!
    }
    if (props.updatedColor) {
        updateColor(props.updatedColor.id, auxColor);
    } else {
        addColor(auxColor);
    }
    emits('form-submitted'); 
}

function clearFields() {
    name.value = "";
    firstPigment.value = "";
    firstPigmentPercentage.value = null;
    secondPigment.value = "";
    secondPigmentPercentage.value = null;
    thirdPigment.value = "";
    thirdPigmentPercentage.value = null;
}
</script>

<template>
<div class="color-form-container">
    <form @submit.prevent>
        <div class="name-section">
            <span class="section-label">Color</span>
            <InputString
                class="name-input-field"
                label="Name"
                :required="true"
                v-model="name"
            />
        </div>
        <div class="first-pigment-section">
            <span class="section-label">First Pigment</span>
            <InputString
                class="first-pigment-name-input-field"
                label="Name"
                :required="true"
                v-model="firstPigment"
            />
            <InputNumber
                label="Percentage"
                :required="true"
                unit-measure="%"
                v-model="firstPigmentPercentage"
            />
        </div>
        <div class="second-pigment-section">
            <span class="section-label">Second Pigment</span>
            <InputString
                class="second-pigment-name-input-field"
                label="Name"
                :required="false"
                v-model="secondPigment"
            />
            <InputNumber
                label="Percentage"
                :required="false"
                unit-measure="%"
                v-model="secondPigmentPercentage"
            />
        </div>
        <div class="third-pigment-section">
            <span class="section-label">Third Pigment</span>
            <InputString
                class="third-pigment-name-input-field"
                label="Name"
                :required="false"
                v-model="thirdPigment"
            />
            <InputNumber
                label="Percentage"
                :required="false"
                unit-measure="%"
                v-model="thirdPigmentPercentage"
            />
        </div>
        <div class="cancel-button-wrapper">
            <SimpleButton
                class="cancel-button"
                label="Cancel"
                @click="router.back()"
            />
        </div>
        <div class="add-button-wrapper">
            <SubmitButton
                class="add-button"
                label="Save"
                :is-disabled="isSubmitButtonDisabled"
                @submit="saveColor"
            />
        </div>
        <div class="clear-button-wrapper">
            <SimpleButton
                class="clear-button"
                label="Clear All"
                @click="clearFields"
            />
        </div>
    </form>
</div>
</template>

<style lang="less" scoped>
@import "@/assets/colors.less";
.color-form-container {
    height: 100%;
    width: 100%;
    border-radius: 5px;
    border: 1px solid #efefef;
    background-color: white;
    box-shadow: 2px 2px 2px 2px #959da0;
}
form {
    height: 100%;
    box-sizing: border-box;
    display: grid;
    grid-auto-flow: column;
    grid-auto-rows: 1fr;
}
.name-section, .first-pigment-section, .second-pigment-section {
    border-right: 1px solid #9e9d9d;
}
.name-section, .first-pigment-section, .second-pigment-section, .third-pigment-section {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.first-pigment-section, .second-pigment-section, .third-pigment-section {
    justify-content: space-evenly;
}
.section-label {
    position: absolute;
    color: grey;
    top: 2%;
    left: 1%;    
}
.add-button-wrapper {
    /* height: 10%; */
    position: absolute;
    bottom: 5%;
    right: 3%;
}
.clear-button, .cancel-button, .add-button {
    width: 6rem;
    height: 1.75rem;
    font-size: 1.05rem;
    font-weight: 500;
    border: 1px solid black;
    border-radius: 0.3rem;
    &:hover {
        box-shadow: inset .01rem .01rem 0rem .05rem black;
    }
}
.add-button {
    background-color: @custom-green;
    &:disabled {
        border-color: transparent;
        color: white;
        box-shadow: none;
        opacity: 0.5;
    }
}
.cancel-button-wrapper {
    position: absolute;
    bottom: 5%;
    right: 14.5%;
}

.cancel-button {
    background-color: #a9b2bd;
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
.clear-button-wrapper {
    position: absolute;
    bottom: 5%;
    left: 5%;
}
.clear-button {
    background-color: @custom-blue;// rgb(185, 184, 184);
    &:hover {
        border: 1px solid black;
        color: black;
    }
}
</style>
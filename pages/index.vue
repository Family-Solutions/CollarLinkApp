<template>
    <div class="flex p-3">
        <Map></Map>
        
        <div class="flex flex-column gap-3 cards-container">
            <Card class="custom-card">
                <template #title>
                    <h3 class="card-title">Mascotas</h3>
                </template>
                <template #content>
                    <ul class="list-none p-0 m-0">
                        <li v-for="(pet, index) in pets" :key="index" class="mb-2">
                            {{ pet }}
                        </li>
                    </ul>
                </template>
            </Card>
            <Card class="custom-card">
                <template #title>
                    <h3 class="card-title">Dispositivos</h3>
                </template>
                <template #content>
                    <ul class="list-none p-0 m-0">
                        <li v-for="(device, index) in devices" :key="index" class="mb-2">
                            {{ device }}
                        </li>
                    </ul>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Map from '~/components/map.vue';

// Pets data
const pets = ref([
    'Tomy',
    'Mariano',
    'Luca'
]);

// Devices data
const devices = ref([
    '1048319',
    '1085833',
    '1084835'
]);
</script>

<style scoped>
.map-container {
    flex: 1;
    max-width: 65%;
}

.cards-container {
    flex: 1;
    max-width: 35%;
    padding-left: 15px;
}

.custom-card {
    background-color: white;
    border-radius: 10px;
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
    margin-bottom: 1rem;
    height: auto;
}

.card-title {
    color: #000;
    margin: 0;
    font-weight: 500;
}

:deep(.p-card-content) {
    color: #000;
}

:deep(li) {
    color: #000;
}

</style>

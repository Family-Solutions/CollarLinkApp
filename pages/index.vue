<template>
    <div class="flex p-3 justify-content-center container">
        <Map></Map>
        
        <div class="flex flex-column gap-3 cards-container">
            <Card class="custom-card">
                <template #title>
                    <h3 class="card-title">Mascotas</h3>
                </template>
                <template #content>
                    <ul class="list-none p-0 m-0">
                        <li v-for="(pet, index) in pets" :key="index" class="mb-2 pet-item">
                            <i :class="pet.type === 'perro' ? 'mdi mdi-dog dog-icon' : 'mdi mdi-cat cat-icon'"></i>
                            {{ pet.name }}
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
                        <li v-for="(device, index) in devices" :key="index" class="mb-2 device-item">
                            <i class="mdi mdi-devices device-icon"></i>
                            {{ device }}
                        </li>
                    </ul>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Map from '~/components/map.vue';

// Pets data with type information
const pets = ref([
    { name: 'Tomy', type: 'perro' },
    { name: 'Mariano', type: 'gato' },
    { name: 'Luca', type: 'perro' }
]);

// Devices data
const devices = ref([
    '1048319',
    '1085833',
    '1084835'
]);

onMounted(() => {
    // Añadir el enlace a los iconos de Material Design Icons
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css';
    document.head.appendChild(link);
});
</script>

<style scoped>
.container {
    width: 100%;
    max-width: 2000px;
    margin: 0 auto;
}

.map-container {
    flex: 1;
    max-width: 65%;
}

.cards-container {
    flex: 1;
    max-width: 30%;
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

.pet-item, .device-item {
    display: flex;
    align-items: center;
    gap: 8px;
}

.dog-icon {
    color: #3498db;
    font-size: 20px;
}

.cat-icon {
    color: #e67e22;
    font-size: 20px;
}

.device-icon {
    color: #2ecc71;
    font-size: 20px;
}

:deep(.p-card-content) {
    color: #000;
}

:deep(li) {
    color: #000;
}
</style>
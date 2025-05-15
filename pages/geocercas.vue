<template>
        <h1 class="page-title">Geocercas</h1>
        
        <div class="grid">
            <div v-for="(geocerca, index) in geocercas" :key="index" class="col-12 md:col-6 lg:col-4">
                <Card class="geocerca-card">
                    <template #title>
                        <div class="card-title">{{ geocerca.nombre }}</div>
                    </template>
                    <template #content>
                        <div class="map-image-container">
                            <img :src="`/${geocerca.imagen}.png`" :alt="geocerca.nombre" class="map-image" />
                        </div>
                    </template>
                </Card>
            </div>
        </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

// Lista de geocercas
const geocercas = ref([
    { nombre: 'Casa', imagen: 'casa' },
    { nombre: 'Casa Mamá', imagen: 'casa_mama' },
    { nombre: 'Casa Abuelos', imagen: 'casa_abuelos' },
    { nombre: 'Casa amigo', imagen: 'casa_amigo' },
    { nombre: 'Casa pareja', imagen: 'casa_pareja' },
    { nombre: 'Veterinaria', imagen: 'veterinaria' }
]);

// Función para agregar una nueva geocerca
const agregarGeocerca = () => {
    // Aquí iría la lógica para agregar una nueva geocerca
    console.log('Agregar nueva geocerca');
};

onMounted(() => {
    // Añadir el enlace a los iconos de Material Design Icons (si no está ya en tu app.vue)
    if (!document.querySelector('link[href*="materialdesignicons"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/@mdi/font@6.5.95/css/materialdesignicons.min.css';
        document.head.appendChild(link);
    }
});
</script>

<style scoped>
.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    flex-direction: column;
}

.page-title {
    margin-bottom: 2rem;
    color: #333;
    text-align: center;
}

.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
    width: 80%;
    justify-items: center;
    justify-content: center;
}

.geocerca-card {
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s;
    height: 100%;
    width: 300%;
    background-color: white;
}

.geocerca-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.card-title {
    font-weight: 500;
    font-size: 1.2rem;
    color: #333;
    text-align: center;
}

.map-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.map-image {
    width: 100%;
    border-radius: 8px;
    aspect-ratio: 1/1;
    object-fit: cover;
}

.add-geocerca {
    display: flex;
    justify-content: center;
    align-items: center;
}

.add-button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #3498db;
    color: white;
    font-size: 1.5rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.add-button:hover {
    background-color: #2980b9;
}

@media (max-width: 768px) {
    .grid {
        grid-template-columns: 1fr;
    }
}
</style>
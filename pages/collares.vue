<template>
  <div class="m-5">
    <Button>Nuevo</Button>
    <div class="mt-6 flex justify-content-evenly flex-wrap">
        <Card>
            <template #title>Collar #1048319</template>
            <template #content>
                <p class="w-15rem">
                    Mascota: Tomy<br>
                    Estado: Activo<br>
                    Batería: 85%<br>
                    Última conexión: Hace 10 min
                </p>
            </template>
        </Card>
        <Card>
            <template #title>Collar #105833</template>
            <template #content>
                <p class="w-15rem">
                    Mascota: Mariano<br>
                    Estado: Inactivo<br>
                    Batería: 20%<br>
                    Última conexión: Hace 2 días
                </p>
            </template>
        </Card>
        <Card>
            <template #title>Collar #1084835</template>
            <template #content>
                <p class="w-15rem">
                    Mascota: Luca<br>
                    Estado: Activo<br>
                    Batería: 92%<br>
                    Última conexión: Hace 5 min
                </p>
            </template>
        </Card>
    </div>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
import Button from 'primevue/button';
</script>
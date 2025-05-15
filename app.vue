<script setup lang="ts">

const visible = ref(false);

const buttons = [
  { id: 'home', label: 'Home'},
  { id: 'profile', label: 'Profile'},
  { id: 'settings', label: 'Settings'},
  { id: 'notifications', label: 'Alerts'}
]

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}
</script>

<template>

<div class="h-4rem bg-primary">
  <Button icon="pi pi-bars" @click="visible = true" />
  CollarLink
</div>
<Drawer v-model:visible="visible" header="Navegación" >
    <Button variant="text" class="text-700 w-17rem h-4rem flex justify-content-start my-2">
    <i class="pi pi-map" style="font-size: 1rem"></i>
    <label class="ml-3 text-xl font-medium">Localización</label>
  </Button>
  <Button variant="text" class="text-700 w-17rem h-4rem flex justify-content-start my-2">
    <i class="pi pi-heart" style="font-size: 1rem"></i>
    <label class="ml-3 text-xl font-medium">Mascotas</label>
  </Button>
  <Button variant="text" class="text-700 w-17rem h-4rem flex justify-content-start my-2">
    <i class="pi pi-calculator" style="font-size: 1rem"></i>
    <label class="ml-3 text-xl font-medium">Dispositivos</label>
  </Button>
  <Button variant="text" class="text-700 w-17rem h-4rem flex justify-content-start my-2">
    <i class="pi pi-circle" style="font-size: 1rem"></i>
    <label class="ml-3 text-xl font-medium">Geocercas</label>
  </Button>

</Drawer>

</template>


<script setup lang="ts">

const visible = ref(false);


function toggleSidebar() {
  showSidebar.value = !showSidebar.value
}
</script>


<template>
<div class="surface-200">
  <div class="h-4rem bg-primary align-content-center">
    <Button icon="pi pi-bars" size="large" class="ml-3" @click="visible = true" />
    <label class="ml-3 text-2xl font-medium">COLLAR LINK</label>
  </div>
  <slot />
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
</div>



</template>
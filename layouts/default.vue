<script setup lang="ts">

const visible = ref(false);
function goTo(route: string): void {
  navigateTo(route);
  visible.value = false;
}

</script>


<template>
<div class="surface-200">
  <div class="h-4rem bg-primary flex align-items-center">
    <Button class="ml-3" @click="visible = true" >
      <i class="pi pi-bars" style="font-size: 2rem" />
    </Button>
    <label class="ml-3 text-2xl font-semibold">COLLAR LINK</label>
    <div class="flex-auto"></div>
    <Button class="mr-3" @click="navigateTo('/perfil')" >
      <i class="pi pi-user" style="font-size: 2rem" />
    </Button>
  </div>



  <slot />

  <Drawer v-model:visible="visible" header="Navegación" >

    <Button variant="text" @click="goTo('/')" class="text-700 w-17rem h-4rem flex justify-content-start my-2" >
      <i class="pi pi-map" style="font-size: 1rem"></i>
      <label class="ml-3 text-xl font-medium">Localización</label>
    </Button>

    <Button variant="text" @click="goTo('/mascotas')" class="text-700 w-17rem h-4rem flex justify-content-start my-2">
      <i class="pi pi-heart" style="font-size: 1rem"></i>
      <label class="ml-3 text-xl font-medium">Mascotas</label>
    </Button>

    <Button variant="text" @click="goTo('/collares')" class="text-700 w-17rem h-4rem flex justify-content-start my-2">
      <i class="pi pi-calculator" style="font-size: 1rem"></i>
      <label class="ml-3 text-xl font-medium">Collares</label>
    </Button>

    <Button variant="text" @click="goTo('/geocercas')" class="text-700 w-17rem h-4rem flex justify-content-start my-2">
      <i class="pi pi-circle" style="font-size: 1rem"></i>
      <label class="ml-3 text-xl font-medium">Geocercas</label>
    </Button>

  </Drawer>
</div>

</template>
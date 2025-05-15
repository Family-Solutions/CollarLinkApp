<script setup lang="ts">
</script>

<template>
  <div class="flex justify-content-center mt-6">
    <Card>
      <template #title>
        <div class="flex justify-content-center">
            <img src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png" 
            alt="user header" class="w-14rem"/>
        </div>
        
      </template>
        
      <template #content>
        <div class="w-25rem flex justify-content-center">
            <div>
                <h2>Juan Pérez</h2>
                <p>juan.perez@gmail.com</p>
                <p>+51 999 888 777</p>
            </div>
            <div class="h-15rem"/>
        </div>
      </template>
      <template #footer class="flex justify-content-center">
        <div class="flex justify-content-center">
            <div>
                <Button label=" Editar perfil" icon="pi pi-pencil" class="block w-20rem mb-4" severity="secondary"/>
                <Button label=" Cerrar sesión" icon="pi pi-times" class="block w-20rem mb-4" severity="warn"/>
            </div>
        </div>
      </template>
    </Card>
  </div>
</template>



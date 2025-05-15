<script setup lang="ts">
</script>

<template>
  <div class="flex justify-content-center mt-6">
    <Card>
      <template #title>
        <img src="https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png" 
            alt="user header" class="w-10rem"/>
      </template>
        
      <template #content>
        <div class="profile-info">
          <h2>Juan Pérez</h2>
          <p>juan.perez@example.com</p>
          <p>+51 999 888 777</p>
        </div>
        <Button label="Editar perfil" icon="pi pi-pencil" class="edit-button" />
      </template>
    </Card>
  </div>
</template>



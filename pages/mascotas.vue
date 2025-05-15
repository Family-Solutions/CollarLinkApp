<template>
  <div class="m-5">
    <Button>Nuevo</Button>
    <div class="mt-6 flex justify-content-evenly flex-wrap">
        <Card>
            <template #title>Tomy</template>
            <template #content>
                <p class="w-15rem">
                    Especie: Perro<br>
                    Raza: Mestizo<br>
                    Edad: 3 años<br>
                    Dispositivo: 1048319
                </p>
            </template>
        </Card>
        <Card>
            <template #title>Mariano</template>
            <template #content>
                <p class="w-15rem">
                    Especie: Gato<br>
                    Raza: Persa<br>
                    Edad: 5 años<br>
                    Dispositivo: 105833
                </p>
            </template>
        </Card>
        <Card>
            <template #title>Luca</template>
            <template #content>
                <p class="w-15rem">
                    Especie: Perro<br>
                    Raza: Bulldog Francés<br>
                    Edad: 3 años<br>
                    Dispositivo: 1084835
                </p>
            </template>
        </Card>
    </div>
  </div>
    
</template>
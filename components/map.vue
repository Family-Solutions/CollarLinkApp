<template>
  <div class="map-container">
    <div class="map-wrapper" ref="mapWrapper"
      @wheel="handleWheel">
      <div class="image-container">
        <img 
          :src="imageSrc" 
          :style="{
            transform: `scale(${zoom})`,
            transformOrigin: 'center center'
          }"
          class="map-image"
        >
      </div>
    </div>
    <div class="zoom-controls">
      <button @click="zoomIn" class="zoom-btn">+</button>
      <button @click="zoomOut" class="zoom-btn">-</button>
      <button @click="resetZoom" class="zoom-btn">R</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const imageSrc = '/map.png';
const mapWrapper = ref<HTMLElement | null>(null);

// Zoom state with default zoom level of 1.2
const DEFAULT_ZOOM = 1.4;
const zoom = ref(DEFAULT_ZOOM);
const MIN_ZOOM = DEFAULT_ZOOM; // Minimum zoom level is now the default zoom
const MAX_ZOOM = 5;   // Maximum zoom level
const ZOOM_STEP = 0.15; // Zoom increment/decrement amount

// Zoom functions
const zoomIn = () => {
  if (zoom.value < MAX_ZOOM) {
    zoom.value = Math.min(MAX_ZOOM, zoom.value + ZOOM_STEP);
  }
};

const zoomOut = () => {
  if (zoom.value > MIN_ZOOM) {
    zoom.value = Math.max(MIN_ZOOM, zoom.value - ZOOM_STEP);
  }
};

const resetZoom = () => {
  zoom.value = DEFAULT_ZOOM;
};

// Wheel event handler for mouse wheel zooming
const handleWheel = (e: WheelEvent) => {
  e.preventDefault();
  
  if (e.deltaY < 0) {
    zoomIn();
  } else {
    zoomOut();
  }
};
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 80vh;
  overflow: hidden;
}

.map-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.map-image {
  will-change: transform;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  user-select: none;
  transition: transform 0.2s ease;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  background: rgba(0, 0, 0, 0.7);
  padding: 5px;
  border-radius: 5px;
  display: flex;
  gap: 5px;
}

.zoom-btn {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(97, 97, 97);
  border: 1px solid #ccc;
  border-radius: 3px;
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
}

.zoom-btn:hover {
  background: #f0f0f0;
}
</style>

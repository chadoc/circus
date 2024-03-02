<template>
  <div>
    <Background v-if="true" />
    <Player v-if="false" />
  </div>
</template>
<script setup lang="ts">
import Background from '@/components/Background.vue'
import Player from '@/components/Player.vue'
</script>
<style scoped>
#animationSelector {
  position: absolute;
  top: 0;
}
#canvas1 {
  border: 5px solid white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
}
</style>

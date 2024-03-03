<template>
  <div>
    <Background v-if="false" />
    <Player v-if="false" />
    <Enemy v-if="false" />
    <CameraAccess v-if="false" />
    <Cloud v-if="false" />
    <Shout v-if="false" />
    <FullGame v-if="true" />
  </div>
</template>
<script setup lang="ts">
import Background from '@/components/Background.vue'
import Player from '@/components/Player.vue'
import Enemy from '@/components/Enemy.vue'
import CameraAccess from '@/components/CameraAccess.vue'
import Cloud from '@/components/Cloud.vue'
import Shout from '@/components/Shout.vue'
import FullGame from '@/components/game/FullGame.vue'
</script>
<style scoped>
</style>

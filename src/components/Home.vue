<template>
  <div id="welcome">
    <p v-if="!landscapeMode">Veuillez tourner votre telephone en mode paysage</p>
    <div v-else>
      <div>
        <CameraAccess v-if="!play" @pictureTaken="pictureTaken"  />
        <FullGame v-if="userImg && play" :user-img="userImg" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import CameraAccess from '@/components/CameraAccess.vue'
import FullGame from '@/components/game/FullGame.vue'
import {onMounted, ref} from 'vue'

const play = ref(false)
const userImg = ref<any>()

const landscapeMode = ref(false)

onMounted(() => {
  landscapeMode.value = screen.orientation.type.indexOf('landscape') > -1
  console.log('mode', landscapeMode.value)
  window.addEventListener('orientationchange', (event) => {
    landscapeMode.value = screen.orientation.type.indexOf('landscape') > -1
  })
})



function pictureTaken({ img }: { img: any }) {
  console.log('pic is', img)
  userImg.value = img
  play.value = true
}

</script>
<style scoped>
#welcome {
  display: flex;
  justify-content: center;
}
</style>

<template>
  <div id="welcome">
    <p v-if="Config.requireLandscapeMode && !landscapeMode">Veuillez tourner votre telephone en mode paysage</p>
    <div v-else>
      <div v-if="loading">
        Loading
      </div>
      <div v-else>
        <CameraAccess v-if="!play" @pictureTaken="pictureTaken"  />
        <FullGame v-if="play" :user-img="userImg" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

import CameraAccess from '@/components/CameraAccess.vue'
import FullGame from '@/components/game/FullGame.vue'
import {onMounted, ref} from 'vue'
import Config from '@/components/game/Config'

const loading = ref(true)
const play = ref(false)
const userImg = ref<any>()
const landscapeMode = ref(false)

onMounted(() => {
  landscapeMode.value = screen.orientation.type.indexOf('landscape') > -1

  if (Config.requireLandscapeMode) {
    window.addEventListener('orientationchange', (event) => {
      landscapeMode.value = screen.orientation.type.indexOf('landscape') > -1
    })
  }
  if (!Config.requestUserPicture) {
    play.value = true
  }
  loading.value = false
})

function pictureTaken({ img }: { img: any }) {
  // console.log('pic is', img)
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

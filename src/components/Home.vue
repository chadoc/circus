<template>
  <div>
    <div id="welcome">
      <h1>Weclome</h1>
      <p>please, take a picture of you</p>
      <CameraAccess v-if="!play" @pictureTaken="pictureTaken"  />
    </div>
    <FullGame v-if="userImg && play" :user-img="userImg" />
  </div>
</template>
<script setup lang="ts">

import CameraAccess from '@/components/CameraAccess.vue'
import FullGame from '@/components/game/FullGame.vue'
import {ref} from 'vue'

const play = ref(false)
const userImg = ref<any>()

function pictureTaken({ img }: { img: any }) {
  console.log('pic is', img)
  userImg.value = img
  play.value = true
}

</script>
<style scoped>
#welcome {
  position: absolute;
}
</style>

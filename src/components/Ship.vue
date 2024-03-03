<template>
  <div id="ship-container">
    <img id="julien" src="../assets/plane/julien.webp" />
    <img id="plane" src="../assets/plane/shipPlane.png" />
    <img id="window" src="../assets/plane/shipWindow.png" />
  </div>
</template>
<script setup lang="ts">

</script>
<style scoped>
#ship-container {
  position: relative;
}
#window, #julien, #plane {
  position: absolute;
  top: 0;
  left: 0;
}

#julien {
  top: 150px;
  left: 170px;
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

#window, #plane {
  width: 500px;
}

#window {
  opacity: 0.4;
}

</style>

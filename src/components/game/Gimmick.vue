<template>
  <svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'>
    <foreignObject width='100%' height='100%'>
      <div xmlns='http://www.w3.org/1999/xhtml' class="bubble-text">
        {{gimmicks[0]}}
      </div>
    </foreignObject>
  </svg>
</template>
<script lang="ts">
import GimmickSource from '../../assets/gimmick/gimmick.txt?raw'

const gimmicks = (GimmickSource as string).split('\n')

</script>

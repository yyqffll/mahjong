<template>
  <div>x: {{x}}, y:{{y}}</div>
</template>

<script>
import getMousePosition from './views/hooks/mouseEvents'
export default {
  name: 'App',
  setup () {
    const { x, y } = getMousePosition()
    return {
      x,
      y
    }
  }
}
</script>

<style>
</style>

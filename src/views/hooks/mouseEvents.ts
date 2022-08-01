import { reactive, toRefs, onMounted, ToRefs } from 'vue'
interface positionProps {
  x: number,
  y: number,
  updatePostion: (e: MouseEvent) => void
}
function getMousePosition(): ToRefs<positionProps> {
  const position: positionProps = reactive({
    x: 0,
    y: 0,
    updatePostion: (e: MouseEvent) => {
      position.x = e.pageX
      position.y = e.pageY
    }
  })
  const positionRef = toRefs(position)
  onMounted(() => {
    document.addEventListener('click', position.updatePostion)
  })
  return {
    ...positionRef
  }
}
export default getMousePosition

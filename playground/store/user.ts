import { defineStore } from 'pinia'
import { ref } from 'vue'

export default defineStore('user', () => {
  const name = ref('Guest')
  const age = ref(0)

  function setName(newName: string) {
    name.value = newName
  }

  return { name, age, setName }
})

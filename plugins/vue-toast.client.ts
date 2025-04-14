// plugins/vue-toast.client.ts
import { defineNuxtPlugin } from '#app'
import ToastPlugin from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-bootstrap.css' // or any theme

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(ToastPlugin)
})

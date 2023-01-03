import Vue, { watch } from 'vue'
import { createPinia, PiniaVuePlugin } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { BootstrapVue, IconsPlugin, ModalPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ModalPlugin)
Vue.use(PiniaVuePlugin)
const pinia = createPinia();
if(localStorage.getItem('graphList')) {
  pinia.state.value.graphList = JSON.parse(localStorage.getItem('graphList')+'');
}
watch(
  ()=> pinia.state.value.graphlist,
  (state) => {
    localStorage.setItem('graphList', JSON.stringify(state))
  },
  {deep:true}
)
new Vue({
  router,
  pinia,
  render: (h) => h(App)
}).$mount('#app')

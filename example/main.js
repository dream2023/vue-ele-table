import Vue from 'vue'
import App from './App.vue'
import EleTable from '../src/index'

Vue.config.productionTip = false
Vue.use(EleTable)

new Vue({
  render: h => h(App)
}).$mount('#app')

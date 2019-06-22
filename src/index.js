import EleTable from './EleTable'

const Plugin = {}

Plugin.install = function (Vue, params = {}) {
  Vue.prototype.$EleTableParams = params
  Vue.component(EleTable.name, EleTable)
}

if (typeof window !== 'undefined' && window.Vue) {
  Plugin.install(window.Vue)
}

export { EleTable }
export default Plugin

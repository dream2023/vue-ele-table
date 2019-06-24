import EleTable from './EleTable'

const Plugin = {}

Plugin.install = function (Vue, params = {}) {
  Vue.prototype.$EleTableParams = params

  // vue-ele-editable 的全局配置
  if (params && params.editable) {
    Vue.prototype.$EleEditableParams = params.editable
  }
  Vue.component(EleTable.name, EleTable)
}

if (typeof window !== 'undefined' && window.Vue) {
  Plugin.install(window.Vue)
}

export { EleTable }
export default Plugin

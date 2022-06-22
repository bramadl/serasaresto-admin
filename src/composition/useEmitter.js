const { getCurrentInstance } = require('vue')

export function useEmitter () {
  const internalInstance = getCurrentInstance()
  const emitter = internalInstance.appContext.config.globalProperties.emitter

  return emitter
}

export default {
  eventMap: {} as Record<string, any>,
  init() {
    // 事件名称 和 方法的映射关系
    this.eventMap = {}
  },

  /**
   *  监听
   *  因为可能有相同的名字监听，但是回调函数不一样
   *  所以使用数组存储
   */
  on(eventName: string, fn: Function) {
    if (!this.eventMap[eventName])
      this.eventMap[eventName] = []

    let isHas = false
    const len = this.eventMap[eventName].length
    for (let i = 0; i < len; i++) {
      if (this.eventMap[eventName][i].toString() === fn.toString())
        isHas = true
    }
    if (isHas) return
    this.eventMap[eventName].push(fn)
  },

  /**
   * 发射事件
   * 一发射就自动调用方法
   */
  emit(eventName: string, ...args: any[]) {
    if (!this.eventMap[eventName])
      return
    this.eventMap[eventName].forEach((fn: Function) => {
      fn(...args)
    })
  },

  /**
   * 删除事件
   * 删除事件名和其对应的函数
   */
  off(eventName: string, fn: Function) {
    if (!this.eventMap[eventName])
      return

    // 可能拥有相同的事件名和相同的函数，所以循环删除
    this.eventMap[eventName].forEach((itemFn: Function, index: number) => {
      if (itemFn === fn) {
        // 使其位置还在，不过是为空
        delete this.eventMap[eventName][index]
      }
    })
    // 过滤空的值
    this.eventMap[eventName] = this.eventMap[eventName].filter((item: Function) => item)

    // 如果eventFns已经清空了
    if (this.eventMap[eventName].length === 0)
      delete this.eventMap[eventName]
  },

  /**
   * 清空事件名对应的事件函数数组
   */
  clear(eventName: string) {
    if (!this.eventMap[eventName])
      return
    delete this.eventMap[eventName]
  },

  /**
   * 清空所有事件
   */
  clearAll() {
    this.eventMap = {}
  },
}

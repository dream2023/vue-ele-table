export default {
  data () {
    return {
      easyGoTopIsMoving: false
    }
  },
  methods: {
    $goTop (backPosition = 0) {
      if (this.easyGoTopIsMoving) return
      const start = window.pageYOffset
      let i = 0
      this.easyGoTopIsMoving = true
      this.interval = setInterval(() => {
        const next = Math.floor(
          this.easyGoTopEaseInOutQuad(10 * i, start, -start, 500)
        )
        if (next <= backPosition) {
          window.scrollTo(0, backPosition)
          clearInterval(this.interval)
          this.easyGoTopIsMoving = false
        } else {
          window.scrollTo(0, next)
        }
        i++
      }, 16.7)
    },
    easyGoTopEaseInOutQuad (t, b, c, d) {
      if ((t /= d / 2) < 1) return (c / 2) * t * t + b
      return (-c / 2) * (--t * (t - 2) - 1) + b
    }
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}

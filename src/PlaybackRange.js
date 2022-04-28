const range = Object.assign(document.createElement('input'), {
  type: 'range',
  min: 0.25,
  max: 10,
  step: 0.1,
  value: 3,
  style: 'width: 20%; height: 1.5rem; min-width: 15em; position: fixed; bottom: 1rem; right: 1rem',

  oninput () {
    const value = this.value <= 3 ? this.value / 3 : (this.value * 4 - 5) / 7

    document.querySelectorAll('audio, video').foreach(node => node.playbackRate = value)
  },
  oncontextmenu () { 
    this.value = 3
    this.dispatchEvent(new Event('input'))

    return false
  },
  onkeyup (e) {
    if (e.key === 'Escape') {
      this.remove()
    }
  }
})

document.body.appendChild(node)

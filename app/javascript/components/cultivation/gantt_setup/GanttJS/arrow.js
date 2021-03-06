import { createSVG } from './svg_utils'

export default class Arrow {
  constructor(gantt, from_task, to_task) {
    this.gantt = gantt
    this.from_task = from_task
    this.to_task = to_task

    this.calculate_path()
    this.draw()
  }

  calculate_path() {
    let start_x =
      this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2

    const condition = () =>
      this.to_task.$bar.getX() < start_x + this.gantt.options.padding &&
      start_x > this.from_task.$bar.getX() + this.gantt.options.padding

    while (condition()) {
      start_x -= 10
    }

    const start_y =
      this.gantt.options.header_height +
      this.gantt.options.bar_height +
      (this.gantt.options.padding + this.gantt.options.bar_height) *
        this.from_task.task._index +
      this.gantt.options.padding

    const end_x = this.to_task.$bar.getX() - this.gantt.options.padding / 2
    const end_y =
      this.gantt.options.header_height +
      this.gantt.options.bar_height / 2 +
      (this.gantt.options.padding + this.gantt.options.bar_height) *
        this.to_task.task._index +
      this.gantt.options.padding

    const from_is_below_to =
      this.from_task.task._index > this.to_task.task._index
    const curve = this.gantt.options.arrow_curve
    const clockwise = from_is_below_to ? 1 : 0
    const curve_y = from_is_below_to ? -curve : curve
    const offset = from_is_below_to
      ? end_y + this.gantt.options.arrow_curve
      : end_y - this.gantt.options.arrow_curve

    this.path = `
            M ${start_x} ${start_y}
            V ${offset}
            a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
            L ${end_x} ${end_y}
            m -5 -5
            l 5 5
            l -5 5`
    this.start_x = start_x - 20
    this.start_y = start_y
    this.end_y = end_y
    this.end_x = end_x

    if (
      this.to_task.$bar.getX() <
      this.from_task.$bar.getX() + this.gantt.options.padding
    ) {
      const down_1 = this.gantt.options.padding / 2 - curve
      const down_2 =
        this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - curve_y
      const left = this.to_task.$bar.getX() - this.gantt.options.padding
      this.path = `
                M ${start_x} ${start_y}
                v ${down_1}
                a ${curve} ${curve} 0 0 1 -${curve} ${curve}
                H ${left}
                a ${curve} ${curve} 0 0 ${clockwise} -${curve} ${curve_y}
                V ${down_2}
                a ${curve} ${curve} 0 0 ${clockwise} ${curve} ${curve_y}
                L ${end_x} ${end_y}
                m -5 -5
                l 5 5
                l -5 5`
      this.start_x = start_x - 50
      this.start_y = start_y
      this.end_y = end_y
      this.end_x = end_x
    }
  }

  getCoordinate() {
    return {
      start_x: this.start_x,
      start_y: this.start_y,
      end_x: this.end_x,
      end_y: this.end_y
    }
  }

  draw() {
    this.element = createSVG('path', {
      d: this.path,
      'data-from': this.from_task.task.id,
      'data-to': this.to_task.task.id,
      class: 'handle-arrow'
    })
  }

  update() {
    this.calculate_path()
    // this.element.classList.remove('on')
    this.element.setAttribute('d', this.path)
  }

  update_arrow(x, y) {
    let start_x =
      this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2
    const start_y =
      this.gantt.options.header_height +
      this.gantt.options.bar_height +
      (this.gantt.options.padding + this.gantt.options.bar_height) *
        this.from_task.task._index +
      this.gantt.options.padding

    let path = `
            M ${start_x} ${start_y}
            L ${x} ${y}`
    this.element.setAttribute('d', path)
  }
}

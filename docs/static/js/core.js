class svgMap {
  /**
   * 变量
   */
  selection = []

  /**
   * 构造函数
   */
  constructor (data) {
    this.SVG_NS = 'http://www.w3.org/2000/svg';
    const params = {
      map: china,
      width: 900,
      height: 500,
      label: {
        visible: false,
        fontSize: 12,
        basicColor: '#ffffff',
        hoverColor: '#ffff00',
        clickColor: '#ff0000',
        opacity: .8
      },
      stroke: {
        width: 1,
        color: '#ffffff',
        linejoin: 'round',
        opacity: .2
      },
      fill: {
        basicColor: '#3f99f9',
        hoverColor: '#0880ff',
        clickColor: '#006bde',
        opacity: 1
      }
    }
    this.map = params.map
    this.width = params.width
    this.height = params.height
    this.label = params.label
    this.stroke = params.stroke
    this.fill = params.fill
    this.init(this.map)
  }
  /**
   * 初始化SVG
   */
  init (map) {
    // 容器
    this.$map = document.getElementById('map');
    // SVG元素
    this.$svg = document.createElementNS(this.SVG_NS, 'svg');
    this.$svg.setAttribute('version', '1.1')
    this.$svg.setAttribute('xmlns', this.SVG_NS)
    this.$svg.setAttribute('viewBox', `-20 -20 ${this.width} ${this.height}`)
    this.$svg.setAttribute('width', this.width)
    this.$svg.setAttribute('height', this.height)
    // 遍历地图数据
    let paths = []
    let texts = []
    for (let key in map) {
      const { name, svg, textPosition } = map[key]
      // Path
      const $path = document.createElementNS(this.SVG_NS, 'path')
      $path.setAttribute('d', svg)
      $path.setAttribute('data-name', name)
      $path.setAttribute('data-id', key)
      $path.setAttribute('fill', this.fill.basicColor)
      $path.setAttribute('fill-opacity', this.fill.opacity)
      $path.setAttribute('data-fill-basic', this.fill.basicColor)
      $path.setAttribute('data-fill-hover', this.fill.hoverColor)
      $path.setAttribute('data-fill-click', this.fill.clickColor)
      $path.setAttribute('stroke', this.stroke.color)
      $path.setAttribute('stroke-width', this.stroke.width)
      $path.setAttribute('stroke-opacity', this.stroke.opacity)
      $path.setAttribute('stroke-linejoin', this.stroke.linejoin)
      $path.style.cursor = 'pointer'
      $path.style.transition = 'all .5s ease 0s';
      // Label
      const [x, y] = textPosition
      const $label = document.createElementNS(this.SVG_NS, 'text')
      $label.setAttribute('data-id', key)
      $label.setAttribute('x', x)
      $label.setAttribute('y', y)
      $label.setAttribute('fill', this.label.basicColor)
      $label.setAttribute('data-fill-basic', this.label.basicColor)
      $label.setAttribute('data-fill-hover', this.label.hoverColor)
      $label.setAttribute('data-fill-click', this.label.clickColor)
      $label.setAttribute('font-size', this.label.fontSize)
      $label.setAttribute('opacity', this.label.opacity)
      $label.style.pointerEvents = 'none'
      $label.style.transition = 'all .5s ease 0s';
      $label.innerHTML = name
      // Action
      $path.addEventListener('mouseenter', this.handleMonseEnter.bind($path, $label), false)
      $path.addEventListener('mouseleave', this.handleMonseLeave.bind($path, $label), false)
      $path.addEventListener('click', this.handleClick.bind($path, $label), false)
      // 插入DOM
      this.$svg.appendChild($path)
      setTimeout(() => {
        this.$svg.appendChild($label)
      }, 1)
    }
    // 装载页面
    this.$map.appendChild(this.$svg)
  }
  /**
   * 切换地图
   */
  changeMap (obj) {
    this.init(obj)
  }
  /**
   * 鼠标移入
   */
  handleMonseEnter ($label) {
    const fillColor =  this.getAttribute('data-fill-hover')
    const labelColor =  $label.getAttribute('data-fill-hover')
    this.setAttribute('fill', fillColor)
    $label.setAttribute('fill', labelColor)
  }
  /**
   * 鼠标移出
   */
  handleMonseLeave ($label) {
    const fillColor =  this.getAttribute('data-fill-basic')
    const labelColor =  $label.getAttribute('data-fill-basic')
    this.setAttribute('fill', fillColor)
    $label.setAttribute('fill', labelColor)
  }
  /**
   * 鼠标点击
   */
  handleClick ($label) {
    const fillColor =  this.getAttribute('data-fill-click')
    const labelColor =  $label.getAttribute('data-fill-click')
    this.setAttribute('fill', fillColor)
    $label.setAttribute('fill', labelColor)
  }
}






























// 数据配置
import { china } from './china.js'

// 实例化
new svgMap({})
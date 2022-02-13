class svgMap {
  /**
   * 变量
   */
  selection = [];
  /**
   * 构造函数
   */
  constructor (data) {
    this.SVG_NS = 'http://www.w3.org/2000/svg';
    let params = {
      map: china,
      width: 900,
      height: 500,
      multiple: false,
      label: {
        visible: false,
        fontSize: 12,
        basicColor: '#ffffff',
        hoverColor: '#ffff00',
        clickColor: '#ffff00',
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
      },
      bar: {
        maxWidth: 200,
        backgroundColor: 'rgba(255, 255, 255, .8)',
        opacity: 1,
        padding: '8px 10px',
        border: {
          width: 1,
          radius: 5,
          color: '#dddddd',
          style: 'solid'
        },
        font: {
          color: '#333333',
          size: 12,
        },
        offset: {
          x: 20,
          y: 10
        }
      },
      disabled: {
        except: false,
        backgroundColor: '#dddddd',
        fontColor: '#999999',
        name: []
      }
    }
    console.log(data)
    params = this.merge(params, data)
    console.log(params)
    this.map = params.map
    this.width = params.width
    this.height = params.height
    this.multiple = params.multiple
    this.label = params.label
    this.stroke = params.stroke
    this.fill = params.fill
    this.bar = params.bar
    this.disabled = params.disabled
    // 初始化
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
    this.$svg.style.position = 'relative'
    this.$svg.style.zIndex = 1
    // 遍历地图数据
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
      $path.style.transition = 'all .2s ease 0s';
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
      $label.style.transition = 'all .2s ease 0s';
      $label.innerHTML = name
      // Disabled
      if (this.disabled.name.length > 0) {
        if (~this.disabled.name.indexOf(key)) {
          if (!this.disabled.except) {
            $path.setAttribute('data-disabled', true)
            $label.setAttribute('data-disabled', true)
            $path.setAttribute('fill', this.disabled.backgroundColor)
            $label.setAttribute('fill', this.disabled.fontColor)
            $path.style.cursor = 'not-allowed'
          } else {      
            $path.addEventListener('mouseenter', this.handleMonseEnter.bind(this, $path, $label), false)
            $path.addEventListener('mousemove', this.handleMonseMove.bind(this, $path, $label), false)
            $path.addEventListener('mouseleave', this.handleMonseLeave.bind(this, $path, $label), false)
            $path.addEventListener('click', this.handleClick.bind(this, $path, $label), false)
          }
        } else {
          if (this.disabled.except) {
            $path.setAttribute('data-disabled', true)
            $label.setAttribute('data-disabled', true)
            $path.setAttribute('fill', this.disabled.backgroundColor)
            $label.setAttribute('fill', this.disabled.fontColor)
            $path.style.cursor = 'not-allowed'
          } else {
            $path.addEventListener('mouseenter', this.handleMonseEnter.bind(this, $path, $label), false)
            $path.addEventListener('mousemove', this.handleMonseMove.bind(this, $path, $label), false)
            $path.addEventListener('mouseleave', this.handleMonseLeave.bind(this, $path, $label), false)
            $path.addEventListener('click', this.handleClick.bind(this, $path, $label), false)
          }
        }
      } else {
        $path.addEventListener('mouseenter', this.handleMonseEnter.bind(this, $path, $label), false)
        $path.addEventListener('mousemove', this.handleMonseMove.bind(this, $path, $label), false)
        $path.addEventListener('mouseleave', this.handleMonseLeave.bind(this, $path, $label), false)
        $path.addEventListener('click', this.handleClick.bind(this, $path, $label), false)
      }
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
   * 鼠标移入
   */
  handleMonseEnter ($path, $label, e) {
    const id = $path.getAttribute('data-id')
    const name = $path.getAttribute('data-name')
    const fillColor =  $path.getAttribute('data-fill-hover')
    const labelColor =  $label.getAttribute('data-fill-hover')
    const fillColor2 =  $path.getAttribute('data-fill-click')
    const labelColor2 =  $label.getAttribute('data-fill-click')
    const index = this.selection.indexOf(id)
    if (~index) {
      $path.setAttribute('fill', fillColor2)
      $label.setAttribute('fill', labelColor2)
    } else {
      $path.setAttribute('fill', fillColor)
      $label.setAttribute('fill', labelColor)
    }
    // bar
    this.$bar = document.createElement('div');
    const $barText = document.createElement('span');
    $barText.style.backgroundColor = this.bar.backgroundColor;
    $barText.style.opacity = this.bar.opacity;
    $barText.style.padding = this.bar.padding;
    $barText.style.borderWidth = this.bar.border.width + 'px'
    $barText.style.borderStyle = this.bar.border.style
    $barText.style.borderColor = this.bar.border.color
    $barText.style.borderRadius = this.bar.border.radius + 'px';
    $barText.style.lineHeight = 1.2
    $barText.style.fontSize = this.bar.font.size + 'px'
    $barText.innerHTML = name;
    const { pageX, pageY } = e
    const zIndex = Number(this.getStyle(this.$svg, 'zIndex'))
    this.$bar.style.position = 'fixed'
    this.$bar.style.zIndex = zIndex + 1
    this.$bar.style.left = (pageX + this.bar.offset.x) + 'px'
    this.$bar.style.top = (pageY + this.bar.offset.y) + 'px'
    this.$bar.appendChild($barText)
    document.body.appendChild(this.$bar)
  }
  /**
   * 鼠标移动
   */
  handleMonseMove ($path, $label, e) {
    // bar
    const { pageX, pageY } = e
    this.$bar.style.left = (pageX + this.bar.offset.x) + 'px'
    this.$bar.style.top = (pageY + this.bar.offset.y) + 'px'
  }
  /**
   * 鼠标移出
   */
  handleMonseLeave ($path, $label) {
    const id = $path.getAttribute('data-id')
    const fillColor =  $path.getAttribute('data-fill-basic')
    const labelColor =  $label.getAttribute('data-fill-basic')
    const fillColor2 =  $path.getAttribute('data-fill-click')
    const labelColor2 =  $label.getAttribute('data-fill-click')
    const index = this.selection.indexOf(id)
    if (~index) {
      $path.setAttribute('fill', fillColor2)
      $label.setAttribute('fill', labelColor2)
    } else {
      $path.setAttribute('fill', fillColor)
      $label.setAttribute('fill', labelColor)
    }
    // bar
    this.$bar.remove()
  }
  /**
   * 鼠标点击
   */
  handleClick ($path, $label, e) {
    const id = $path.getAttribute('data-id')
    const fillColor =  $path.getAttribute('data-fill-basic')
    const labelColor =  $label.getAttribute('data-fill-basic')
    const fillColor2 =  $path.getAttribute('data-fill-click')
    const labelColor2 =  $label.getAttribute('data-fill-click')
    $path.setAttribute('fill', fillColor2)
    $label.setAttribute('fill', labelColor2)
    const index = this.selection.indexOf(id)
    if (~index) {
      this.selection.splice(index, 1)
    } else {
      if (this.multiple) {
        this.selection.push(id)
      } else {
        this.selection = [id]
        this.$svg.childNodes.forEach(item => {
          if (item.getAttribute('data-disabled')) return false
          if (item.nodeName === 'path') {
            if (item.getAttribute('data-id') !== $path.getAttribute('data-id')) {
              item.setAttribute('fill', fillColor)
            }
          }
          if (item.nodeName === 'text') {
            if (item.getAttribute('data-id') !== $path.getAttribute('data-id')) {
              item.setAttribute('fill', labelColor)
            }
          }
        })
      }
    }
  }
  /**
   * 切换地图
   */
  changeMap (obj) {
    this.init(obj)
  }
  /**
   * 获取样式
   */
   getStyle (obj, attr) {
    if (obj.currentStyle) {
      return obj.currentStyle[attr];
    } else {
      return document.defaultView.getComputedStyle(obj, null)[attr];
    }
  }
  /**
   * 合并数据
   */
  merge (original, src) {
    for (let key in original) {
      if (key in src) {
        if (typeof original[key] === typeof src[key]) {
          if (typeof original[key] === 'object' && typeof original[key].length !== 'number' && key !== 'map') {
            this.merge(original[key], src[key])
          } else {
            original[key] = src[key]
          }
        }
      }
    }
    return original
  }
}






























// 数据配置
import { china } from '../json/china.js'
import { hunan } from '../json/hunan.js'

// 实例化
new svgMap({
  map: hunan
})
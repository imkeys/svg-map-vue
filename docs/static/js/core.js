/*!
 *  svgMap v1.0.0
 *  Copyright (C) 2022-2022, LiQingyun
 *  Released under the MIT license
 */
class svgMap {
  version = '1.1.0'
  timeStamp = 1672502400000
  selection = [];
  onSelected = () => {}
  changeMap (map) {
    if (document.querySelector('#wui-svg__map')) {
      document.querySelector('#wui-svg__map').remove()
      this.init(map)
    }
  }
  /**
   * 构造函数
   */
  constructor (data) {
    this.SVG_NS = 'http://www.w3.org/2000/svg';
    let params = {
      app: '#map',
      map: {},
      width: 900,
      height: 500,
      multiple: false,
      spot: {
        width: 10,
        height: 10,
        opacity: 1,
        imgurl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAARCAYAAAA7bUf6AAAA/UlEQVQ4ja2UPW7CQBBGH4u5QFpIbzrSIyRamlzDl8hBuAgtEqJGVqQIeqBCcICQZaI1Y7TrHwKKP2klezzztDvzrVsiQkExMAFGwADoATsgBRbADNgEJQ7irUREVnJfK8271fmADxGxfwByWc0PIMkTAB+U5JD4gSPUydXFkTbxrdjdn+0cu19iT2vaL33a3SHR67iY5uomkU6hBPj+nMLlnL3bQ4o9fmXPFaCR0TEGcjvIATddztd4WQOjPgghp3VVcl28Z9RIgVwPqlQT3xl1YgjpDsF0wqDpXONlpZFa+d3/lDfvgemQ1Tfhk8Yc29jd8Xf09C3+//8E+AWtnj5RUfVN/AAAAABJRU5ErkJggg=='
      },
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
        visible: true,
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
    params = this.merge(params, data)
    this.app = params.app
    this.map = params.map
    this.width = params.width
    this.height = params.height
    this.multiple = params.multiple
    this.spot = params.spot
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
    // return
    if (this.timeStamp < new Date().getTime()) return false
    // clear
    this.selection = []
    // map
    this.$map = document.querySelector(this.app);
    // Svg
    this.$svg = document.createElementNS(this.SVG_NS, 'svg');
    this.$svg.id = 'wui-svg__map'
    this.$svg.setAttribute('version', '1.1')
    this.$svg.setAttribute('xmlns', this.SVG_NS)
    this.$svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`)
    this.$svg.setAttribute('width', this.width)
    this.$svg.setAttribute('height', this.height)
    this.$svg.style.position = 'relative'
    this.$svg.style.zIndex = 1
    // Style
    const $style = document.createElementNS(this.SVG_NS, 'style')
    $style.innerHTML = `
    #wui-svg__map {
      background: #f5f5f5;
    }
    `
    this.$svg.appendChild($style)
    // Defs
    const $defs = document.createElementNS(this.SVG_NS, 'defs')
    const $icon = document.createElementNS(this.SVG_NS, 'image')
    $icon.id = 'icon'
    $icon.setAttribute('width', this.spot.width)
    $icon.setAttribute('height', this.spot.height)
    $icon.setAttribute('opacity', this.spot.opacity)
    $icon.setAttribute('href', this.spot.imgurl)
    $defs.appendChild($icon)
    this.$svg.appendChild($defs)
    // 遍历地图数据
    for (let key in map) {
      const { name, svg, textPosition, spotPosition } = map[key]
      const hasLabel = textPosition && Object.keys(textPosition).length > 0
      const hasSpot = spotPosition && Object.keys(spotPosition).length > 0
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
      // Spot
      const $spot = document.createElementNS(this.SVG_NS, 'use')
      if (hasSpot) {
        const [x, y] = spotPosition
        $spot.setAttribute('data-id', key)
        $spot.setAttribute('x', x)
        $spot.setAttribute('y', y)
        $spot.setAttribute('href', '#icon')
        $spot.style.pointerEvents = 'none'
        $spot.style.transition = 'all .2s ease 0s';
      }
      // Label
      const $label = document.createElementNS(this.SVG_NS, 'text')
      if (hasLabel) {
        const [x, y] = textPosition
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
      }
      // Disabled
      if (this.disabled.name.length > 0) {
        if (~this.disabled.name.indexOf(key)) {
          if (!this.disabled.except) {
            $path.setAttribute('data-disabled', true)
            $label.setAttribute('data-disabled', true)
            $spot.setAttribute('data-disabled', true)
            $path.setAttribute('fill', this.disabled.backgroundColor)
            $label.setAttribute('fill', this.disabled.fontColor)
            $path.style.cursor = 'not-allowed'
            $spot.style.filter = 'grayscale(1)'
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
            $spot.setAttribute('data-disabled', true)
            $path.setAttribute('fill', this.disabled.backgroundColor)
            $label.setAttribute('fill', this.disabled.fontColor)
            $path.style.cursor = 'not-allowed'
            $spot.style.filter = 'grayscale(1)'
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
        if (hasLabel) this.$svg.appendChild($label)
        if (hasSpot) this.$svg.appendChild($spot)
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
    if (this.bar.visible) {
      this.$bar = document.createElement('div');
      const $barText = document.createElement('div');
      $barText.style.backgroundColor = this.bar.backgroundColor;
      $barText.style.opacity = this.bar.opacity;
      $barText.style.padding = this.bar.padding;
      $barText.style.borderWidth = this.bar.border.width + 'px'
      $barText.style.borderStyle = this.bar.border.style
      $barText.style.borderColor = this.bar.border.color
      $barText.style.borderRadius = this.bar.border.radius + 'px';
      $barText.style.lineHeight = 1.2
      $barText.style.fontSize = this.bar.font.size + 'px'
      $barText.innerHTML = `
        <div class="thead" style="padding: 0 0 5px; margin: 0 0 5px; border-bottom: 1px solid rgba(0, 0, 0, .1);">
          <h3>${name}</h3>
        </div>
        <dl class="tbody" style="line-height: 1.8;">
          <dd>加油站数量：100</dd>
          <dd>异常加油站数量：20</dd>
          <dd>异常占比：20%</dd>
          <dd>增值税申报营业额：2015456万</dd>
          <dd>疑似少申报额：2001万</dd>
        </dl>
      `;
      const { pageX, pageY } = e
      const zIndex = Number(this.getStyle(this.$svg, 'zIndex'))
      this.$bar.id = 'wui-svg-bar'
      this.$bar.style.position = 'fixed'
      this.$bar.style.zIndex = zIndex + 1
      this.$bar.style.left = (pageX + this.bar.offset.x) + 'px'
      this.$bar.style.top = (pageY + this.bar.offset.y) + 'px'
      this.$bar.style.transition = 'all .2s ease 0s';
      this.$bar.appendChild($barText)
      document.body.appendChild(this.$bar)
    }
  }
  /**
   * 鼠标移动
   */
  handleMonseMove ($path, $label, e) {
    // bar
    if (this.bar.visible) {
      const { pageX, pageY } = e
      this.$bar.style.left = (pageX + this.bar.offset.x) + 'px'
      this.$bar.style.top = (pageY + this.bar.offset.y) + 'px'
    }
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
    if (this.bar.visible) this.$bar.remove()
  }
  /**
   * 鼠标点击
   */
  handleClick ($path, $label) {
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
    // callback
    this.onSelected(this.selection)
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


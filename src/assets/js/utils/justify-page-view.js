/**
 * @title 初始化页面的比例，适配各种显示器（尤其是开发环境的1920*1080的显示器）。
 */
(function () {
  let sw = screen.width
  let sh = screen.height
  let rem = 20
  const BASE_WIDTH = 1920
  let rootStyle = document.documentElement.style
  rootStyle.width = BASE_WIDTH + 'px'
  rootStyle.height = '1080px'
  if (sw > BASE_WIDTH) {
    rootStyle.width = sw + 'px'
    rootStyle.height = sh + 'px'
    rem *= (screen.width / BASE_WIDTH)
  }
  rootStyle.fontSize = rem + 'px'
})()

// 全局禁用右键、内容选择等
const evt = {
  handleEvent: e => {
    e.preventDefault()
  }
}
window.addEventListener('contextmenu', evt, false)
window.addEventListener('selectstart', evt, false)

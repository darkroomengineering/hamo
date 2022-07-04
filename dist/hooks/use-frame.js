Object.defineProperty(exports, '__esModule', { value: !0 })
var tempus = require('@studio-freight/tempus'),
  react = require('react')
function useFrame(r, t = 0) {
  react.useEffect(() => {
    if (r) {
      const e = tempus.raf.add(r, t)
      return () => {
        tempus.raf.remove(e)
      }
    }
  }, [r, t])
}
exports.useFrame = useFrame
//# sourceMappingURL=use-frame.js.map

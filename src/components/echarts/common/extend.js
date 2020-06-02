export const extend = (function () {
  var isObjFunc = function (name) {
    var toString = Object.prototype.toString
    return function () {
      return toString.call(arguments[0]) === '[object ' + name + ']'
    }
  }
  let isObject = isObjFunc('Object')
  let isArray = isObjFunc('Array')
  let isBoolean = isObjFunc('Boolean')
  return function extend () {
    let index = 0
    let obj, copy, destination, source, i
    let isDeep = false
    if (isBoolean(arguments[0])) {
      index = 1
      isDeep = arguments[0]
    }
    for (i = arguments.length - 1; i > index; i--) {
      destination = arguments[i - 1]
      source = arguments[i]
      if (isObject(source) || isArray(source)) {
        for (var property in source) {
          obj = source[property]
          if (isDeep && (isObject(obj) || isArray(obj))) {
            copy = isObject(obj) ? {} : []
            var extended = extend(isDeep, copy, obj)
            destination[property] = extended
          } else {
            destination[property] = source[property]
          }
        }
      } else {
        destination = source
      }
    }
    return destination
  }
})()

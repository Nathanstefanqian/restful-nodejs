module.exports = {
  ls(params, roleName, ctx) {
    console.log(roleName)
    return params
  },
  post(params, roleName, ctx) {
    return params
  },
  get(params, roleName, ctx, id) {
    return params
  },
  put(params, roleName, ctx, id) {
    return params
  },
  del(params, roleName, ctx, id) {
    return params
  }
}

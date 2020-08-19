let baseURL = 'http://192.168.43.184:5000'
export {baseURL}

export default function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: options.header || {},
      success: resolve,
      fail: reject
    })
  })
}
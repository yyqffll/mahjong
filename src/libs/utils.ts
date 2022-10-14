import Cookies from 'js-cookie'

export const TOKEN_KEY = 'token'

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, {
    expires: 7
  })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const setLocalStorage = (key: string, value: unknown, days = 1) => {
  // 设置过期原则
  if (!value) {
    localStorage.removeItem(key)
  } else {
    const Days = days // 默认保留1天
    const exp = new Date()
    localStorage[key] = JSON.stringify({
      value,
      expires: exp.getTime() + Days * 24 * 60 * 60 * 1000
    })
  }
}

export const getLocalStorage = (key: string) => {
  try {
    const o = JSON.parse(localStorage[key])
    if (!o || o.expires < Date.now()) {
      return false
    } else {
      return o.value
    }
  } catch (e) {
    // 兼容其他localstorage
    return localStorage[key]
  }
}

export const delLocalStorage = (key: string) => {
  localStorage.removeItem(key)
}

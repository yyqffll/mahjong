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


const token = localStorage.getItem('accessToken')

const config = {
  headers : {
    'Content-Type':'application/json',
    Authorization : `Bearer ${token} `
  }
}
export default config
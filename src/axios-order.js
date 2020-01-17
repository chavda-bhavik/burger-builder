import axios from 'axios'
const instance = axios.create({
    baseURL: 'https://react-burger-5133e.firebaseio.com/'
})
export default instance
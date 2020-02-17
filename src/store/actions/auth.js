import axios from 'axios'
import * as actionTypes from './actionTypes'
import keys from '../../keys'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}
export const authSuccess = (authData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        authData: authData
    }
}
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
export const auth = (email,password,isSignup) => {
    return dispatch => {
        dispatch(authStart())
        const authData = {
            email,
            password,
            returnSecureToken: true
        }
        let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+keys.firebase_id
        if(!isSignup) url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+keys.firebase_id

        axios.post(url, authData)
            .then( res => {
                console.log(res)
                dispatch(authSuccess(res.data))
            })
            .catch( err => {
                console.log(err);
                dispatch(authFail(err))
            })
    }
}
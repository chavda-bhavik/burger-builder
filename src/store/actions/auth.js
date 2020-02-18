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
        idToken: authData.idToken,
        userId: authData.localId
    }
}
export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}
export const logout = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}
export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout())
        }, expirationTime)
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
                dispatch(checkAuthTimeout(res.data.expiresIn))
            })
            .catch( err => {
                console.log(err);
                dispatch(authFail(err.response.data.error))
            })
    }
}
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
        type: actionTypes.AUTH_INITIATE_LOGOUT
    }
}
export const logoutSucceed = () => {
    return {
        type: actionTypes.AUTH_LOGOUT
    }
}
export const checkAuthTimeout = (expirationTime) => {
    return {
        type: actionTypes.AUTH_CHECK_TIMEOUT,
        expirationTime: expirationTime
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
                const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000)
                //console.log(new Date().getTime(), res.data.expiresIn, expirationDate);
                localStorage.setItem('token',res.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', res.data.localId);
                dispatch(authSuccess(res.data))
                dispatch(checkAuthTimeout(res.data.expiresIn))
            })
            .catch( err => {
                dispatch(authFail(err.response.data.error))
            })
    }
}
export const setAuthRedirectPath = (path) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}
export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token')
        if(!token) {
            dispatch(logout())
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            if(expirationDate < new Date()) {
                dispatch(logout())
            } else {
                const userId = localStorage.getItem('userId')
                dispatch(authSuccess(token,userId))
                dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000 ))
            }
        }
    }
}
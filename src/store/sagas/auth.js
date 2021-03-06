import { put, delay } from "redux-saga/effects";
import axios from 'axios'
import * as actions from '../actions/index'
import keys from "../../keys";

export function* logoutSaga(action) {
    yield localStorage.removeItem('token')
    yield localStorage.removeItem('expirationDate')
    yield localStorage.removeItem('localId')
    yield localStorage.removeItem('userId')
    yield put(actions.logoutSucceed)
}

export function* checkAuthTimeoutSaga(action) {
    yield delay(action.expirationTime * 1000)
    yield put(actions.logout())
}

export function* authUserSaga(action) {
    yield put(actions.authStart())
    const authData = {
        email: action.email,
        password: action.password,
        returnSecureToken: true
    }
    let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+keys.firebase_id
    if(!action.isSignup) url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+keys.firebase_id

    try{
        const res = yield axios.post(url, authData)
        const expirationDate = yield new Date(new Date().getTime() + res.data.expiresIn * 1000)
        //console.log(new Date().getTime(), res.data.expiresIn, expirationDate);
        yield localStorage.setItem('token',res.data.idToken);
        yield localStorage.setItem('expirationDate', expirationDate);
        yield localStorage.setItem('userId', res.data.localId);
        yield put(actions.authSuccess(res.data))
        yield put(actions.checkAuthTimeout(res.data.expiresIn))
    } catch(error) {
        yield put(actions.authFail(error.response.data.error))
    }
}

export function* authCheckStateSaga(action) {
    const token = yield localStorage.getItem('token')
    if(!token) {
        yield put(actions.logout())
    } else {
        const expirationDate = yield new Date(localStorage.getItem('expirationDate'))
        if(expirationDate < new Date()) {
            yield put(actions.logout())
        } else {
            const userId = yield localStorage.getItem('userId')
            yield put(actions.authSuccess(token,userId))
            yield put(actions.checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) / 1000 ))
        }
    }
}
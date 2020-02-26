import reducer from './auth'
import * as actionTypes from '../actions/actionTypes'

let initialState = {
    token: null,
    error: null,
    userId: null,
    loading: false,
    authRedirect: '/',
}

describe('auth reducer', () => {
    it('should return the initial state',() => {
        expect(reducer(undefined,{})).toEqual(initialState)
    })
    it('should store token upon login', () => {
        expect(reducer(initialState, { 
                type: actionTypes.AUTH_SUCCESS, 
                idToken: 'some-token',
                userId: 'some-id'
            })
        ).toEqual({
            ...initialState,
            token: 'some-token',
            userId: 'some-id'
        })
    })
})
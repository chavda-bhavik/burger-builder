import React, { useState, useEffect } from 'react'

import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.css'
import * as actions from './../../store/actions/index'
import Spinner from './../../components/UI/Spinner/Spinner'
import { updateObject, checkValidity } from "./../../shared/utility";

const auth = (props) => {
    const [isSignup, setIsSignup] = useState(true);
    const [controls, setControls] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'Your Email',
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false,
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Your Password',
            },
            value: '',
            validation: {
                required: true,
                minLength: 4
            },
            valid: false,
            touched: false
        }
    })

    useEffect(() => {
        if (!props.buildingBurger.building && props.authRedirectPath === "/") {
            props.onSetAuthRedirectPath()
        }
    }, [])
    const switchAuthModeHandler = () => {
        setIsSignup(!isSignup);
    } 
    const inputChangedHandler = (event, controlName) => {
        const updatedControls = updateObject(controls, {
            [controlName]: updateObject(controls[controlName], {
                value: event.target.value,
                valid: checkValidity(event.target.value, controls[controlName].validation),
                touched: true
            })
        })
        setControls(updatedControls)
    }
    const onSubmitHandler = (event) => {
        event.preventDefault();
        props.onAuth(controls.email.value,controls.password.value, isSignup)
    }
    
    const formElementsArray = []
    for (let key in controls) {
        formElementsArray.push({
            id: key,
            config: controls[key]
        })
    }
    let form = formElementsArray.map( formElement => (
        <Input 
            key={formElement.id}
            elementType={formElement.config.elementType} 
            elementConfig={formElement.config.elementConfig} 
            value={formElement.config.value} 
            inValid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            valueType={formElement.config.valueType}
            changed={(event) => inputChangedHandler(event, formElement.id)}
        />
    ))
    if(props.loading) {
        form = <Spinner />
    }
    
    let errorMessage = null;
    if(props.error) {
        errorMessage = (
            <p>{props.error.message}</p>
        )
    }

    let authRedirect = null
    if(props.isAuthenticated) {
        authRedirect = <Redirect to={props.authRedirectPath} />
    }
    return (
        <div className={classes.Auth}>
            {errorMessage}
            {authRedirect}
            <form onSubmit={onSubmitHandler}>
                {form}
                <Button btnType="Success" >SUBMIT</Button>
            </form>
            <Button
                clicked={switchAuthModeHandler}
                btnType="Danger"
            >
                SWITCH TO {isSignup ? 'SIGNIN' : 'SIGNUP'}
            </Button>
        </div>
    )
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email,password, isSignup) => dispatch(actions.auth(email,password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath("/"))
    }
}
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirect
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(auth)
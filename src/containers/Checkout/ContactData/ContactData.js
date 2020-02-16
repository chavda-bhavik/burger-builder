import React, { Component } from 'react'

import Button from './../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from './../../../axios-order'
import Spinner from './../../../components/UI/Spinner/Spinner'
import Input from './../../../components/UI/Input/Input'
import { connect } from "react-redux";
import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler'
import * as actions from './../../../store/actions/index'

class contactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name',
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                valueType: "Name"
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Street',
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                valueType: "Street"
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Zipcode',
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false,
                valueType: "Zipcode"
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Country',
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                valueType: "Country"
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Email',
                },
                value: '',
                validation: {
                    required: true,
                },
                valid: false,
                touched: false,
                valueType: "Email"
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                valid: true
            }
        },
        formIsValid: false
    }
    orderHandler = (event) => {
        event.preventDefault()

        const formData = {}
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        //axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
        // console.log(this.props.ingredients)
        
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        this.props.onOrderBurger(order);
    }
    checkValidity = (value, rules) => {
        let isValid = true
        if(!rules) return true;
        if(rules.required) {
            isValid = value.trim() !== "" && isValid
        }
        if(rules.minLength) {
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.maxLength) {
            isValid = value.length <= rules.maxLength && isValid
        }
        return isValid
    }
    inputChangedHandler = (event, inputIdentifier) => {
        const updatedOrderForm = { 
            ...this.state.orderForm
        }
        const updatedFormElement  = { 
            ...updatedOrderForm[inputIdentifier] 
        }
        updatedFormElement.value = event.target.value
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedFormElement.touched = true
        updatedOrderForm[inputIdentifier] = updatedFormElement
        let formIsValid = true;
        for(let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid
        }
        this.setState({orderForm:updatedOrderForm, formIsValid: formIsValid})
    }
    render() {
        const formElementsArray = []
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }
        let form = (
            <form onSubmit={this.orderHandler}>
                {formElementsArray.map(formElement => (
                    <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType} 
                        elementConfig={formElement.config.elementConfig} 
                        value={formElement.config.value} 
                        inValid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                        valueType={formElement.config.valueType}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                    />
                ))}
                <Button btnType="Success" disabled={!this.state.formIsValid} >ORDER</Button>
            </form>
        );
        if(this.props.loading) {
            form = <Spinner />
        }
        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                { form }
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading
    }
}
const mapDispatchToProps =  dispatch => {
    return {
        onOrderBurger: (orderData) => dispatch(actions.purchaseBurger(orderData))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)( withErrorHandler(contactData, axios) )
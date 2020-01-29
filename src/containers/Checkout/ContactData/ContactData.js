import React, { Component } from 'react'

import Button from './../../../components/UI/Button/Button'
import classes from './ContactData.css'
import axios from './../../../axios-order'
import Spinner from './../../../components/UI/Spinner/Spinner'

class contactData extends Component {
    state = {
        name: '',
        email: '',
        address: {
            street: '',
            postalCode: '',
        },
        loading: false
    }
    orderHandler = (event) => {
        event.preventDefault()
        axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
        // console.log(this.props.ingredients)
        this.setState({ loading: true })
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            customer: {
                name: 'Bhavik',
                address: {
                    street: 'Teststreet 1',
                    zipcode: '41351',
                    country: 'Germany'
                },
                email: 'test@test.com'
            },
            deliveryMethod: 'fastest'
        }
        console.log(order)
        axios.post('/orders.json', order)
            .then( response => {
                this.setState({ loading: false });
                this.props.history.push('/');
            } )
            .catch( error => { 
                this.setState({ loading: false });
                console.log(error) 
            })        
    }
    render() {
        let form = (
            <form>
                <input className={classes.Input} type="text" name="name" placeholder="Your Name" />
                <input className={classes.Input} type="email" name="email" placeholder="Your Email" />
                <input className={classes.Input} type="text" name="street" placeholder="Street" />
                <input className={classes.Input} type="text" name="postal" placeholder="Postal" />
                <Button clicked={this.orderHandler} btnType="Success">ORDER</Button>
            </form>            
        );
        if(this.state.loading) {
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
export default contactData
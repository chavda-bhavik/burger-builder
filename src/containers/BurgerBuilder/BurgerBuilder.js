import React, { Component } from 'react'

import BuildControls from './../../components/Burger/BuildControls/BuildControls'
import Burger from './../../components/Burger/Burger'
import Aux from '../../hoc/Aux/Aux'
import Modal from './../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from './../../axios-order'
import Spinner from './../../components/UI/Spinner/Spinner'
import WithErrorHandler from './../../hoc/WithErrorHandler/WithErrorHandler'

const INGREDIENT_PRICES = {
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}
class BurgerBuilder extends Component {cj
    state = {
        ingredients: null,
        totalPrice: 4,
        purchaseable: false,
        purchasing: false,
        loading: false
    }
    componentDidMount() {
        console.log(this.props)
        axios.get('ingredients.json')
            .then(response=> {
                this.setState({ ingredients: response.data })
            })
            .catch( error => {
                console.log(error)
            })
    }
    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
                    .map(igKey => {
                        return ingredients[igKey]
                    })
                    .reduce( (sum, el) => {
                        return sum + el;
                    }, 0);
        this.setState({ purchaseable: sum > 0 })
    }
    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type]
        const updatedIngredients = {
            ...this.state.ingredients
        };
        updatedIngredients[type] = oldCount + 1;
        const priceAddition = INGREDIENT_PRICES[type]
        const oldPrice = this.state.totalPrice
        const newPrice = oldPrice + priceAddition;
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients)
    }
    removeIngredientHandler = (type) => {

        const oldCount = this.state.ingredients[type]
        if(oldCount === 0) {
            return;
        }
        const updatedIngredients = {
            ...this.state.ingredients
        }
        updatedIngredients[type] = oldCount - 1;
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - INGREDIENT_PRICES[type]
        this.setState({
            totalPrice: newPrice,
            ingredients: updatedIngredients
        })
        this.updatePurchaseState(updatedIngredients)
    }
    purchaseHandler = () => {
        this.setState({purchasing: true})
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        const queryParams = [];
        for (let i in this.state.ingredients) {
            queryParams.push(encodeURIComponent(i)+'='+encodeURIComponent(this.state.ingredients[i]))
        }
        const queryString = queryParams.join('&')
        this.props.history.push({
            pathname: '/checkout',
            search: '?'+queryString
        })
        // this.setState({ loading: true })
        // const order = {
        //     ingredients: this.state.ingredients,
        //     price: this.state.totalPrice,
        //     customer: {
        //         name: 'Bhavik',
        //         address: {
        //             street: 'Teststreet 1',
        //             zipcode: '41351',
        //             country: 'Germany'
        //         },
        //         email: 'test@test.com'
        //     },
        //     deliveryMethod: 'fastest'
        // }
        // axios.post('/orders', order)
        //     .then( response => {
        //         this.setState({ loading: false, purchasing: false });
        //         console.log(response)
        //     } )
        //     .catch( error => { 
        //         this.setState({ loading: false, purchasing: false });
        //         console.log(error) 
        //     })
    }
    render() {
        const disabledInfo = {
            ...this.state.ingredients
        }
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let ordersummary = null;

        let burger = <Spinner />
        if(this.state.ingredients) {
            burger = [
                <Burger key="1" ingredients={this.state.ingredients} />,
                <BuildControls
                    key="2" 
                    purchase={this.purchaseHandler}
                    disabled={disabledInfo}
                    addIngredient={this.addIngredientHandler}
                    removeIngredient={this.removeIngredientHandler}
                    purchaseable={this.state.purchaseable}
                    price={this.state.totalPrice}
                />
            ]
            ordersummary = <OrderSummary 
                            totalPrice={this.state.totalPrice}
                            ingredients={this.state.ingredients} 
                            purchaseCancel={this.purchaseCancelHandler}
                            purchaseContinue={this.purchaseContinueHandler}
                        />            
        }
        if(this.state.loading) {
            ordersummary = <Spinner />
        }
        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed={this.purchaseCancelHandler}>
                    { ordersummary }
                </Modal>
                { burger }
            </Aux>
        )
    }
}
export default WithErrorHandler(BurgerBuilder, axios)
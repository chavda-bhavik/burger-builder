import React, { Component } from 'react'

import BuildControls from './../../components/Burger/BuildControls/BuildControls'
import Burger from './../../components/Burger/Burger'
import Aux from '../../hoc/Aux/Aux'
import Modal from './../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from './../../axios-order'
import Spinner from './../../components/UI/Spinner/Spinner'
import WithErrorHandler from './../../hoc/WithErrorHandler/WithErrorHandler'
import { connect } from "react-redux";
import * as actionTypes from './../../store/actions'

class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false
    }
    componentDidMount() {
        // axios.get('ingredients.json')
        //     .then(response=> {
        //         this.setState({ ingredients: response.data })
        //     })
        //     .catch( error => {
        //         console.log(error)
        //     })
    }
    updatePurchaseState(ingredients) {
        const sum = Object.keys(ingredients)
                    .map(igKey => {
                        return ingredients[igKey]
                    })
                    .reduce( (sum, el) => {
                        return sum + el;
                    }, 0);
        return sum > 0
    }
    purchaseHandler = () => {
        this.setState({purchasing: true})
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        this.props.history.push('/checkout')
    }
    render() {
        const disabledInfo = {
            ...this.props.ings
        }
        for(let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let ordersummary = null;

        let burger = <Spinner />
        if(this.props.ings) {
            burger = [
                <Burger key="1" ingredients={this.props.ings} />,
                <BuildControls
                    key="2" 
                    purchase={this.purchaseHandler}
                    disabled={disabledInfo}
                    addIngredient={this.props.onIngredientAdded}
                    removeIngredient={this.props.onIngredientRemoved}
                    purchaseable={this.updatePurchaseState(this.props.ings)}
                    price={this.props.price}
                />
            ]
            ordersummary = <OrderSummary 
                            totalPrice={this.props.price}
                            ingredients={this.props.ings} 
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

const mapStoreToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName}),
    }
}

export default connect(mapStoreToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios))
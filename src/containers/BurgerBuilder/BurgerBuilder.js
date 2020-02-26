import React, { Component } from 'react'

import BuildControls from './../../components/Burger/BuildControls/BuildControls'
import Burger from './../../components/Burger/Burger'
import Aux from '../../hoc/Aux/Aux'
import Modal from './../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from './../../components/UI/Spinner/Spinner'
import WithErrorHandler from './../../hoc/WithErrorHandler/WithErrorHandler'
import { connect } from "react-redux";
import axios from './../../axios-order'
import * as burgerBuilderActions from '../../store/actions/index'

export class BurgerBuilder extends Component {
    state = {
        purchasing: false,
        loading: false
    }
    componentDidMount() {
        this.props.onInitIngredients();
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
        if(this.props.isAuthenticated)
            this.setState({purchasing: true})
        else{
            this.props.onSetAuthRedirect('/checkout')
            this.props.history.push('/auth')
        }
    }
    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    }
    purchaseContinueHandler = () => {
        this.props.onInitPurchase();
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
        let burger = this.props.error ? <p>Ingredients cann't be loaded</p> : <Spinner />

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
                    isAuth={this.props.isAuthenticated}
                />
            ]
            ordersummary = <OrderSummary 
                            totalPrice={this.props.price}
                            ingredients={this.props.ings} 
                            purchaseCancel={this.purchaseCancelHandler}
                            purchaseContinue={this.purchaseContinueHandler}
                        />            
        }
        // if(this.state.loading) {
        //     ordersummary = <Spinner />
        // }
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
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIngredients: () => dispatch(burgerBuilderActions.initIngredient()),
        onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
        onSetAuthRedirect: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path))
    }
}

export default connect(mapStoreToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios))
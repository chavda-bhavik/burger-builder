import React, { useState, useEffect } from 'react'

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

const burgerBuilder = (props) => {
    const [purchasing, setPurchasing] = useState(false);
    const { onInitIngredients } = props;
    useEffect(() => {
        onInitIngredients();
    }, [onInitIngredients])
    const updatePurchaseState = (ingredients) => {
        const sum = Object.keys(ingredients)
                    .map(igKey => {
                        return ingredients[igKey]
                    })
                    .reduce( (sum, el) => {
                        return sum + el;
                    }, 0);
        return sum > 0
    }
    const purchaseHandler = () => {
        if(props.isAuthenticated)
            setPurchasing(true);
        else{
            props.onSetAuthRedirect('/checkout')
            props.history.push('/auth')
        }
    }
    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }
    const purchaseContinueHandler = () => {
        props.onInitPurchase();
        props.history.push('/checkout')
    }

    const disabledInfo = {
        ...props.ings
    }
    for(let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let ordersummary = null;
    let burger = props.error ? <p>Ingredients cann't be loaded</p> : <Spinner />

    if(props.ings) {
        burger = [
            <Burger key="1" ingredients={props.ings} />,
            <BuildControls
                key="2" 
                purchase={purchaseHandler}
                disabled={disabledInfo}
                addIngredient={props.onIngredientAdded}
                removeIngredient={props.onIngredientRemoved}
                purchaseable={updatePurchaseState(props.ings)}
                price={props.price}
                isAuth={props.isAuthenticated}
            />
        ]
        ordersummary = <OrderSummary 
                        totalPrice={props.price}
                        ingredients={props.ings} 
                        purchaseCancel={purchaseCancelHandler}
                        purchaseContinue={purchaseContinueHandler}
                    />            
    }

    return (
        <Aux>
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                { ordersummary }
            </Modal>
            { burger }
        </Aux>
    )
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

export default connect(mapStoreToProps, mapDispatchToProps)(WithErrorHandler(burgerBuilder, axios))
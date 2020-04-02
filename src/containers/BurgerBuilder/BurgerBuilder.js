import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from "react-redux";

import BuildControls from './../../components/Burger/BuildControls/BuildControls'
import Burger from './../../components/Burger/Burger'
import Aux from '../../hoc/Aux/Aux'
import Modal from './../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import Spinner from './../../components/UI/Spinner/Spinner'
import WithErrorHandler from './../../hoc/WithErrorHandler/WithErrorHandler'
import axios from './../../axios-order'
import * as burgerBuilderActions from '../../store/actions/index'

const burgerBuilder = (props) => {
    const [purchasing, setPurchasing] = useState(false);
    
    const dispatch = useDispatch();
    const onIngredientAdded = (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName));
    const onIngredientRemoved = (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName));
    const onInitIngredients = useCallback(() => dispatch(burgerBuilderActions.initIngredient()), []);
    const onInitPurchase = () => dispatch(burgerBuilderActions.purchaseInit());
    const onSetAuthRedirect = (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path));

    const ings = useSelector(state => state.burgerBuilder.ingredients);
    const price = useSelector(state => state.burgerBuilder.totalPrice);
    const error = useSelector(state => state.burgerBuilder.error);
    const isAuthenticated = useSelector(state => state.auth.token !== null);
    
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
        if(isAuthenticated)
            setPurchasing(true);
        else{
            onSetAuthRedirect('/checkout')
            props.history.push('/auth')
        }
    }
    const purchaseCancelHandler = () => {
        setPurchasing(false);
    }
    const purchaseContinueHandler = () => {
        onInitPurchase();
        props.history.push('/checkout')
    }

    const disabledInfo = {
        ...ings
    }
    for(let key in disabledInfo) {
        disabledInfo[key] = disabledInfo[key] <= 0
    }

    let ordersummary = null;
    let burger = error ? <p>Ingredients cann't be loaded</p> : <Spinner />

    if(ings) {
        burger = [
            <Burger key="1" ingredients={ings} />,
            <BuildControls
                key="2" 
                purchase={purchaseHandler}
                disabled={disabledInfo}
                addIngredient={onIngredientAdded}
                removeIngredient={onIngredientRemoved}
                purchaseable={updatePurchaseState(ings)}
                price={price}
                isAuth={isAuthenticated}
            />
        ]
        ordersummary = <OrderSummary 
                        totalPrice={price}
                        ingredients={ings} 
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

export default WithErrorHandler(burgerBuilder, axios);
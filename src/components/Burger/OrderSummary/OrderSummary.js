import React from 'react'
import Aux from '../../../hoc/Aux/Aux'
import Button from '../../UI/Button/Button'

const orderSummary = props => {
    const ingredientSummary = Object.keys(props.ingredients)
    .map( igKey => {
        return (
            <li key={igKey}>
                <span style={{textTransform:'capitalize'}}>{igKey}:</span> 
                {this.props.ingredients[igKey]}
            </li>
        )
    })
    return (
        <Aux>
            <h3>Your Order</h3>
            <p>A Delicious burger with the following ingredients:</p>
            <ul>
                {ingredientSummary}
            </ul>
            <p><strong>Total Price:{props.totalPrice.toFixed(2)}</strong></p>
            <p>Continue to checkout</p>
            <Button btnType="Danger" clicked={props.purchaseCancel} >CANCEL</Button>
            <Button btnType="Success" clicked={props.purchaseContinue} >CONTINUE</Button>
        </Aux>
    )
}

export default orderSummary
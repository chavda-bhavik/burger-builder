import React, { Component } from 'react'

import Burger from './../../components/Burger/Burger'
import Aux from '../../hoc/Aux'

class BurgerBuilder extends Component {
    state = {
        ingredients: {
            salad: 1,
            bacon: 1,
            cheese: 1,
            meat: 1
        }
    }
    render() {
        return (
            <Aux>
                <Burger ingredients={this.state.ingredients} />
                <div>Build Controls</div>
            </Aux>
        )
    }
}
export default BurgerBuilder
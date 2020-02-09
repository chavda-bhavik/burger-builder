import React from 'react'

import { withRouter } from "react-router-dom";
import classes from './Burger.css'
import BurgerIngredients from './BurgerIngredients/BurgerIngredients'

const Burger = (props) => {
    let transformedIngredients = 
        Object.keys(props.ingredients)
            .map(igKey => {
                return [...Array(props.ingredients[igKey])]
                        .map((_,i) => {
                            return <BurgerIngredients key={igKey+i} type={igKey} /> 
                        });
            })
        .reduce( (prev,curr) => {
            return prev.concat(curr)
        },[]);
    if(transformedIngredients.length === 0) {
        transformedIngredients = <p>Please start Adding Ingredients</p>
    }
    return (
        <div className={classes.Burger}>
            <BurgerIngredients type="bread-top" />
            {transformedIngredients}
            <BurgerIngredients type="bread-bottom" />
        </div>
    )
}

export default withRouter(Burger)
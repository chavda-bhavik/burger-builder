import React, { Component } from 'react'

import { connect } from "react-redux";
import axios from './../../axios-order'
import Order from './../../components/Order/Order'
import withErrorHandler from './../../hoc/WithErrorHandler/WithErrorHandler'
import * as actions from './../../store/actions/index'
import Spinner from './../../components/UI/Spinner/Spinner'

class orders extends Component {
    state = {
        orders: [],
        loading: true
    }
    componentDidMount() {
        console.log(this.props.userId, this.props.token)
        this.props.onFetchOrders(this.props.token, this.props.userId);
    }
    render() {
        let orders = <Spinner />
        if(!this.props.loading) {
            orders = this.props.orders.map(
                order => 
                    <Order 
                        key={order.id} 
                        ingredients={order.ingredients} 
                        price={order.price} 
                    />
            )
        }
        return <div> { orders } </div>
    }
}
const mapStateToProps = state => {
    return {
        orders: state.order.orders,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}
export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(orders, axios))
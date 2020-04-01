import React, { useState } from 'react'
import { connect } from "react-redux";

import Aux from '../../hoc/Aux/Aux'
import classes from './Layout.css'
import Toolbar from './../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from './../../components/Navigation/SideDrawer/SideDrawer'

const layout = (props) => {
    const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

    const SideDrawerCloseHandler = () => {
        setSideDrawerOpen(false)
    }
    const SideDrawerToggledHandler = () => {
        setSideDrawerOpen(!sideDrawerOpen)
    }

    return (
        <Aux>
            <Toolbar 
                isAuth={props.isAuthenticated}
                toggle={SideDrawerToggledHandler}
            />
            <SideDrawer 
                isAuth={props.isAuthenticated}
                open={sideDrawerOpen} 
                closed={SideDrawerCloseHandler} 
            />
            <main className={classes.content}>
                {props.children}
            </main>
        </Aux>
    )
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}
export default connect(mapStateToProps,null)(layout)
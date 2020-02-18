import React from 'react'
import { connect } from "react-redux";

import Aux from '../../hoc/Aux/Aux'
import classes from './Layout.css'
import Toolbar from './../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from './../../components/Navigation/SideDrawer/SideDrawer'

class layout extends React.Component {
    state = {
        showSideDrawer: false
    }
    SideDrawerToggledHandler = () => {
        this.setState((state,props) => { 
            return { showSideDrawer: !state.showSideDrawer } 
        })
    }

    render() {
        return (
            <Aux>
                <Toolbar 
                    isAuth={this.props.isAuthenticated}
                    toggle={this.SideDrawerToggledHandler}
                />
                <SideDrawer 
                    isAuth={this.props.isAuthenticated}
                    open={this.state.showSideDrawer} 
                    closed={this.SideDrawerToggledHandler} 
                />
                <main className={classes.content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}
const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null
    }
}
export default connect(mapStateToProps,null)(layout)
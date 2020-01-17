import React from 'react'

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
                <Toolbar toggle={this.SideDrawerToggledHandler}/>
                <SideDrawer open={this.state.showSideDrawer} closed={this.SideDrawerToggledHandler} />
                <main className={classes.content}>
                    {this.props.children}
                </main>
            </Aux>
        )
    }
}
export default layout
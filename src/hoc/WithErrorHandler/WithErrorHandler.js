import React from 'react'

import Modal from './../../components/UI/Modal/Modal'
import Aux from './../Aux/Aux'
import useHttpErrorHandler from '../../hooks/http-error-handler'

const witherrorhandler = (WrappedComponent, axios) => {
    return props => {
        const [error, clearError] = useHttpErrorHandler();
        return (
            <Aux >
                <Modal 
                    show={error}
                    modalClosed={clearError}
                >
                    {error ? error.message : null} 
                </Modal>
                <WrappedComponent {...props}/>
            </Aux>
        )
    }

}

export default witherrorhandler
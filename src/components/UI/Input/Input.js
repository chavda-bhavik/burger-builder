import React from 'react'
import classes from './input.css'

const input = (props) => {
    let inputElement = null;
    const inputClasses = [classes.InputElement]
    let errorMessage = ""
    if(props.inValid && props.shouldValidate && props.touched ) {
        inputClasses.push(classes.Invalid)
        errorMessage = <p className={classes.ValidationError}>Please enter valid {props.valueType}</p>
    }

    switch (props.elementType) {
        case 'input':
            inputElement = 
                <input 
                    className={inputClasses.join(' ')} 
                    {...props.elementConfig} 
                    value={props.value} 
                    onChange={props.changed}
                />
            break;
        case 'textarea':
            inputElement = 
                <textarea 
                    className={inputClasses.join(' ')} 
                    {...props.elementConfig} 
                    value={props.value} 
                    onChange={props.changed}
                />
            break;
        case 'select':
            inputElement = 
                <select 
                    className={inputClasses.join(' ')} 
                    value={props.value} 
                    onChange={props.changed}
                >
                    {props.elementConfig.options.map(option => (
                        <option key={option.value} value={option.value}>{option.displayValue}</option>
                    ))}
                </select>
            break;
        default:
            inputElement = 
                <input 
                    className={inputClasses.join(' ')} 
                    {...props.elementConfig} 
                    value={props.value} 
                    onChange={props.changed}
                />
            break;
    }
    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            {inputElement}
            {errorMessage}
        </div>
    )
}

export default input
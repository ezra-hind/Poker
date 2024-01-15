import React from "react";
import './button.css'

const Button = ({label, click}) => {
    return (
        <div className="button" onClick={click}>{label}</div>
    )
}

export default Button;
import React from 'react';
import PropTypes from "prop-types";
import "./index.css";

const OrderButton = ({ message, setQuestionOrder }) => {
    return (
        <button
            className="btn"
            onClick={() => {
                setQuestionOrder(message);
            }}
        >
            {message}
        </button>
    );
};

OrderButton.propTypes = {
    message: PropTypes.string.isRequired,
    setQuestionOrder: PropTypes.func.isRequired,
};

export default OrderButton;

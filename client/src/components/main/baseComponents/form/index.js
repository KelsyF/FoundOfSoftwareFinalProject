import React from 'react'; // Import React
import PropTypes from 'prop-types'; // Import PropTypes
import "./index.css";

const Form = ({ children }) => {
    return <div className="form">{children}</div>;
};

// Add PropTypes validation
Form.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Form;

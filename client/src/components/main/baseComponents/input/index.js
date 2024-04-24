import React from 'react';
import PropTypes from 'prop-types';
import "./index.css";

const Input = ({ title, hint, id, mandatory = true, val, setState, err }) => {
    return (
        <>
            <div className="input_title">
                {title}
                {mandatory ? "*" : ""}
            </div>
            {hint && <div className="input_hint">{hint}</div>}
            <input
                id={id}
                className="input_input"
                type="text"
                value={val}
                onInput={(e) => {
                    setState(e.target.value);
                }}
            />
            {err && <div className="input_error">{err}</div>}
        </>
    );
};

Input.propTypes = {
    title: PropTypes.string.isRequired,
    hint: PropTypes.string,
    id: PropTypes.string.isRequired,
    mandatory: PropTypes.bool,
    val: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    err: PropTypes.string,
};

export default Input;

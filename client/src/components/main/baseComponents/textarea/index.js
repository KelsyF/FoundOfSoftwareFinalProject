import React from 'react';
import PropTypes from 'prop-types';
import "../input/index.css";

const Textarea = ({
    title,
    mandatory = true,
    hint,
    id,
    val,
    setState,
    err,
}) => {
    return (
        <>
            <div className="input_title">
                {title}
                {mandatory ? "*" : ""}
            </div>
            {hint && <div className="input_hint">{hint}</div>}
            <textarea
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

Textarea.propTypes = {
    title: PropTypes.string.isRequired,
    mandatory: PropTypes.bool,
    hint: PropTypes.string,
    id: PropTypes.string.isRequired,
    val: PropTypes.string.isRequired,
    setState: PropTypes.func.isRequired,
    err: PropTypes.string,
};

export default Textarea;

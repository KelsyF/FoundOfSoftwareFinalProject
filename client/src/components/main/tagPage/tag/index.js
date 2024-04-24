import React from 'react';
import PropTypes from "prop-types";
import "./index.css";
import { useUser } from "../../../context/UserContext"
import { deleteTag } from '../../../../services/tagService'


// In Tag.js

const Tag = ({ t, clickTag, onDelete }) => {
    const { user } = useUser();

    const handleDelete = async (e) => {
        e.stopPropagation();  // Prevent click event from bubbling up to the parent
        try {
            await deleteTag(t.name);
            console.log("Tag deleted:", t.name);  // Logging for confirmation
            onDelete();  // Call the passed function to refresh the tag list
        } catch (error) {
            console.error("Failed to delete tag:", error);
        }
    };

    return (
        <div className="tagNode" onClick={() => clickTag(t.name)}>
            <div className="tagName">{t.name}</div>
            <div className="tagQcnt">{t.qcnt} questions</div>
            {user && user.username === "moderator" && (
                <button className="moderator_action_button" onClick={handleDelete}>
                    Delete
                </button>
            )}
        </div>
    );
};

Tag.propTypes = {
    t: PropTypes.shape({
        name: PropTypes.string.isRequired,
        qcnt: PropTypes.number.isRequired,
    }).isRequired,
    clickTag: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default Tag;



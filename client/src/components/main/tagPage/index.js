import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "./index.css";
import Tag from "./tag";
import { getTagsWithQuestionNumber } from "../../../services/tagService";

// In TagPage.js

const TagPage = ({ clickTag, handleNewQuestion }) => {
    const [tlist, setTlist] = useState([]);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const res = await getTagsWithQuestionNumber();
            setTlist(res || []);
        } catch (e) {
            console.log("Failed to fetch tags:", e);
        }
    };

    const handleDeleteTag = () => {
        fetchTags();  // Refresh the list of tags
    };

    return (
        <>
            <div className="space_between right_padding">
                <div className="bold_title">{tlist.length} Tags</div>
                <button className="bluebtn" onClick={handleNewQuestion}>Ask a Question</button>
            </div>
            <div className="tag_list right_padding">
                {tlist.map((t, idx) => (
                    <Tag key={idx} t={t} clickTag={clickTag} onDelete={handleDeleteTag} />
                ))}
            </div>
        </>
    );
};

TagPage.propTypes = {
    clickTag: PropTypes.func.isRequired,
    handleNewQuestion: PropTypes.func.isRequired,
};

export default TagPage;

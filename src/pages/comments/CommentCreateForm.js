import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";

function CommentCreateForm(props) {
    const { hack, setHack, setComments, profileImage, profile_id } = props;
    const [content, setContent] = useState("");

    const handleChange = (event) => {
        setContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axiosRes.post("/comments/", {
                content,
                hack,
            });
            setComments((prevComments) => ({
                ...prevComments,
                results: [data, ...prevComments.results],
            }));
            setHack((prevHack) => ({
                results: [
                    {
                        ...prevHack.results[0],
                        comments_count: prevHack.results[0].comments_count + 1,
                    },
                ],
            }));
            setContent("");
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Avatar src={profileImage} />
                    <Form.Control
                        className="p-0"
                        placeholder=" What do you think?"
                        as="textarea"
                        value={content}
                        onChange={handleChange}
                        rows={2}
                    />
                </InputGroup>
            </Form.Group>
            <button
                className={`btn ${!content ? "btn-secondary" : "btn-primary"} d-block ml-auto my-2`}
                disabled={!content.trim()}
                type="submit"
            >
                Add Comment
            </button>
        </Form>
    );
}

export default CommentCreateForm;
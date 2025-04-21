import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { Alert } from "react-bootstrap";

function CommentCreateForm(props) {
    const { hack, setHack, setComments, profileImage } = props;
    const [content, setContent] = useState("");
    const [errors, setErrors] = useState({});

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
        } catch (error) {
            if (error.response?.status !== 401) {
                setErrors(error.response?.data);
            }
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    <Avatar src={profileImage} />
                    <Form.Control
                        className="p-0 mx-2"
                        placeholder=" What do you think?"
                        as="textarea"
                        value={content}
                        onChange={handleChange}
                        rows={2}
                    />
                </InputGroup>
            </Form.Group>
            {errors?.content?.map((err, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
            ))}
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
import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import Avatar from "../../components/Avatar";
import { axiosRes } from "../../api/axiosDefaults";
import { Alert } from "react-bootstrap";

function CommentCreateForm(props) {
    const { hack, setHack, setComments, profileImage } = props;
    const [content, setContent] = useState("");     // Stores comment input
    const [errors, setErrors] = useState({});       // Stores validation/server errors

    const handleChange = (event) => {
        setContent(event.target.value);             // Update content state on input change
    };

    const handleSubmit = async (event) => {
        event.preventDefault();                     // Prevent page reload on submit
        try {
            // Send POST request to create a new comment
            const { data } = await axiosRes.post("/comments/", {
                content,
                hack,
            });

            // Prepend new comment to comment list
            setComments((prevComments) => ({
                ...prevComments,
                results: [data, ...prevComments.results],
            }));

            // Increment comments count in associated post/hack
            setHack((prevHack) => ({
                results: [
                    {
                        ...prevHack.results[0],
                        comments_count: prevHack.results[0].comments_count + 1,
                    },
                ],
            }));

            setContent(""); // Clear input field
        } catch (error) {
            // Only set errors if it's not an unauthorized error
            if (error.response?.status !== 401) {
                setErrors(error.response?.data);
            }
        }
    };

    return (
        <Form className="mt-2" onSubmit={handleSubmit}>
            <Form.Group>
                <InputGroup>
                    {/* User avatar next to input field */}
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

            {/* Display validation errors for comment content */}
            {errors?.content?.map((err, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">{err}</Alert>
            ))}

            {/* Submit button, disabled if content is empty */}
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

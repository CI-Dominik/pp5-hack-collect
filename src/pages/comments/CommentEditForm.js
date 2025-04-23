import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { axiosRes } from "../../api/axiosDefaults";

const CommentEditForm = ({ id, content, setComments, setIsEditing }) => {
    const [formContent, setFormContent] = useState(content); // Local state for edited content
    const [errors, setErrors] = useState([]);                // Stores validation or server errors

    const handleChange = (event) => {
        setFormContent(event.target.value); // Update content state on input
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent page reload
        try {
            // Send PUT request to update comment
            const { data } = await axiosRes.put(`/comments/${id}/`, {
                content: formContent,
            });

            // Update the edited comment in the comment list
            setComments(prevComments => ({
                ...prevComments,
                results: prevComments.results.map(comment =>
                    comment.id === id ? { ...comment, content: data.content, updated_at: data.updated_at } : comment
                ),
            }));

            // Exit edit mode
            setIsEditing(false);
        } catch (err) {
            // Handle and show validation or fallback error
            if (err.response?.data?.content) {
                setErrors(err.response.data.content);
            } else {
                setErrors(["An unexpected error occurred."]);
            }
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    {/* Textarea for editing the comment */}
                    <Form.Control
                        as="textarea"
                        value={formContent}
                        onChange={handleChange}
                        rows={3}
                    />
                </Form.Group>

                {/* Action buttons: Cancel and Save */}
                <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="mr-2 mt-1">
                        Cancel
                    </Button>
                    <Button className="mt-1" variant="primary" type="submit">
                        Save
                    </Button>
                </div>

                {/* Display error messages if any */}
                {errors.length > 0 && (
                    <Alert variant="danger" className="mt-2">
                        {errors.map((err, idx) => (
                            <div key={idx}>{err}</div>
                        ))}
                    </Alert>
                )}
            </Form>
        </>
    );
};

export default CommentEditForm;

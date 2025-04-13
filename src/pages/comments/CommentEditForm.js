import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { axiosRes } from "../../api/axiosDefaults";

const CommentEditForm = ({ id, content, setComments, setIsEditing }) => {
    const [formContent, setFormContent] = useState(content);
    const [errors, setErrors] = useState([]);

    const handleChange = (event) => {
        setFormContent(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axiosRes.put(`/comments/${id}/`, {
                content: formContent,
            });

            setComments(prevComments => ({
                ...prevComments,
                results: prevComments.results.map(comment =>
                    comment.id === id ? { ...comment, content: data.content, updated_at: data.updated_at } : comment
                ),
            }));

            setIsEditing(false);
        } catch (err) {
            if (err.response?.data?.content) {
                setErrors(err.response.data.content);
            } else {
                setErrors(["Ein unerwarteter Fehler ist aufgetreten."]);
            }
        }
    };

    return (
        <>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                        as="textarea"
                        value={formContent}
                        onChange={handleChange}
                        rows={3}
                    />
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="mr-2 mt-1">
                        Cancel
                    </Button>
                    <Button className="mt-1" variant="primary" type="submit">
                        Save
                    </Button>
                </div>

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

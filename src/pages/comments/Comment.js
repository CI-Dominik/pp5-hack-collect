import React, { useState } from "react";
import { Media, Modal, Button } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import { ActionDropdown } from "../../components/ActionDropdown";
import CommentEditForm from "./CommentEditForm";

const Comment = (props) => {
    const {
        profile_image,
        owner,
        updated_at,
        content,
        id,
        setHack,
        setComments
    } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/comments/${id}`);
            setHack(prevHack => ({
                results: [{
                    ...prevHack.results[0],
                    comments_count: prevHack.results[0].comments_count - 1
                }]
            }));

            setComments(prevComments => ({
                ...prevComments,
                results: prevComments.results.filter(comment => comment.id !== id)
            }));
        } catch (error) {
            console.log(error);
        } finally {
            setShowConfirm(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <>
            <Media className="d-flex w-100 my-2 text-white">
                <Avatar src={profile_image} />
                <Media.Body className="align-self-center ml-2 w-100">
                    <div className="d-flex justify-content-between align-items-start">
                        <span>{owner} - {updated_at}</span>
                        {is_owner && (
                            <div>
                                <ActionDropdown
                                    handleEdit={handleEdit}
                                    handleDelete={() => setShowConfirm(true)}
                                />
                            </div>
                        )}
                    </div>
                    {isEditing ? (
                        <CommentEditForm
                            id={id}
                            content={content}
                            setComments={setComments}
                            setIsEditing={setIsEditing}
                        />
                    ) : (
                        <p>{content}</p>
                    )}
                </Media.Body>
            </Media>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this comment?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Comment;

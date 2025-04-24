import React, { useState } from "react";
import { Media } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";
import { ActionDropdown } from "../../components/ActionDropdown";
import CommentEditForm from "./CommentEditForm";
import { Link } from "react-router-dom";
import styles from '../../styles/Comment.module.css';

const Comment = (props) => {
    const {
        profile_id,
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

    const [isEditing, setIsEditing] = useState(false);

    // Handle comment deletion
    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/comments/${id}`);

            // Decrement comment count in the related post/hack
            setHack(prevHack => ({
                results: [{
                    ...prevHack.results[0],
                    comments_count: prevHack.results[0].comments_count - 1
                }]
            }));

            // Remove comment from local state
            setComments(prevComments => ({
                ...prevComments,
                results: prevComments.results.filter(comment => comment.id !== id)
            }));
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <Media className="d-flex w-100 my-2 text-white gap-2">
            {/* User avatar and profile link */}
            <Link to={`/profiles/${profile_id}`} className="text-decoration-none text-black mr-3">
                <Avatar className="mr-3" src={profile_image} />
            </Link>
            <Media.Body className="align-self-center ml-2 w-100">
                <div className="d-flex justify-content-between align-items-start">
                    {/* Comment owner and timestamp */}
                    <span className="fw-bold">
                        <Link to={`/profiles/${profile_id}`} className="text-decoration-none text-white"><span className={`${styles.CommentOwner}`}>{owner}</span></Link> - {updated_at}
                    </span>
                    {/* Dropdown for edit/delete actions if current user is the owner */}
                    {is_owner && (
                        <ActionDropdown
                            handleEdit={handleEdit}
                            handleDelete={handleDelete}
                        />
                    )}
                </div>
                {/* Show edit form or comment content */}
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
    );
};

export default Comment;

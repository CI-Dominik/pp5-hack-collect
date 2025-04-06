import React from "react";
import { Media } from "react-bootstrap";
import Avatar from "../../components/Avatar";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { axiosRes } from "../../api/axiosDefaults";

const Comment = (props) => {
    const { profile_id, profile_image, owner, updated_at, content, id, setHack, setComments } = props;

    const currentUser = useCurrentUser();
    const is_owner = currentUser?.username === owner;

    const handleDelete = async () => {
        try {
            await axiosRes.delete(`/comments/${id}`)
            setHack(prevHack => ({
                results: [{
                    ...prevHack.results[0],
                    comments_count: prevHack.results[0].comments_count - 1
                }]
            }))

            setComments(prevComments => ({
                ...prevComments,
                results: prevComments.results.filter(comment => comment.id !== id)
            }))

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <Media className="d-flex w-100 my-2 text-white">
                <Avatar src={profile_image} />
                <Media.Body className="align-self-center ml-2">
                    <span>{owner} - {updated_at}</span>
                    <p>{content}</p>
                </Media.Body>
            </Media>
        </>
    );
};

export default Comment;
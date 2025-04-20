import React from "react";
import styles from "../../styles/Hack.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { ActionDropdown } from "../../components/ActionDropdown";
import Avatar from '../../components/Avatar'
import RatingComponent from "../../components/RatingComponent";
import { Rating } from 'react-simple-star-rating'

const Hack = (props) => {
  const {
    id,
    owner,
    title,
    content,
    image,
    updated_at,
    created_at,
    category,
    average_rating,
    profile_id,
    profile_image,
    hackPage,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();

  const handleEdit = () => {
    history.push(`/hacks/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await axiosRes.delete(`/hacks/${id}`);
      history.goBack();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Card className={styles.Hack}>
      <Card.Header>
        <div className="d-flex align-items-center justify-content-between">
          <Avatar src={profile_image} text={owner} />
          {is_owner && (
            <div className="ms-auto text-right">
              <ActionDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>
          )}
        </div>
        <Media>
          {hackPage ? (
            <img src={image} alt={title} className={styles.HackImage} />
          ) : (
            <Link to={`/hacks/${id}`}>
              <img src={image} alt={title} className={styles.HackImage} />
            </Link>
          )}
          {hackPage ? (
            <Card.Title className="text-center fw-bold"><h1>{title}</h1></Card.Title>
          ) : (
            <Link to={`/hacks/${id}`}>
              <Card.Title className="text-center fw-bold text-decoration-none link-dark"><h1>{title}</h1></Card.Title>
            </Link>
          )}
          {!hackPage && <h3>Preview</h3>}
          <Card.Text>
            {hackPage ? (
              content
            ) : (
              content.length > 50 ? (
                content.slice(0, 50) + "..."
              ) : (
                content
              )
            )}</Card.Text>
        </Media>
      </Card.Header>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div className="d-flex flex-column">
            <p>Average rating:</p>
            <Rating
              initialValue={average_rating}
              readonly
              allowHover={false}
            />
            {!average_rating > 0 && <p>Not rated yet.</p>}
          </div>
          {hackPage && currentUser && !is_owner && (
            <RatingComponent hackId={id} setHack={props.setHack} />
          )}
        </div>
        <div className="d-flex flex-column">
          <div className="d-flex justify-content-between mt-1">
            <p>
              (Created: {created_at} by <span className="fw-bold">{owner}</span>)
            </p>
            <p>
              Last updated: {updated_at}
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Hack;
import React from "react";
import styles from "../../styles/Hack.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import ActionDropdown from "../../components/ActionDropdown";
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
        {hackPage && <div className="d-flex align-items-center justify-content-between">
          <Avatar src={profile_image} text={owner} />
          {is_owner && (
            <div className="ms-auto text-right">
              <ActionDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>
          )}
        </div>}
        <Media className="align-items-center">
          {hackPage ? (
            <img src={image} alt={title} className={styles.HackImage} />
          ) : (
            <Link to={`/hacks/${id}`}>
              <img src={image} alt={title} className={styles.HackImage} />
            </Link>
          )}

          <div>
            <p>
              (Created: {created_at} by {owner})
            </p>
            <p>
              Last updated: {updated_at}
            </p>
            <p>Average rating:</p>
            <Rating
              initialValue={average_rating}
              readOnly
              allowHover={false}
            />
            {hackPage && currentUser && <RatingComponent hackId={id} />}
            

          </div>
        </Media>
      </Card.Header>
      <Card.Body>
        {hackPage ? (
          <Card.Title className="text-center">{title}</Card.Title>
        ) : (
          <Link to={`/hacks/${id}`}>
            <Card.Title className="text-center">{title}</Card.Title>
          </Link>
        )}

        <Card.Subtitle className="text-muted">{category}</Card.Subtitle>
        <Card.Text>{content}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Hack;
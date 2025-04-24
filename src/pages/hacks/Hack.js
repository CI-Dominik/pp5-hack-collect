import React, { useEffect, useState } from "react";
import styles from "../../styles/Hack.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import { ActionDropdown } from "../../components/ActionDropdown";
import Avatar from '../../components/Avatar'
import RatingComponent from "../../components/RatingComponent";
import { Rating } from 'react-simple-star-rating';

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
    comments_count,
  } = props;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;
  const history = useHistory();
  const [categoryValue, setCategoryValue] = useState(null);

  useEffect(() => {
    // Fetch category details if category ID is present
    const handleMount = async () => {
      try {
        if (category) {
          const cat = await axiosRes.get(`/categories/${category}`);
          setCategoryValue(cat);
        }
      } catch (error) {
        console.log(error);
      }
    };

    handleMount();
  }, [id, category]);

  // Navigate to the edit page
  const handleEdit = () => {
    history.push(`/hacks/${id}/edit`);
  };

  // Delete the hack and return to previous page
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
      <Card.Header className={styles.CardHeader}>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="d-flex flex-row justify-content-center align-items-center gap-3">
            {/* Link to profile with avatar */}
            <Link to={`/profiles/${profile_id}`} className="text-decoration-none text-white">
              <Avatar className="mr-3" src={profile_image} text={owner} />
            </Link>
            <div className="ml-3 text-white d-none d-md-block">Created: {created_at}</div>
            <div className="ml-3 text-white"><i className="fa-solid fa-comment"></i> {comments_count}</div>
          </div>
          {/* Show action dropdown only for the owner */}
          {is_owner && (
            <div className="text-right">
              <ActionDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
            </div>
          )}
        </div>

        <Media>
          {/* Show image with or without link depending on context */}
          {hackPage ? (
            <img src={image} alt={title} className={styles.HackImage} />
          ) : (
            <Link to={`/hacks/${id}`}>
              <img src={image} alt={title} className={styles.HackImage} />
            </Link>
          )}
          {/* Show title with or without link depending on context */}
          {hackPage ? (
            <Card.Title className="text-center fw-bold"><h2 className={`${styles.HackTitle}`}>{title}</h2></Card.Title>
          ) : (
            <Link className="text-decoration-none my-4" to={`/hacks/${id}`}>
              <Card.Title className="text-center fw-bold text-decoration-none link-light"><h2 className={`${styles.HackTitle}`}>{title}</h2></Card.Title>
            </Link>
          )}
          {!hackPage && <h3 className="text-white">Preview</h3>}
          {/* Show either full or truncated content */}
          <Card.Text className="text-white mb-2">
            {hackPage ? (
              content
            ) : (
              content.length > 50 ? content.slice(0, 50) + "..." : content
            )}
          </Card.Text>
        </Media>
      </Card.Header>

      <Card.Body className={styles.CardBody}>
        {/* Show category name if loaded */}
        <p className="text-white">Category: {categoryValue?.data?.name || "None"}</p>

        <div className="d-flex flex-column flex-xl-row justify-content-between">
          <div className="d-flex flex-column align-items-left">
            <p className="text-white">Average rating:</p>
            <Rating
              initialValue={average_rating}
              readonly
              allowHover={false}
            />
            {!average_rating > 0 && <p className="text-white">Not rated yet.</p>}
          </div>

          {/* Show rating component only on detail page for non-owners */}
          {hackPage && currentUser && !is_owner && (
            <div>
              <RatingComponent hackId={id} setHack={props.setHack} />
            </div>
          )}
        </div>

        <div className="d-flex flex-column">
          <div className="d-flex justify-content-end mt-1">
            <p className="text-white">
              Last updated: {updated_at}
            </p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Hack;

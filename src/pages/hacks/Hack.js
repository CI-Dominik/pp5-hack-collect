import React from "react";
import styles from "../../styles/Hack.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Card, Media } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { axiosRes } from "../../api/axiosDefaults";
import ActionDropdown from "../../components/ActionDropdown";

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
        <Media className="align-items-center">
          <img src={image} alt={title} className={styles.HackImage} />
          <div className="d-flex align-items-center">
            <span>
              {updated_at} ({created_at})
            </span>
            {is_owner && (
              <div className="ml-auto">
                <ActionDropdown handleEdit={handleEdit} handleDelete={handleDelete} />
              </div>
            )}
          </div>
        </Media>
      </Card.Header>
      <Card.Body>
        <Card.Title className="text-center">{title}</Card.Title>
        <Card.Subtitle className="text-muted">{category}</Card.Subtitle>
        <Card.Text>{content}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default Hack;
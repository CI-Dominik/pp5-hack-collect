import React from "react";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import { Button } from "react-bootstrap";
import { useSetProfileData } from "../../contexts/ProfileDataContext";
import styles from '../../styles/Profile.module.css';

const Profile = (props) => {
  const { profile, mobile, imageSize = 55 } = props;
  const { id, following_id, image, owner } = profile;

  const currentUser = useCurrentUser();
  const is_owner = currentUser?.username === owner;

  const { handleFollow, handleUnfollow } = useSetProfileData();

  // Display profiles based on mobile or desktop layout
  return (
    <div
      className={`my-2 d-flex align-items-center ${mobile ? "flex-row mx-2" : "flex-row justify-content-between"}`}
    >
      <div className="d-flex align-items-center justify-content-between">
        <Link
          className={`align-self-center text-decoration-none ${styles.ProfileLink}`}
          to={`/profiles/${id}`}
        >
          <Avatar src={image} height={imageSize} />
        </Link>

        {!mobile && (
          <div className="ms-3">
            <Link className={`text-decoration-none text-white ${styles.ProfileLink}`} to={`/profiles/${id}`}>
              <strong>{owner}</strong>
            </Link>
          </div>
        )}
      </div>

      {!mobile && (
        <div className="d-flex justify-content-between ms-auto">
          {currentUser && !is_owner && (
            <div>
              {following_id ? (
                <Button
                  className="btn btn-secondary"
                  onClick={() => handleUnfollow(profile)}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  className="btn btn-primary"
                  onClick={() => handleFollow(profile)}
                >
                  Follow
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
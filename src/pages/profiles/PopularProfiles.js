import React from "react";
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";
import styles from "../../styles/PopularProfiles.module.css";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  // List of most followed profiles

  return (
    <Container className="text-center">
      {popularProfiles.results.length ? (
        <>
          <div className={styles.title}>Most followed profiles</div>
          {mobile ? (
            <div className="d-flex flex-column flex-md-row justify-content-around">
              {popularProfiles.results.slice(0, 4).map((profile) => (
                <Profile key={profile.id} profile={profile} mobile />
              ))}
            </div>
          ) : (
            popularProfiles.results.map((profile) => (
              <Profile key={profile.id} profile={profile} />
            ))
          )}
        </>
      ) : (
        <Asset spinner />
      )}
    </Container>
  );
};

export default PopularProfiles;

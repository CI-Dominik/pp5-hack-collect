import React from "react";
import { Container } from "react-bootstrap";
import Asset from "../../components/Asset";
import { useProfileData } from "../../contexts/ProfileDataContext";
import Profile from "./Profile";
import styles from "../../styles/PopularProfiles.module.css";

const PopularProfiles = ({ mobile }) => {
  const { popularProfiles } = useProfileData();

  return (
<>
      {popularProfiles.results.length ? (
        <>
          <div className={styles.title}>Most followed profiles</div>
          {mobile ? (
            <div>
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
</>
  );
};

export default PopularProfiles;

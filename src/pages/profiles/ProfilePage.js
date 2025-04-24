import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Asset from "../../components/Asset";
import PopularProfiles from "./PopularProfiles";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { Button, Image, Card } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Hack from "../hacks/Hack";
import { fetchMoreData } from "../../utils/utils";
import { ProfileEditDropdown } from "../../components/ActionDropdown";
import styles from "../../styles/ProfilePage.module.css";

function ProfilePage() {
    const [hasLoaded, setHasLoaded] = useState(false);
    const [profileHacks, setProfileHacks] = useState({ results: [] });

    const currentUser = useCurrentUser();
    const { id } = useParams();
    const { setProfileData, handleFollow, handleUnfollow } = useSetProfileData();
    const { pageProfile } = useProfileData();
    const [profile] = pageProfile.results;
    const is_owner = currentUser?.username === profile?.owner;

    // Fetch profile and hacks data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [{ data: pageProfile }, { data: profileHacks }] = await Promise.all([
                    axiosReq.get(`/profiles/${id}/`),
                    axiosReq.get(`/hacks/?owner__profile=${id}`),
                ]);
                setProfileData((prevState) => ({
                    ...prevState,
                    pageProfile: { results: [pageProfile] },
                }));
                setProfileHacks(profileHacks);
                setHasLoaded(true);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [id, setProfileData]);

    // Layout for the needed profile

    const mainProfile = (
        <Card className={`${styles.profileContainer} mb-4`}>
            <Card.Body>
                {profile?.is_owner && <div className="text-end"><ProfileEditDropdown id={profile?.id} /></div>}
                <Row className="align-items-center text-center text-lg-start">
                    <Col lg={3}>
                        <Image
                            src={profile?.image}
                            roundedCircle
                            alt="Avatar"
                            className={styles.profileImage}
                        />
                    </Col>
                    <Col className="text-center" lg={8}>
                        <h3 className="my-md-3">{profile?.owner}</h3>
                        <Row className="d-flex flex-row mt-2 gap-1 justify-content-center">
                            <Col lg={3} className={`${styles.statBox} text-center p-1`}>
                                <div>{profile?.hacks_count}</div>
                                <div>Hacks</div>
                            </Col>
                            <Col lg={3} className={`${styles.statBox} text-center p-1`}>
                                <div>{profile?.followers_count}</div>
                                <div>Follower</div>
                            </Col>
                            <Col lg={3} className={`${styles.statBox} text-center p-1`}>
                                <div>{profile?.following_count}</div>
                                <div>Following</div>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row>
                    <Col className="text-center">
                        {currentUser && !is_owner && (
                            <Button
                                className="mt-2"
                                variant={profile?.following_id ? "secondary" : "primary"}
                                onClick={() =>
                                    profile?.following_id
                                        ? handleUnfollow(profile)
                                        : handleFollow(profile)
                                }
                            >
                                {profile?.following_id ? "Unfollow" : "Follow"}
                            </Button>
                        )}
                    </Col>
                </Row>
                {profile?.content && (
                    <Row className="mt-4">
                        <Col>
                            <p>{profile.content}</p>
                        </Col>
                    </Row>
                )}
            </Card.Body>
        </Card>
    );

    // Layout for the hacks related to the profile

    const mainProfileHacks = (
        <>
            <hr className="border-secondary" />
            <h1 className="text-center text-light">{profile?.owner}'s Hacks</h1>
            <hr className="border-secondary" />
            {profileHacks.results.length ? (
                <InfiniteScroll
                    children={profileHacks.results.map((hack) => (
                        <Hack key={hack.id} {...hack} setHacks={setProfileHacks} />
                    ))}
                    dataLength={profileHacks.results.length}
                    loader={<Asset spinner />}
                    hasMore={!!profileHacks.next}
                    next={() => fetchMoreData(profileHacks, setProfileHacks)}
                />
            ) : (
                <Asset
                    message={`No results found, ${profile?.owner} hasn't posted yet.`}
                />
            )}
        </>
    );

    return (
        <Container className="p-2">
            <div className="d-block d-lg-none mb-3">
                <PopularProfiles mobile />
            </div>

            <Row>
                <Col className="py-2 p-lg-2" lg={8}>
                    <Container className="mt-3 p-0">
                        {hasLoaded ? (
                            <>
                                {mainProfile}
                                {mainProfileHacks}
                            </>
                        ) : (
                            <Asset spinner />
                        )}
                    </Container>
                </Col>

                <Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
                    <PopularProfiles />
                </Col>
            </Row>
        </Container>
    );
}

export default ProfilePage;

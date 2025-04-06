import React, { useEffect, useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

import { useCurrentUser } from "../../contexts/CurrentUserContext";

import Hack from "./Hack";
import Asset from "../../components/Asset";
import { Container } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import Comment from "../comments/Comment";

import { fetchMoreData } from "../../utils/utils";
import CommentCreateForm from "../comments/CommentCreateForm";

function HackPage() {
  const { id } = useParams();
  const [hack, setHack] = useState({ results: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState({ results: [] });

  const currentUser = useCurrentUser();
  const profile_image = currentUser?.profile_image;

  useEffect(() => {
    const handleMount = async () => {
      try {
        const [{ data: hackData }, { data: comments }] = await Promise.all([
          axiosReq.get(`/hacks/${id}`),
          axiosReq.get(`/comments/?hack=${id}`),
        ]);
        setHack({ results: [hackData] });
        setComments(comments);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    handleMount();
  }, [id]);

  return (
    <Container>
      <Row className="h-100">
        <Col className="py-2 p-0 p-lg-2" lg={6}>
          {isLoading ? (
            <Asset spinner />
          ) : hack.results.length ? (
            <Hack {...hack.results[0]} hackPage />
          ) : (
            <h1 className="text-white">No hack found!</h1>
          )}
        </Col>
        <Col className="py-2 p-0 p-lg-2" lg={6}>
        {currentUser && hack?.results?.length ? (
            <CommentCreateForm
              profile_id={currentUser.profile_id}
              profileImage={profile_image}
              hack={id}
              setHack={setHack}
              setComments={setComments}
            />
          ) : comments.results.length ? (
            "Comments"
          ) : null}
          {comments.results.length && hack?.results?.length ? (
            <InfiniteScroll
              children={comments.results.map((comment) => (
                <Comment
                  key={comment.id}
                  {...comment}
                  setHack={setHack}
                  setComments={setComments}
                />
              ))}
              dataLength={comments.results.length}
              loader={<Asset spinner />}
              hasMore={!!comments.next}
              next={() => fetchMoreData(comments, setComments)}
            />
          ) : currentUser && hack?.results?.length ? (
            <span className="text-white fw-bold">No comments found. Do you want to start?</span>
          ) : (
            <span className="text-white fw bold">No comments found.</span>
          )}
  {console.log(hack)}
        </Col>
      </Row>
    </Container>
  );
}

export default HackPage;
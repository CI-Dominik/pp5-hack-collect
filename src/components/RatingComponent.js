import React, { useState, useEffect } from "react";
import Rating from "@mui/material/Rating";
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const RatingComponent = ({ hackId }) => {
  const [rating, setRating] = useState({});
  const [hasRating, setHasRating] = useState(false);

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (currentUser) {
          const response = await axiosReq.get(`/ratings/?hack=${hackId}&owner=${currentUser.username}`);
          if (response.data.results) {
            setRating(response?.data?.results[0]);
            setHasRating(true);
          }
        } else {
          setRating(0);
          setHasRating(false);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRating();
  }, [hackId, rating, currentUser]);

  const handleRatingChange = async (event, newValue) => {
    if (currentUser) {
      try {
        const response = await axiosReq.post("/ratings/", { hack: hackId, rating: newValue });
        setRating(response?.data?.rating);
        setHasRating(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRatingDelete = async () => {
    try {
      await axiosRes.delete(`/ratings/${rating.id}`);
      setRating(0);
      setHasRating(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Rating
        name={`rating-${hackId}`}
        value={rating?.rating || 0}
        precision={1}
        onChange={handleRatingChange}
        disabled={!currentUser}
      />
      <Button
        variant="secondary"
        onClick={handleRatingDelete}
        disabled={!hasRating || !currentUser}
      >
        Delete Rating
      </Button>
    </div>
  );
};

export default RatingComponent;
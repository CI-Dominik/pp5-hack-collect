import React, { useState, useEffect } from "react";
import { Rating } from 'react-simple-star-rating'
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
          const response = await axiosReq.get(`/ratings/?hack=${hackId}&owner=${currentUser.id}`);
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

  const handleRatingChange = async (newValue) => {
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
      if (rating) {
        await axiosRes.delete(`/ratings/${rating.id}`);
        setRating(0);
        setHasRating(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center">
      <Rating
        onClick={handleRatingChange}
        initialValue={rating === undefined ? 3 : rating}
      />
      <Button
        variant="secondary"
        onClick={handleRatingDelete}
        disabled={rating === undefined || !currentUser}
      >
        Delete Rating
      </Button>
    </div>
  );
};

export default RatingComponent;
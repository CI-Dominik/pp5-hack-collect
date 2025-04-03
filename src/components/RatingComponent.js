import React, { useState, useEffect } from "react";
import { Rating } from 'react-simple-star-rating'
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const RatingComponent = ({ hackId }) => {
  const [rating, setRating] = useState(null);
  const [hasRating, setHasRating] = useState(false);

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (currentUser) {
          const response = await axiosReq.get(`/ratings/?hack=${hackId}&owner=${currentUser.pk}`);
          if (response.data.results.length) {
            setRating({ id: response.data.results[0]?.id, rating: response.data.results[0].rating });
            setHasRating(true);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRating();
  }, [hackId, currentUser]);

  const handleRatingChange = async (newValue) => {
    if (currentUser) {
      try {
        const response = await axiosReq.post("/ratings/", { hack: hackId, rating: newValue });
        setRating({ id: response.data.id, rating: newValue });
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
        setRating(null);
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
        initialValue={rating ? rating.rating : 0}
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
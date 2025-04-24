import React, { useState, useEffect } from "react";
import { Rating } from 'react-simple-star-rating';
import { axiosReq, axiosRes } from "../api/axiosDefaults";
import { Button } from "react-bootstrap";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const RatingComponent = ({ hackId, setHack }) => {
  const [rating, setRating] = useState(null);
  const [tempRating, setTempRating] = useState(0);
  const [hasRating, setHasRating] = useState(false);

  const currentUser = useCurrentUser();

  const hasChanged = tempRating !== (rating?.rating || 0);

  // Check for exisiting user rating

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (currentUser) {
          const response = await axiosReq.get(`/ratings/?hack=${hackId}&owner=${currentUser.pk}`);
          if (response.data.results.length) {
            const existing = response.data.results[0];
            setRating({ id: existing.id, rating: existing.rating });
            setTempRating(existing.rating);
            setHasRating(true);
          }
        }
      } catch (error) {}
    };

    fetchRating();
  }, [hackId, currentUser]);

  // Submission of the given rating

  const handleSubmitRating = async () => {
    try {
      if (!hasRating) {
        const response = await axiosReq.post("/ratings/", { hack: hackId, rating: tempRating });
        setRating({ id: response.data.id, rating: tempRating });
        setHasRating(true);
      } else if (rating && rating.rating !== tempRating) {
        await axiosRes.put(`/ratings/${rating.id}/`, {
          hack: hackId,
          rating: tempRating,
        });
        setRating((prev) => ({ ...prev, rating: tempRating }));
      }

      if (setHack) {
        const { data } = await axiosReq.get(`/hacks/${hackId}`);
        setHack({ results: [data] });
      }
    } catch (error) {}
  };

  // Rating deletion

  const handleRatingDelete = async () => {
    try {
      if (rating) {
        await axiosRes.delete(`/ratings/${rating.id}`);
        setRating(null);
        setTempRating(0);
        setHasRating(false);

        if (setHack) {
          const { data } = await axiosReq.get(`/hacks/${hackId}`);
          setHack({ results: [data] });
        }
      }
    } catch (error) {}
  };

  return (
    <div className="d-flex flex-column">
      <p>Your rating:</p>
      <Rating
        onClick={(value) => setTempRating(value)}
        initialValue={tempRating}
        allowHover
      />
      <div className="d-flex gap-2 mt-2">
        <Button
          variant="primary"
          onClick={handleSubmitRating}
          disabled={!hasChanged || tempRating === 0}
        >
          {hasRating ? "Update Rating" : "Submit Rating"}
        </Button>
        <Button
          variant="warning"
          onClick={handleRatingDelete}
          disabled={!hasRating}
        >
          Delete Rating
        </Button>
      </div>
    </div>
  );
};

export default RatingComponent;

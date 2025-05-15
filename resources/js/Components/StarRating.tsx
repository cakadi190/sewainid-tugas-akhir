import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import styled from '@emotion/styled';

interface RatingReviewProps {
  rating: number
  setRating?: (rating: number) => void
  isReadonly?: boolean
  withLabel?: boolean
}

const RatingWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: .5rem;
`;

const RatingReview: React.FC<RatingReviewProps> = ({
  rating,
  setRating,
  isReadonly = false,
  withLabel = false
}) => {
  const [hover, setHover] = useState(0)
  const displayValue = isReadonly ? rating : hover || rating

  return (
    <RatingWrapper>
      <div className='rating'>
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            style={{
              transition: 'all .2s ease',
              cursor: isReadonly ? 'default' : 'pointer',
              color: displayValue >= star ? 'gold' : 'lightgray',
            }}
            onMouseEnter={() => !isReadonly && setHover(star)}
            onMouseLeave={() => !isReadonly && setHover(0)}
            onClick={() => !isReadonly && setRating?.(star)}
          />
        ))}
      </div>
      {withLabel && (
        <span>({displayValue.toFixed(1)})</span>
      )}
    </RatingWrapper>
  )
}

export default RatingReview

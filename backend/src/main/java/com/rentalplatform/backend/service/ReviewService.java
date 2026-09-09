package com.rentalplatform.backend.service;

import com.rentalplatform.backend.entity.Review;
import com.rentalplatform.backend.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public Review createReview(Review review) {
        if (review.getBookingId() != null) {
            java.util.Optional<Review> existing = reviewRepository.findByBookingId(review.getBookingId());
            if (existing.isPresent()) {
                Review current = existing.get();
                current.setRating(review.getRating());
                current.setComment(review.getComment());
                return reviewRepository.save(current);
            }
        }
        if (review.getCreatedAt() == null) {
            review.setCreatedAt(java.time.OffsetDateTime.now());
        }
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElse(null);
    }

    public List<Review> getByReviewee(java.util.UUID revieweeId) {
        return reviewRepository.findByRevieweeId(revieweeId);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
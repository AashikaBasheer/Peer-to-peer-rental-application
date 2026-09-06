package com.rentalplatform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentalplatform.backend.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    
}
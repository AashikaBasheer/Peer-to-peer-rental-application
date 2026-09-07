package com.rentalplatform.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentalplatform.backend.entity.Return;



public interface ReturnRepository extends JpaRepository<Return, Long> {

    Optional<Return> findByBookingId(Long bookingId);

}


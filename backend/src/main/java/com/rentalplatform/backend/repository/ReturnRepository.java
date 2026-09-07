package com.rentalplatform.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentalplatform.backend.entity.Return;
import java.util.List;


public interface ReturnRepository extends JpaRepository<RentalReturn, Long> {

    Optional<RentalReturn> findByBookingId(Long bookingId);

}


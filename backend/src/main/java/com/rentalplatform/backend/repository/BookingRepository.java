package com.rentalplatform.backend.repository;

import com.rentalplatform.backend.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.Instant;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.itemId = :itemId
        AND b.status <> 'CANCELLED'
        AND b.startTime < :endTime
        AND b.endTime > :startTime
        """)
    long countOverlappingBookings(
            Long itemId,
            Instant startTime,
            Instant endTime
    );
}
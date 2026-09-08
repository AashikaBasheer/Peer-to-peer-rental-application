package com.rentalplatform.backend.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.rentalplatform.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRenterId(UUID renterId);

    List<Booking> findByLenderId(UUID lenderId);

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
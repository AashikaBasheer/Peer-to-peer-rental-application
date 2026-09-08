package com.rentalplatform.backend.repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.rentalplatform.backend.entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByRenterId(UUID renterId);

    List<Booking> findByItemIdInOrderByCreatedAtDesc(List<Long> itemIds);

    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.itemId = :itemId
        AND b.status IN ('REQUESTED', 'APPROVED')
        AND b.startTime < :endTime
        AND b.endTime > :startTime
        """)
    long countOverlappingBookings(
            @Param("itemId") Long itemId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime
    );
}
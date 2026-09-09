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

    List<Booking> findByRenterIdOrderByBookingIdDesc(UUID renterId);

    List<Booking> findByItemIdInOrderByCreatedAtDesc(List<Long> itemIds);

    List<Booking> findByLenderIdOrderByCreatedAtDesc(UUID lenderId);

    long countByLenderIdAndRenterId(UUID lenderId, UUID renterId);

    long countByRenterId(UUID renterId);

    List<Booking> findByLenderIdAndRenterIdOrderByBookingIdDesc(UUID lenderId, UUID renterId);

    List<Booking> findByItemIdAndStatusAndBookingIdNot(Long itemId, String status, Long bookingId);

    @Query("""
            SELECT COUNT(b)
            FROM Booking b
            WHERE b.itemId = :itemId
            AND b.status IN ('APPROVED', 'CONFIRMED', 'BOOKED')
            AND b.startTime < :endTime
            AND b.endTime > :startTime
            """)
    long countOverlappingBookings(
            @Param("itemId") Long itemId,
            @Param("startTime") Instant startTime,
            @Param("endTime") Instant endTime);
}
package com.rentalplatform.backend.service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rentalplatform.backend.entity.Booking;
import com.rentalplatform.backend.entity.Item;
import com.rentalplatform.backend.repository.BookingRepository;
import com.rentalplatform.backend.repository.ItemRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class BookingService {
    private final BookingRepository bookingRepository;
    private final ItemRepository itemRepository;

    public Booking createBooking(Booking booking) {

        if (booking.getItemId() == null || booking.getRenterId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Item and renter are required");
        }

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Start time and end time are required");
        }

        if (!booking.getEndTime().isAfter(booking.getStartTime())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "End time must be after start time");
        }

        Item item = itemRepository.findById(booking.getItemId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Item not found"));

        booking.setLenderId(item.getOwnerId());
        
        if (!Boolean.TRUE.equals(item.getAvailability())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Item is currently unavailable");
        }

        long overlappingBookings = bookingRepository.countOverlappingBookings(
                booking.getItemId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if(overlappingBookings > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "Item already booked for this period");
        }

        booking.setPrice(item.getRentalPrice());

        booking.setSecurityDeposit(item.getSecurityDeposit());

        booking.setStatus("REQUESTED");

        return bookingRepository.save(booking);

    }

    public List<Booking> getByRenter(UUID renterId) {
        return bookingRepository.findByRenterId(renterId);
    }

    public List<Booking> getByLender(UUID lenderId) {
        List<Long> itemIds = itemRepository.findByOwnerId(lenderId).stream()
                .map(Item::getItemId)
                .collect(Collectors.toList());

        if (itemIds.isEmpty()) {
            return List.of();
        }

        return bookingRepository.findByItemIdInOrderByCreatedAtDesc(itemIds);
    }

    public Booking updateStatus(Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!status.equals("APPROVED") && !status.equals("REJECTED")) {
            throw new RuntimeException("Status must be APPROVED or REJECTED");
        }

        if (!booking.getStatus().equals("REQUESTED")) {
            throw new RuntimeException("Only requested bookings can be reviewed");
        }

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
}

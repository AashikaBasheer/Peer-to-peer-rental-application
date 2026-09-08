package com.rentalplatform.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

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

        if(booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new RuntimeException("Start time and end time are required");
        }

        if(!booking.getEndTime().isAfter(booking.getStartTime())) {
            throw new RuntimeException("End time must be after start time");
        }

        Item item = itemRepository.findById(booking.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if(!item.getAvailability()){
            throw new RuntimeException("Item is currently unavailable");
        }

        long overlappingBookings = bookingRepository.countOverlappingBookings(
                booking.getItemId(),
                booking.getStartTime(),
                booking.getEndTime()
        );

        if(overlappingBookings > 0) {
            throw new RuntimeException("Item already booked for this period");
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
        return bookingRepository.findByLenderId(lenderId);
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

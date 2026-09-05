package com.rentalplatform.backend.service;

import com.rentalplatform.backend.entity.Booking;
import com.rentalplatform.backend.repository.BookingRepository;
import com.rentalplatform.backend.repository.ItemRepository;
import com.rentalplatform.backend.entity.Item;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        booking.setStatus("BOOKED");

        return bookingRepository.save(booking);

    }


}

package com.rentalplatform.backend.controller;

import com.rentalplatform.backend.entity.Booking;
import com.rentalplatform.backend.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor

public class BookingController {
    private final BookingService bookingService;
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

}

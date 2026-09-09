package com.rentalplatform.backend.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rentalplatform.backend.entity.Booking;
import com.rentalplatform.backend.service.BookingService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor

public class BookingController {
    private final BookingService bookingService;
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @GetMapping("/renter/{renterId}")
    public List<Booking> getByRenter(@PathVariable UUID renterId) {
        return bookingService.getByRenter(renterId);
    }

    @GetMapping("/lender/{lenderId}")
    public List<Booking> getByLender(@PathVariable UUID lenderId) {
        return bookingService.getByLender(lenderId);
    }

    @PutMapping("/{bookingId}/status")
    public Booking updateStatus(
            @PathVariable Long bookingId,
            @RequestParam String status) {
        return bookingService.updateStatus(bookingId, status);
    }

    @PutMapping("/{bookingId}/complete-return")
    public Booking completeReturn(
            @PathVariable Long bookingId,
            @RequestParam(defaultValue = "true") boolean relist) {
        return bookingService.completeReturn(bookingId, relist);
    }

    @GetMapping("/customer-history")
    public java.util.Map<String, Object> getCustomerHistory(
            @RequestParam UUID lenderId,
            @RequestParam UUID renterId) {
        return bookingService.getCustomerHistory(lenderId, renterId);
    }
}

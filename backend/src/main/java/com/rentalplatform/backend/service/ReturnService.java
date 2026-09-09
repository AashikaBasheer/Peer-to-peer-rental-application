package com.rentalplatform.backend.service;

import java.time.Instant;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rentalplatform.backend.entity.Booking;
import com.rentalplatform.backend.entity.Return;
import com.rentalplatform.backend.repository.BookingRepository;
import com.rentalplatform.backend.repository.ReturnRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReturnService {

    private final ReturnRepository repo;
    private final BookingRepository bookingRepository;

    public Return create(Return rentalReturn) {
        if (rentalReturn.getBookingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking ID is required");
        }

        // Update the corresponding booking to RETURNED
        Booking booking = bookingRepository.findById(rentalReturn.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        booking.setStatus("RETURNED");
        bookingRepository.save(booking);

        // Check if return record already exists for this booking to avoid unique constraint violations
        Optional<Return> existing = repo.findByBookingId(rentalReturn.getBookingId());
        if (existing.isPresent()) {
            Return current = existing.get();
            current.setStatus("RETURNED");
            current.setReturnDate(Instant.now());
            if (rentalReturn.getCondition() != null) {
                current.setCondition(rentalReturn.getCondition());
            }
            if (rentalReturn.getRemarks() != null) {
                current.setRemarks(rentalReturn.getRemarks());
            }
            return repo.save(current);
        }

        rentalReturn.setReturnDate(Instant.now());
        rentalReturn.setStatus("RETURNED");

        return repo.save(rentalReturn);
    }
}


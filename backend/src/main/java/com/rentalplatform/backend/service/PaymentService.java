package com.rentalplatform.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.rentalplatform.backend.entity.Booking;
import com.rentalplatform.backend.entity.Item;
import com.rentalplatform.backend.entity.Payment;
import com.rentalplatform.backend.repository.BookingRepository;
import com.rentalplatform.backend.repository.ItemRepository;
import com.rentalplatform.backend.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository repo;
    private final BookingRepository bookingRepository;
    private final ItemRepository itemRepository;

    public Payment create(Payment payment){
        if (payment.getBookingId() == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Booking is required");
        }

        Booking booking = bookingRepository.findById(payment.getBookingId())
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Booking not found"));

        if ("CONFIRMED".equals(booking.getStatus())) {
            Optional<Payment> existingPayment = repo.findByBookingId(payment.getBookingId())
                    .stream()
                    .findFirst();
            if (existingPayment.isPresent()) {
                return existingPayment.get();
            }
        }

        if ("REJECTED".equals(booking.getStatus()) || "CANCELLED".equals(booking.getStatus())) {
            throw new ResponseStatusException(
            HttpStatus.CONFLICT, "This booking cannot be paid");
        }

        payment.setPaymentMethod("DIRECT");
        payment.setPaymentStatus("COMPLETED");
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);

        if (booking.getItemId() != null) {
            itemRepository.findById(booking.getItemId()).ifPresent(item -> {
                int currentQty = item.getQuantity() != null ? item.getQuantity() : 1;
                int newQty = Math.max(0, currentQty - 1);
                item.setQuantity(newQty);
                // Keep availability open unless quantity reaches 0
                if (newQty <= 0) {
                    item.setAvailability(false);
                } else {
                    item.setAvailability(true);
                }
                itemRepository.save(item);
            });
        }

        try {
            return repo.save(payment);
        } catch (RuntimeException ignored) {
            return payment;
        }
    }

    public List<Payment> getByBooking(Long bookingId){
        return repo.findByBookingId(bookingId);
    }
}

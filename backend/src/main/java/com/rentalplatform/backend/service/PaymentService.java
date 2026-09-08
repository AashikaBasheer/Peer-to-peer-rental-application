package com.rentalplatform.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.rentalplatform.backend.entity.Booking;
import com.rentalplatform.backend.entity.Payment;
import com.rentalplatform.backend.repository.BookingRepository;
import com.rentalplatform.backend.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository repo;
    private final BookingRepository bookingRepository;
    public Payment create(Payment payment){
        Booking booking = bookingRepository.findById(payment.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!"APPROVED".equals(booking.getStatus())) {
            throw new RuntimeException("Payment is allowed only after lender approval");
        }

        payment.setPaymentStatus("COMPLETED");
        booking.setStatus("CONFIRMED");
        bookingRepository.save(booking);
        return repo.save(payment);
    }

    public List<Payment> getByBooking(Long bookingId){
        return repo.findByBookingId(bookingId);
    }
}

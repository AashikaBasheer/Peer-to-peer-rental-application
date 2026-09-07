package com.rentalplatform.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rentalplatform.backend.entity.DamageReport;

public interface DamageReportRepository extends JpaRepository<DamageReport, Long> {
    List<DamageReport> findByBookingId(Long bookingId);
    List<DamageReport> findByStatus(String status);
    boolean existsByBookingId(Long bookingId);
}
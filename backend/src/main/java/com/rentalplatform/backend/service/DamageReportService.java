package com.rentalplatform.backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.rentalplatform.backend.entity.DamageReport;
import com.rentalplatform.backend.repository.DamageReportRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DamageReportService {
    
    private final DamageReportRepository repo;
    
    public List<DamageReport> getAll() {
        return repo.findAll();
    }
    
    public List<DamageReport> getByBooking(Long bookingId) {
        return repo.findByBookingId(bookingId);
    }
    
    public List<DamageReport> getByUser(Long userId) {
        return repo.findByReportedByUserId(userId);
    }
    
    public DamageReport get(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Damage report not found"));
    }
    
    public DamageReport create(DamageReport report) {
        report.setStatus("REPORTED");
        report.setCreatedAt(LocalDateTime.now());
        return repo.save(report);
    }
    
    public DamageReport updateStatus(Long id, String status, String resolutionNotes) {
        DamageReport report = get(id);
        report.setStatus(status);
        if (resolutionNotes != null) {
            report.setResolutionNotes(resolutionNotes);
        }
        if ("RESOLVED_WITH_PAYMENT".equals(status) || "RESOLVED_NO_PAYMENT".equals(status)) {
            report.setResolvedAt(LocalDateTime.now());
        }
        return repo.save(report);
    }
    
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
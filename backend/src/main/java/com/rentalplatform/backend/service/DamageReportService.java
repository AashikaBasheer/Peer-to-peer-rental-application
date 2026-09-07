package com.rentalplatform.backend.service;

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
    
    public DamageReport get(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Damage report not found"));
    }
    
    public DamageReport create(DamageReport report) {
        report.setStatus("REPORTED");
        return repo.save(report);
    }
    
    public DamageReport updateStatus(Long id, String status) {
        DamageReport report = get(id);
        report.setStatus(status);
        return repo.save(report);
    }
    
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
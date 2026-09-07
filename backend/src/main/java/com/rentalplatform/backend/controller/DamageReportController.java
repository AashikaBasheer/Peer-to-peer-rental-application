package com.rentalplatform.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rentalplatform.backend.entity.DamageReport;
import com.rentalplatform.backend.service.DamageReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/damage-reports")
@RequiredArgsConstructor
public class DamageReportController {

    private final DamageReportService service;

    @PostMapping
    public DamageReport create(@RequestBody DamageReport report) {
        return service.create(report);
    }

    @GetMapping
    public List<DamageReport> getAll() {
        return service.getAll();
    }

    @GetMapping("/{id}")
    public DamageReport get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping("/booking/{bookingId}")
    public List<DamageReport> getByBooking(@PathVariable Long bookingId) {
        return service.getByBooking(bookingId);
    }

    @GetMapping("/user/{userId}")
    public List<DamageReport> getByUser(@PathVariable Long userId) {
        return service.getByUser(userId);
    }

    @PutMapping("/{id}/status")
    public DamageReport updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String resolutionNotes) {
        return service.updateStatus(id, status, resolutionNotes);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
package com.rentalplatform.backend.entity;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "damage_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DamageReport {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "damage_id")
    private Long damageId;
    
    @Column(name = "booking_id", nullable = false)
    private Long bookingId;

    @Column(name = "damage_description", nullable = false)
    private String damageDescription;

    @Column(name = "damage_cost", nullable = false)
    private BigDecimal damageCost;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "reported_at", nullable = false, insertable = false, updatable = false)
    private OffsetDateTime reportedAt;
}
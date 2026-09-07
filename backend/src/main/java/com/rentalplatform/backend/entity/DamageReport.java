package com.rentalplatform.backend.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

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
    
    @Column(name = "booking_id")
    private Long bookingId;
    
    @Column(name = "reported_by_user_id")
    private Long reportedByUserId;
    
    @Column(name = "item_id")
    private Long itemId;
    
    @Column(name = "damage_description")
    private String damageDescription;
    
    @Column(name = "damage_cost")
    private BigDecimal damageCost;
    
    @Column(name = "image_url")
    private String imageUrl;
    
    private String status;
    
    @Column(name = "resolution_notes")
    private String resolutionNotes;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;
}
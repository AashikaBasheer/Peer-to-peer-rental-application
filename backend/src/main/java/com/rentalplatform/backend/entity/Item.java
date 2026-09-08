package com.rentalplatform.backend.entity;

import java.math.BigDecimal;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="items")
@Data
@NoArgsConstructor
public class Item {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="item_id")
    private Long itemId;
    @Column(name="owner_id")
    private UUID ownerId;
    @Column(name="cat_id")
    private Long catID;
    private String itemName;
    private String description;
    private String location;
    private String condition;
    private Boolean availability;
    private BigDecimal rentalPrice;
    private BigDecimal securityDeposit;
    @Column(name="quantity")
    private Integer quantity = 1;

    public Integer getQuantity() {
        return quantity != null ? quantity : 1;
    }
}

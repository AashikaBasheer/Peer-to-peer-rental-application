package com.rentalplatform.backend.service;

import java.time.Instant;

import org.springframework.stereotype.Service;

import com.rentalplatform.backend.entity.Return;
import com.rentalplatform.backend.repository.ReturnRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReturnService {

    private final ReturnRepository repo;

    public Return create(Return rentalReturn) {
        rentalReturn.setReturnDate(Instant.now());
        rentalReturn.setStatus("PENDING");

        return repo.save(rentalReturn);
    }
}


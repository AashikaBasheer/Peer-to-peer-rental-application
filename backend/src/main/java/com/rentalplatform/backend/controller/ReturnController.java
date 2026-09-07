package com.rentalplatform.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rentalplatform.backend.entity.Return;
import com.rentalplatform.backend.service.ReturnService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService service;

    @PostMapping
    public Return create(
            @RequestBody Return rentalReturn) {

        return service.create(rentalReturn);
    }
}
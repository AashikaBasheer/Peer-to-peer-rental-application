package com.rentalplatform.backend.service;

@RestController
@RequestMapping("/api/returns")
@RequiredArgsConstructor
public class ReturnController {

    private final ReturnService service;

    @PostMapping
    public RentalReturn create(
            @RequestBody RentalReturn rentalReturn) {

        return service.create(rentalReturn);
    }
}
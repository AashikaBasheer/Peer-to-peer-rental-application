package com.rentalplatform.backend.service;


@Service
@RequiredArgsConstructor
public class ReturnService {

    private final ReturnRepository repo;

    public RentalReturn create(RentalReturn rentalReturn) {
        rentalReturn.setReturnDate(Instant.now());
        rentalReturn.setStatus("PENDING");

        return repo.save(rentalReturn);
    }
}


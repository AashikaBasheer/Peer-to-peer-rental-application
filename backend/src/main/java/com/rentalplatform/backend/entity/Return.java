package com.rentalplatform.backend.entity;

@Entity
@Table(name = "returns")
@Getter
@Setter
@NoArgsConstructor
public class Return {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long returnId;

    private Long bookingId;
    private Instant returnDate;
    private String status;
    private String condition;
    private String remarks;
}

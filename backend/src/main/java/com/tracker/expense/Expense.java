package com.tracker.expense;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "expenses")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable= false)
    private String title;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private String category;

    // ==========================================
    // THE MISSING LINK: CHANNELS THE RELATIONSHIP
    // ==========================================
    @ManyToOne(fetch = FetchType.LAZY) // LAZY performance loading strategy
    @JoinColumn(name = "user_id", nullable = false) // Creates user_id Foreign Key in PostgreSQL
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "password"}) // Stops the Jackson infinite JSON loops!
    private User user;



}

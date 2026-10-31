package it.smartolivemill.kpidashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;

// Sottoprodotto: sansa umida giornaliera e sua destinazione
@Entity
@Table(name = "by_product")
public class ByProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data della rilevazione
    @Column(nullable = false)
    private LocalDate date;

    // Kg di sansa umida prodotta
    private Double wetPomaceKg;

    // Destinazione della sansa
    private String destination;

    // Kg di sansa recuperati
    private Double recoveredKg;

    public ByProduct() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Double getWetPomaceKg() { return wetPomaceKg; }
    public void setWetPomaceKg(Double wetPomaceKg) { this.wetPomaceKg = wetPomaceKg; }

    public String getDestination() { return destination; }
    public void setDestination(String destination) { this.destination = destination; }

    public Double getRecoveredKg() { return recoveredKg; }
    public void setRecoveredKg(Double recoveredKg) { this.recoveredKg = recoveredKg; }
}

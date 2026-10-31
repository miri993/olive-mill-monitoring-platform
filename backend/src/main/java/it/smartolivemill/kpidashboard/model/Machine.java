package it.smartolivemill.kpidashboard.model;

import jakarta.persistence.*;

// Macchina della linea di estrazione (Frangitore, Decanter 2 fasi)
@Entity
@Table(name = "machine")
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome della macchina
    @Column(nullable = false, unique = true)
    private String name;

    // Potenza nominale (kW)
    private Double powerKw;

    // Capacità nominale: kg di olive lavorabili all'ora
    private Double capacityKgH;

    public Machine() {
    }

    public Machine(String name, Double powerKw, Double capacityKgH) {
        this.name = name;
        this.powerKw = powerKw;
        this.capacityKgH = capacityKgH;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getPowerKw() { return powerKw; }
    public void setPowerKw(Double powerKw) { this.powerKw = powerKw; }

    public Double getCapacityKgH() { return capacityKgH; }
    public void setCapacityKgH(Double capacityKgH) { this.capacityKgH = capacityKgH; }
}

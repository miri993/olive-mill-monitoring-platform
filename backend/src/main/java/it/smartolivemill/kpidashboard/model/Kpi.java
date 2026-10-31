package it.smartolivemill.kpidashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;

// Indicatore calcolato (OEE, costo fermo, CO2, sottoprodotti recuperati...)
@Entity
@Table(name = "kpi")
public class Kpi {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data di calcolo dell'indicatore
    @Column(nullable = false)
    private LocalDate calculationDate;

    // Nome dell'indicatore
    @Column(nullable = false)
    private String name;

    // Macchina di riferimento: null = intera linea
    @ManyToOne
    @JoinColumn(name = "machine_id")
    private Machine machine;

    // Valore dell'indicatore
    @Column(nullable = false)
    private Double value;

    public Kpi() {
    }

    public Kpi(LocalDate calculationDate, String name, Machine machine, Double value) {
        this.calculationDate = calculationDate;
        this.name = name;
        this.machine = machine;
        this.value = value;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getCalculationDate() { return calculationDate; }
    public void setCalculationDate(LocalDate calculationDate) { this.calculationDate = calculationDate; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }
}

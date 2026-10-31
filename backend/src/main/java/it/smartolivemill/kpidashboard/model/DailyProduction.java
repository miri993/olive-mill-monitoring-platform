package it.smartolivemill.kpidashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;

// Produzione giornaliera: una riga per giorno e per macchina
@Entity
@Table(name = "daily_production")
public class DailyProduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data della rilevazione
    @Column(nullable = false)
    private LocalDate date;

    // Macchina a cui si riferisce la rilevazione
    @ManyToOne(optional = false)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    // Ore pianificate
    private Double plannedHours;
    // Ore lavorate
    private Double workedHours;
    // Kg di olive lavorati
    private Double processedKg;
    // Energia consumata (kWh)
    private Double kwh;
    // Resa in olio (%)
    private Double oilYieldPct;
    // Kg di olio prodotti
    private Double oilKg;
    // Litri di olio prodotti
    private Double oilLiters;
    // Kg di sansa umida prodotta
    private Double wetPomaceKg;
    // Litri di olio declassati (non EVO), usati per la Qualità dell'OEE
    private Double downgradedOilLiters;

    public DailyProduction() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public Double getPlannedHours() { return plannedHours; }
    public void setPlannedHours(Double plannedHours) { this.plannedHours = plannedHours; }

    public Double getWorkedHours() { return workedHours; }
    public void setWorkedHours(Double workedHours) { this.workedHours = workedHours; }

    public Double getProcessedKg() { return processedKg; }
    public void setProcessedKg(Double processedKg) { this.processedKg = processedKg; }

    public Double getKwh() { return kwh; }
    public void setKwh(Double kwh) { this.kwh = kwh; }

    public Double getOilYieldPct() { return oilYieldPct; }
    public void setOilYieldPct(Double oilYieldPct) { this.oilYieldPct = oilYieldPct; }

    public Double getOilKg() { return oilKg; }
    public void setOilKg(Double oilKg) { this.oilKg = oilKg; }

    public Double getOilLiters() { return oilLiters; }
    public void setOilLiters(Double oilLiters) { this.oilLiters = oilLiters; }

    public Double getWetPomaceKg() { return wetPomaceKg; }
    public void setWetPomaceKg(Double wetPomaceKg) { this.wetPomaceKg = wetPomaceKg; }

    public Double getDowngradedOilLiters() { return downgradedOilLiters; }
    public void setDowngradedOilLiters(Double downgradedOilLiters) { this.downgradedOilLiters = downgradedOilLiters; }
}

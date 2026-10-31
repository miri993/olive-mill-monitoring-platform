package it.smartolivemill.kpidashboard.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

// Fermo macchina (anomalia)
@Entity
@Table(name = "downtime")
public class Downtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Data del fermo
    @Column(nullable = false)
    private LocalDate date;

    // Macchina ferma
    @ManyToOne(optional = false)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    // Ora di inizio del fermo
    private LocalTime startTime;

    // Durata del fermo (ore; nel CSV è in minuti)
    @Column(nullable = false)
    private Double durationHours;

    // Causa del fermo
    private String cause;

    public Downtime() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public Machine getMachine() { return machine; }
    public void setMachine(Machine machine) { this.machine = machine; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public Double getDurationHours() { return durationHours; }
    public void setDurationHours(Double durationHours) { this.durationHours = durationHours; }

    public String getCause() { return cause; }
    public void setCause(String cause) { this.cause = cause; }
}

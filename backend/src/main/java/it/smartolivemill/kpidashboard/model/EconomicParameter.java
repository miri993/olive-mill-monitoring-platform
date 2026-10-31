package it.smartolivemill.kpidashboard.model;

import jakarta.persistence.*;

// Parametro economico (prezzo olio, costo energia, manodopera, fattore CO2)
@Entity
@Table(name = "economic_parameter")
public class EconomicParameter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome del parametro
    @Column(nullable = false, unique = true)
    private String name;

    // Valore del parametro
    @Column(nullable = false)
    private Double value;

    // Unità di misura (es. €/L, €/kWh, €/h, g/kWh)
    private String unit;

    public EconomicParameter() {
    }

    public EconomicParameter(String name, Double value, String unit) {
        this.name = name;
        this.value = value;
        this.unit = unit;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Double getValue() { return value; }
    public void setValue(Double value) { this.value = value; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
}

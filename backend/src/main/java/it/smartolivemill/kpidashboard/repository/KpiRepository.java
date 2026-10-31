package it.smartolivemill.kpidashboard.repository;

import it.smartolivemill.kpidashboard.model.Kpi;
import org.springframework.data.jpa.repository.JpaRepository;

// Accesso ai dati della tabella kpi (indicatori calcolati)
public interface KpiRepository extends JpaRepository<Kpi, Long> {
}

package it.smartolivemill.kpidashboard.repository;

import it.smartolivemill.kpidashboard.model.DailyProduction;
import org.springframework.data.jpa.repository.JpaRepository;

// Accesso ai dati della tabella daily_production (produzione giornaliera)
public interface DailyProductionRepository extends JpaRepository<DailyProduction, Long> {
}

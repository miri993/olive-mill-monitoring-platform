package it.smartolivemill.kpidashboard.repository;

import it.smartolivemill.kpidashboard.model.Downtime;
import org.springframework.data.jpa.repository.JpaRepository;

// Accesso ai dati della tabella downtime (fermi macchina)
public interface DowntimeRepository extends JpaRepository<Downtime, Long> {
}

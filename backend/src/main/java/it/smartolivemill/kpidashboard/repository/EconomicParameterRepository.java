package it.smartolivemill.kpidashboard.repository;

import it.smartolivemill.kpidashboard.model.EconomicParameter;
import org.springframework.data.jpa.repository.JpaRepository;

// Accesso ai dati della tabella economic_parameter (parametri economici)
public interface EconomicParameterRepository extends JpaRepository<EconomicParameter, Long> {
}

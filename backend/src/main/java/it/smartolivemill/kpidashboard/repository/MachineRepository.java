package it.smartolivemill.kpidashboard.repository;

import it.smartolivemill.kpidashboard.model.Machine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// Accesso ai dati della tabella machine
public interface MachineRepository extends JpaRepository<Machine, Long> {

    // Cerca una macchina per nome (es. "Frangitore")
    Optional<Machine> findByName(String name);
}

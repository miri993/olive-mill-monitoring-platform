package it.smartolivemill.kpidashboard.repository;

import it.smartolivemill.kpidashboard.model.ByProduct;
import org.springframework.data.jpa.repository.JpaRepository;

// Accesso ai dati della tabella by_product (sottoprodotti)
public interface ByProductRepository extends JpaRepository<ByProduct, Long> {
}

package it.smartolivemill.kpidashboard.service;

import it.smartolivemill.kpidashboard.model.ByProduct;
import it.smartolivemill.kpidashboard.repository.ByProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Gestisce le operazioni sui sottoprodotti.
@Service
public class ByProductService {

    private final ByProductRepository byProductRepository;

    public ByProductService(ByProductRepository byProductRepository) {
        this.byProductRepository = byProductRepository;
    }

    public List<ByProduct> findAll() {
        return byProductRepository.findAll();
    }

    public Optional<ByProduct> findById(Long id) {
        return byProductRepository.findById(id);
    }

    public ByProduct save(ByProduct byProduct) {
        return byProductRepository.save(byProduct);
    }

    public void delete(Long id) {
        byProductRepository.deleteById(id);
    }
}

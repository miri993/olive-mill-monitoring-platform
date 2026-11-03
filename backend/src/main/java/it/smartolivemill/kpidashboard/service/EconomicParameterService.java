package it.smartolivemill.kpidashboard.service;

import it.smartolivemill.kpidashboard.model.EconomicParameter;
import it.smartolivemill.kpidashboard.repository.EconomicParameterRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Gestisce le operazioni sui parametri economici.
@Service
public class EconomicParameterService {

    private final EconomicParameterRepository economicParameterRepository;

    public EconomicParameterService(EconomicParameterRepository economicParameterRepository) {
        this.economicParameterRepository = economicParameterRepository;
    }

    public List<EconomicParameter> findAll() {
        return economicParameterRepository.findAll();
    }

    public Optional<EconomicParameter> findById(Long id) {
        return economicParameterRepository.findById(id);
    }

    public EconomicParameter save(EconomicParameter economicParameter) {
        return economicParameterRepository.save(economicParameter);
    }

    public void delete(Long id) {
        economicParameterRepository.deleteById(id);
    }
}

package it.smartolivemill.kpidashboard.service;

import it.smartolivemill.kpidashboard.model.DailyProduction;
import it.smartolivemill.kpidashboard.repository.DailyProductionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Gestisce le operazioni sulla produzione giornaliera.
@Service
public class DailyProductionService {

    private final DailyProductionRepository dailyProductionRepository;

    public DailyProductionService(DailyProductionRepository dailyProductionRepository) {
        this.dailyProductionRepository = dailyProductionRepository;
    }

    public List<DailyProduction> findAll() {
        return dailyProductionRepository.findAll();
    }

    public Optional<DailyProduction> findById(Long id) {
        return dailyProductionRepository.findById(id);
    }

    public DailyProduction save(DailyProduction dailyProduction) {
        return dailyProductionRepository.save(dailyProduction);
    }

    public void delete(Long id) {
        dailyProductionRepository.deleteById(id);
    }
}

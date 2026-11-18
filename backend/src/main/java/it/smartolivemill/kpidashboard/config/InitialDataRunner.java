package it.smartolivemill.kpidashboard.config;

import it.smartolivemill.kpidashboard.repository.DailyProductionRepository;
import it.smartolivemill.kpidashboard.service.KpiService;
import it.smartolivemill.kpidashboard.service.SimulatedDataGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

// Eseguito una volta all'avvio dell'applicazione: se daily_production è vuota
// genera la campagna simulata (seed 2026) e salva i KPI, come POST /api/simulation/generate.
// Se il database contiene già dati non li modifica.
@Component
public class InitialDataRunner implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(InitialDataRunner.class);
    private static final long DEFAULT_SEED = 2026;

    private final DailyProductionRepository dailyProductionRepository;
    private final SimulatedDataGenerator simulatedDataGenerator;
    private final KpiService kpiService;

    public InitialDataRunner(DailyProductionRepository dailyProductionRepository,
                             SimulatedDataGenerator simulatedDataGenerator,
                             KpiService kpiService) {
        this.dailyProductionRepository = dailyProductionRepository;
        this.simulatedDataGenerator = simulatedDataGenerator;
        this.kpiService = kpiService;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (dailyProductionRepository.count() > 0) {
            log.info("Database già popolato: generazione iniziale saltata");
            return;
        }
        simulatedDataGenerator.generateCampaign(DEFAULT_SEED);
        kpiService.saveCampaignKpis();
        log.info("Database vuoto: campagna simulata generata con seed {}", DEFAULT_SEED);
    }
}

package it.smartolivemill.kpidashboard.controller;

import it.smartolivemill.kpidashboard.service.KpiService;
import it.smartolivemill.kpidashboard.service.SimulatedDataGenerator;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

// Avvia la generazione dei dati simulati della campagna.
@RestController
@RequestMapping("/api/simulation")
public class SimulationController {

    private final SimulatedDataGenerator simulatedDataGenerator;
    private final KpiService kpiService;

    public SimulationController(SimulatedDataGenerator simulatedDataGenerator, KpiService kpiService) {
        this.simulatedDataGenerator = simulatedDataGenerator;
        this.kpiService = kpiService;
    }

    // Sostituisce i dati di produzione, fermi e sottoprodotti con una nuova campagna simulata
    // e salva nella tabella kpi gli indicatori calcolati sui nuovi dati.
    @PostMapping("/generate")
    public SimulatedDataGenerator.GenerationSummary generate(
            @RequestParam(defaultValue = "2026") long seed) {
        SimulatedDataGenerator.GenerationSummary summary = simulatedDataGenerator.generateCampaign(seed);
        kpiService.saveCampaignKpis();
        return summary;
    }
}

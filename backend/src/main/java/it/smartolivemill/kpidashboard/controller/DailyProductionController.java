package it.smartolivemill.kpidashboard.controller;

import it.smartolivemill.kpidashboard.model.DailyProduction;
import it.smartolivemill.kpidashboard.service.DailyProductionService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

// Espone la produzione giornaliera per i grafici dell'andamento della campagna.
@RestController
@RequestMapping("/api/production")
public class DailyProductionController {

    private final DailyProductionService dailyProductionService;

    public DailyProductionController(DailyProductionService dailyProductionService) {
        this.dailyProductionService = dailyProductionService;
    }

    // Righe ordinate per data e poi per macchina
    @GetMapping
    public List<DailyProduction> getProduction() {
        return dailyProductionService.findAll().stream()
                .sorted(Comparator.comparing(DailyProduction::getDate)
                        .thenComparing(row -> row.getMachine().getName()))
                .toList();
    }
}

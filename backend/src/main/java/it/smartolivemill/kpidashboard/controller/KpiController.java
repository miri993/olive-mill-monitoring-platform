package it.smartolivemill.kpidashboard.controller;

import it.smartolivemill.kpidashboard.model.Kpi;
import it.smartolivemill.kpidashboard.service.KpiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Espone i KPI calcolati alla dashboard tramite API REST
@RestController
@RequestMapping("/api/kpi")
public class KpiController {

    private final KpiService kpiService;

    public KpiController(KpiService kpiService) {
        this.kpiService = kpiService;
    }

    // Restituisce i KPI aggregati sull'intera campagna olearia
    @GetMapping("/campaign")
    public KpiService.CampaignKpiSummary getCampaignKpis() {
        return kpiService.calculateCampaignKpis();
    }

    // Restituisce i KPI giorno per giorno per i grafici dell'andamento
    @GetMapping("/daily")
    public List<KpiService.DailyKpi> getDailyKpis() {
        return kpiService.calculateDailyKpis();
    }

    // Restituisce gli indicatori salvati nella tabella kpi
    @GetMapping
    public List<Kpi> getSavedKpis() {
        return kpiService.findAll();
    }

    // Ricalcola i KPI sui dati attuali e li salva (utile dopo aver cambiato un parametro economico)
    @PostMapping("/campaign")
    public List<Kpi> saveCampaignKpis() {
        return kpiService.saveCampaignKpis();
    }
}

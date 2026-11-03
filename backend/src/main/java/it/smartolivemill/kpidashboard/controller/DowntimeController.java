package it.smartolivemill.kpidashboard.controller;

import it.smartolivemill.kpidashboard.model.Downtime;
import it.smartolivemill.kpidashboard.service.DowntimeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

// Espone i fermi macchina con la loro causa.
@RestController
@RequestMapping("/api/downtimes")
public class DowntimeController {

    private final DowntimeService downtimeService;

    public DowntimeController(DowntimeService downtimeService) {
        this.downtimeService = downtimeService;
    }

    // Fermi ordinati per data e ora di inizio
    @GetMapping
    public List<Downtime> getDowntimes() {
        return downtimeService.findAll().stream()
                .sorted(Comparator.comparing(Downtime::getDate)
                        .thenComparing(Downtime::getStartTime,
                                Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }
}

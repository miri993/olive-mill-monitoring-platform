package it.smartolivemill.kpidashboard.controller;

import it.smartolivemill.kpidashboard.model.ByProduct;
import it.smartolivemill.kpidashboard.service.ByProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Comparator;
import java.util.List;

// Espone i sottoprodotti (sansa umida) con destinazione e kg recuperati.
@RestController
@RequestMapping("/api/by-products")
public class ByProductController {

    private final ByProductService byProductService;

    public ByProductController(ByProductService byProductService) {
        this.byProductService = byProductService;
    }

    // Righe ordinate per data
    @GetMapping
    public List<ByProduct> getByProducts() {
        return byProductService.findAll().stream()
                .sorted(Comparator.comparing(ByProduct::getDate))
                .toList();
    }
}

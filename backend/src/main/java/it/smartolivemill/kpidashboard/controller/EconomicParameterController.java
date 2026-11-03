package it.smartolivemill.kpidashboard.controller;

import it.smartolivemill.kpidashboard.model.EconomicParameter;
import it.smartolivemill.kpidashboard.service.EconomicParameterService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Espone i parametri economici e permette di modificarne il valore (es. prezzo olio).
@RestController
@RequestMapping("/api/parameters")
public class EconomicParameterController {

    private final EconomicParameterService economicParameterService;

    public EconomicParameterController(EconomicParameterService economicParameterService) {
        this.economicParameterService = economicParameterService;
    }

    @GetMapping
    public List<EconomicParameter> getParameters() {
        return economicParameterService.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<EconomicParameter> updateValue(@PathVariable Long id,
                                                         @Valid @RequestBody ValueRequest request) {
        return economicParameterService.findById(id)
                .map(parameter -> {
                    parameter.setValue(request.value());
                    return ResponseEntity.ok(economicParameterService.save(parameter));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public record ValueRequest(@NotNull @PositiveOrZero Double value) {
    }
}

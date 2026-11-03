package it.smartolivemill.kpidashboard.controller;

import it.smartolivemill.kpidashboard.model.Machine;
import it.smartolivemill.kpidashboard.service.MachineService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Espone l'elenco delle macchine della linea.
@RestController
@RequestMapping("/api/machines")
public class MachineController {

    private final MachineService machineService;

    public MachineController(MachineService machineService) {
        this.machineService = machineService;
    }

    @GetMapping
    public List<Machine> getMachines() {
        return machineService.findAll();
    }
}

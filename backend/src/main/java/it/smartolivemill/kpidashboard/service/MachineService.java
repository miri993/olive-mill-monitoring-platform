package it.smartolivemill.kpidashboard.service;

import it.smartolivemill.kpidashboard.model.Machine;
import it.smartolivemill.kpidashboard.repository.MachineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Gestisce le operazioni sulle macchine.
@Service
public class MachineService {

    private final MachineRepository machineRepository;

    public MachineService(MachineRepository machineRepository) {
        this.machineRepository = machineRepository;
    }

    public List<Machine> findAll() {
        return machineRepository.findAll();
    }

    public Optional<Machine> findById(Long id) {
        return machineRepository.findById(id);
    }

    public Machine save(Machine machine) {
        return machineRepository.save(machine);
    }

    public void delete(Long id) {
        machineRepository.deleteById(id);
    }
}

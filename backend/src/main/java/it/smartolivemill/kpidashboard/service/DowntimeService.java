package it.smartolivemill.kpidashboard.service;

import it.smartolivemill.kpidashboard.model.Downtime;
import it.smartolivemill.kpidashboard.repository.DowntimeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Gestisce le operazioni sui fermi macchina.
@Service
public class DowntimeService {

    private final DowntimeRepository downtimeRepository;

    public DowntimeService(DowntimeRepository downtimeRepository) {
        this.downtimeRepository = downtimeRepository;
    }

    public List<Downtime> findAll() {
        return downtimeRepository.findAll();
    }

    public Optional<Downtime> findById(Long id) {
        return downtimeRepository.findById(id);
    }

    public Downtime save(Downtime downtime) {
        return downtimeRepository.save(downtime);
    }

    public void delete(Long id) {
        downtimeRepository.deleteById(id);
    }
}

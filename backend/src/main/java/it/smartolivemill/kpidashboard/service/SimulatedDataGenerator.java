package it.smartolivemill.kpidashboard.service;

import it.smartolivemill.kpidashboard.model.ByProduct;
import it.smartolivemill.kpidashboard.model.DailyProduction;
import it.smartolivemill.kpidashboard.model.Downtime;
import it.smartolivemill.kpidashboard.model.EconomicParameter;
import it.smartolivemill.kpidashboard.model.Machine;
import it.smartolivemill.kpidashboard.repository.ByProductRepository;
import it.smartolivemill.kpidashboard.repository.DailyProductionRepository;
import it.smartolivemill.kpidashboard.repository.DowntimeRepository;
import it.smartolivemill.kpidashboard.repository.EconomicParameterRepository;
import it.smartolivemill.kpidashboard.repository.MachineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

// Genera i dati simulati della campagna olearia (15 ottobre - 15 dicembre 2025).
// Rendimento 85-95%, resa in olio 12-18%, olio declassato 0-5%,
// sansa 75-80 kg ogni 100 kg di olive, sottoprodotti recuperati 90-98%.
@Service
public class SimulatedDataGenerator {

    public static final LocalDate CAMPAIGN_START = LocalDate.of(2025, 10, 15);
    public static final LocalDate CAMPAIGN_END = LocalDate.of(2025, 12, 15);

    private static final String FRANGITORE = "Frangitore";
    private static final String DECANTER = "Decanter 2 fasi";
    private static final double OIL_DENSITY_KG_L = 0.916;
    private static final LocalTime SHIFT_START = LocalTime.of(8, 0);
    private static final String[] DESTINATIONS = {"biogas", "compost", "sansificio"};

    // Cause di fermo: probabilità giornaliera e durata minima/massima in minuti
    private record DowntimeRule(String cause, double probability, int minMinutes, int maxMinutes) {
    }

    private static final List<DowntimeRule> FRANGITORE_RULES = List.of(
            new DowntimeRule("Pulizia griglia", 0.80, 15, 25),
            new DowntimeRule("Olive finite / attesa conferimento", 0.55, 30, 110),
            new DowntimeRule("Usura martelli", 0.08, 30, 60),
            new DowntimeRule("Guasto elettrico", 0.02, 60, 120));

    private static final List<DowntimeRule> DECANTER_RULES = List.of(
            new DowntimeRule("Pulizia fine turno", 1.00, 25, 40),
            new DowntimeRule("Coclea intasata", 0.12, 30, 60),
            new DowntimeRule("Vibrazioni / manutenzione", 0.02, 60, 120));

    private final MachineRepository machineRepository;
    private final EconomicParameterRepository economicParameterRepository;
    private final DailyProductionRepository dailyProductionRepository;
    private final DowntimeRepository downtimeRepository;
    private final ByProductRepository byProductRepository;

    public SimulatedDataGenerator(MachineRepository machineRepository,
                                  EconomicParameterRepository economicParameterRepository,
                                  DailyProductionRepository dailyProductionRepository,
                                  DowntimeRepository downtimeRepository,
                                  ByProductRepository byProductRepository) {
        this.machineRepository = machineRepository;
        this.economicParameterRepository = economicParameterRepository;
        this.dailyProductionRepository = dailyProductionRepository;
        this.downtimeRepository = downtimeRepository;
        this.byProductRepository = byProductRepository;
    }

    // Cancella produzione, fermi e sottoprodotti e li rigenera per tutta la campagna.
    // Lo stesso seed produce sempre gli stessi dati (risultati riproducibili).
    @Transactional
    public GenerationSummary generateCampaign(long seed) {
        Random random = new Random(seed);
        Machine frangitore = findOrCreateMachine(FRANGITORE, 30.0, 3000.0);
        Machine decanter = findOrCreateMachine(DECANTER, 37.0, 3000.0);
        createMissingEconomicParameters();

        downtimeRepository.deleteAllInBatch();
        dailyProductionRepository.deleteAllInBatch();
        byProductRepository.deleteAllInBatch();

        List<DailyProduction> productionRows = new ArrayList<>();
        List<Downtime> downtimeRows = new ArrayList<>();
        List<ByProduct> byProductRows = new ArrayList<>();
        long totalDays = ChronoUnit.DAYS.between(CAMPAIGN_START, CAMPAIGN_END);

        for (LocalDate date = CAMPAIGN_START; !date.isAfter(CAMPAIGN_END); date = date.plusDays(1)) {
            // Andamento a campana: 0 a inizio e fine campagna, 1 a metà
            double progress = (double) ChronoUnit.DAYS.between(CAMPAIGN_START, date) / totalDays;
            double peak = Math.sin(Math.PI * progress);

            double plannedHours = plannedHours(date, peak, random);

            List<Downtime> frangitoreDowntimes = downtimes(date, frangitore, FRANGITORE_RULES, plannedHours, random);
            List<Downtime> decanterDowntimes = downtimes(date, decanter, DECANTER_RULES, plannedHours, random);
            downtimeRows.addAll(frangitoreDowntimes);
            downtimeRows.addAll(decanterDowntimes);

            double frangitoreWorkedHours = round(plannedHours - totalHours(frangitoreDowntimes), 2);
            double decanterWorkedHours = round(plannedHours - totalHours(decanterDowntimes), 2);

            // Il frangitore lavora all'85-95% della capacità, il decanter lavora la stessa pasta
            double processedKg = Math.round(frangitoreWorkedHours * frangitore.getCapacityKgH()
                    * between(random, 0.85, 0.95));

            DailyProduction frangitoreRow = productionRow(date, frangitore, plannedHours,
                    frangitoreWorkedHours, processedKg, random);
            productionRows.add(frangitoreRow);

            DailyProduction decanterRow = productionRow(date, decanter, plannedHours,
                    decanterWorkedHours, processedKg, random);
            double oilYieldPct = round(Math.min(18, Math.max(12, 12 + 6 * peak + between(random, -0.5, 0.5))), 2);
            double oilKg = round(processedKg * oilYieldPct / 100, 1);
            double oilLiters = round(oilKg / OIL_DENSITY_KG_L, 1);
            double wetPomaceKg = Math.round(processedKg * between(random, 0.75, 0.80));
            decanterRow.setOilYieldPct(oilYieldPct);
            decanterRow.setOilKg(oilKg);
            decanterRow.setOilLiters(oilLiters);
            decanterRow.setWetPomaceKg(wetPomaceKg);
            decanterRow.setDowngradedOilLiters(round(oilLiters * between(random, 0.0, 0.05), 1));
            productionRows.add(decanterRow);

            ByProduct byProduct = new ByProduct();
            byProduct.setDate(date);
            byProduct.setWetPomaceKg(wetPomaceKg);
            byProduct.setDestination(DESTINATIONS[random.nextInt(DESTINATIONS.length)]);
            byProduct.setRecoveredKg((double) Math.round(wetPomaceKg * between(random, 0.90, 0.98)));
            byProductRows.add(byProduct);
        }

        dailyProductionRepository.saveAll(productionRows);
        downtimeRepository.saveAll(downtimeRows);
        byProductRepository.saveAll(byProductRows);

        return new GenerationSummary(seed, CAMPAIGN_START, CAMPAIGN_END,
                productionRows.size(), downtimeRows.size(), byProductRows.size());
    }

    // Turni di 8-12 ore, più lunghi a metà campagna. La domenica 6-8 ore
    private double plannedHours(LocalDate date, double peak, Random random) {
        if (date.getDayOfWeek() == DayOfWeek.SUNDAY) {
            return roundToHalf(between(random, 6, 8));
        }
        double hours = 8 + 4 * peak + between(random, -1, 1);
        return roundToHalf(Math.min(12, Math.max(8, hours)));
    }

    // Per ogni causa decide se il fermo avviene, quanto dura e a che ora inizia
    private List<Downtime> downtimes(LocalDate date, Machine machine, List<DowntimeRule> rules,
                                     double plannedHours, Random random) {
        List<Downtime> result = new ArrayList<>();
        for (DowntimeRule rule : rules) {
            if (random.nextDouble() >= rule.probability()) {
                continue;
            }
            int minutes = rule.minMinutes() + random.nextInt(rule.maxMinutes() - rule.minMinutes() + 1);
            int latestStart = Math.max(0, (int) (plannedHours * 60) - minutes);
            Downtime downtime = new Downtime();
            downtime.setDate(date);
            downtime.setMachine(machine);
            downtime.setStartTime(SHIFT_START.plusMinutes(random.nextInt(latestStart + 1)));
            downtime.setDurationHours(minutes / 60.0);
            downtime.setCause(rule.cause());
            result.add(downtime);
        }
        return result;
    }

    // Riga di produzione di una macchina (kWh = ore lavorate x potenza x carico 80-90%)
    private DailyProduction productionRow(LocalDate date, Machine machine, double plannedHours,
                                          double workedHours, double processedKg, Random random) {
        DailyProduction row = new DailyProduction();
        row.setDate(date);
        row.setMachine(machine);
        row.setPlannedHours(plannedHours);
        row.setWorkedHours(workedHours);
        row.setProcessedKg(processedKg);
        row.setKwh(round(workedHours * machine.getPowerKw() * between(random, 0.80, 0.90), 1));
        return row;
    }

    private Machine findOrCreateMachine(String name, double powerKw, double capacityKgH) {
        return machineRepository.findByName(name)
                .orElseGet(() -> machineRepository.save(new Machine(name, powerKw, capacityKgH)));
    }

    // Crea i parametri economici stimati solo se non sono già presenti nel database
    private void createMissingEconomicParameters() {
        Set<String> existing = economicParameterRepository.findAll().stream()
                .map(EconomicParameter::getName)
                .collect(Collectors.toSet());
        List<EconomicParameter> defaults = List.of(
                new EconomicParameter("Prezzo olio EVO", 9.5, "€/L"),
                new EconomicParameter("Costo energia elettrica", 0.25, "€/kWh"),
                new EconomicParameter("Costo manodopera", 18.0, "€/h per addetto"),
                new EconomicParameter("Addetti per turno", 3.0, "n."),
                new EconomicParameter("Fattore emissione rete Puglia", 376.9, "gCO2/kWh"),
                new EconomicParameter("Densità olio", OIL_DENSITY_KG_L, "kg/L"));
        economicParameterRepository.saveAll(defaults.stream()
                .filter(parameter -> !existing.contains(parameter.getName()))
                .toList());
    }

    private double totalHours(List<Downtime> downtimes) {
        return downtimes.stream().mapToDouble(Downtime::getDurationHours).sum();
    }

    private double between(Random random, double min, double max) {
        return min + (max - min) * random.nextDouble();
    }

    private double roundToHalf(double value) {
        return Math.round(value * 2) / 2.0;
    }

    private double round(double value, int scale) {
        return BigDecimal.valueOf(value).setScale(scale, RoundingMode.HALF_UP).doubleValue();
    }

    public record GenerationSummary(
        long seed,
        LocalDate from,
        LocalDate to,
        int productionRows,
        int downtimeRows,
        int byProductRows) {
    }
}

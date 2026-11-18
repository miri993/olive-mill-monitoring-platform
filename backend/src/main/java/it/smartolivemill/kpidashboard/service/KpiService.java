package it.smartolivemill.kpidashboard.service;

import it.smartolivemill.kpidashboard.model.Kpi;
import it.smartolivemill.kpidashboard.model.ByProduct;
import it.smartolivemill.kpidashboard.model.DailyProduction;
import it.smartolivemill.kpidashboard.model.Downtime;
import it.smartolivemill.kpidashboard.model.EconomicParameter;
import it.smartolivemill.kpidashboard.model.Machine;
import it.smartolivemill.kpidashboard.repository.ByProductRepository;
import it.smartolivemill.kpidashboard.repository.DailyProductionRepository;
import it.smartolivemill.kpidashboard.repository.DowntimeRepository;
import it.smartolivemill.kpidashboard.repository.EconomicParameterRepository;
import it.smartolivemill.kpidashboard.repository.KpiRepository;
import it.smartolivemill.kpidashboard.repository.MachineRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.TreeMap;
import java.util.stream.Collectors;

// Gestisce i KPI registrati e calcola quelli aggregati sull'intera campagna.
@Service
public class KpiService {

    private static final String FRANGITORE = "Frangitore";
    private static final String DECANTER = "Decanter 2 fasi";

    private final KpiRepository kpiRepository;
    private final DailyProductionRepository dailyProductionRepository;
    private final DowntimeRepository downtimeRepository;
    private final ByProductRepository byProductRepository;
    private final EconomicParameterRepository economicParameterRepository;
    private final MachineRepository machineRepository;

    public KpiService(KpiRepository kpiRepository,
                      DailyProductionRepository dailyProductionRepository,
                      DowntimeRepository downtimeRepository,
                      ByProductRepository byProductRepository,
                      EconomicParameterRepository economicParameterRepository,
                      MachineRepository machineRepository) {
        this.kpiRepository = kpiRepository;
        this.dailyProductionRepository = dailyProductionRepository;
        this.downtimeRepository = downtimeRepository;
        this.byProductRepository = byProductRepository;
        this.economicParameterRepository = economicParameterRepository;
        this.machineRepository = machineRepository;
    }

    public List<Kpi> findAll() {
        return kpiRepository.findAll();
    }

    public Optional<Kpi> findById(Long id) {
        return kpiRepository.findById(id);
    }

    public Kpi save(Kpi kpi) {
        return kpiRepository.save(kpi);
    }

    public void delete(Long id) {
        kpiRepository.deleteById(id);
    }

    // Calcola i KPI della campagna e li salva nella tabella kpi con la data del giorno corrente.
    // I valori precedenti vengono sostituiti perché si riferiscono ai dati della campagna precedente.
    @Transactional
    public List<Kpi> saveCampaignKpis() {
        CampaignKpiSummary summary = calculateCampaignKpis();
        Machine frangitore = requiredMachine(FRANGITORE);
        Machine decanter = requiredMachine(DECANTER);
        LocalDate today = LocalDate.now();

        List<Kpi> kpis = new ArrayList<>();
        kpis.add(new Kpi(today, "OEE (%)", frangitore, summary.oeeFrangitorePct()));
        kpis.add(new Kpi(today, "OEE (%)", decanter, summary.oeeDecanterPct()));
        kpis.add(new Kpi(today, "Qualità (%)", null, summary.qualityPct()));
        kpis.add(new Kpi(today, "OEE linea (%)", null, summary.lineOeePct()));
        kpis.add(new Kpi(today, "Costo orario fermo (€/h)", null, summary.hourlyDowntimeCostEur()));
        kpis.add(new Kpi(today, "Costo fermi (€)", frangitore, summary.frangitoreDowntimeCostEur()));
        kpis.add(new Kpi(today, "Costo fermi (€)", decanter, summary.decanterDowntimeCostEur()));
        kpis.add(new Kpi(today, "CO2 per litro (g/L)", null, summary.co2GramsPerLiter()));
        kpis.add(new Kpi(today, "CO2 totale (kg)", null, summary.co2TotalKg()));
        kpis.add(new Kpi(today, "Sottoprodotti recuperati (%)", null, summary.recoveredByProductPct()));

        kpiRepository.deleteAllInBatch();
        return kpiRepository.saveAll(kpis);
    }

    // KPI dell'intera campagna, calcolati sui totali dei 62 giorni e non come media dei giorni
    @Transactional(readOnly = true)
    public CampaignKpiSummary calculateCampaignKpis() {
        List<DailyProduction> production = dailyProductionRepository.findAll();
        ProductionTotals frangitore = totalsFor(production, FRANGITORE);
        ProductionTotals decanter = totalsFor(production, DECANTER);

        double oeeFrangitore = calculateOee(frangitore);
        double oeeDecanter = calculateOee(decanter);

        double oilLiters = production.stream()
                .mapToDouble(row -> valueOrZero(row.getOilLiters()))
                .sum();
        double downgradedOilLiters = production.stream()
                .mapToDouble(row -> valueOrZero(row.getDowngradedOilLiters()))
                .sum();
        requirePositive(oilLiters, "Litri di olio totali");
        // Qualità: quota di olio non declassato sul totale prodotto
        double quality = (oilLiters - downgradedOilLiters) / oilLiters;
        // OEE di linea = OEE del decanter (ultima macchina) x qualità dell'olio
        double lineOee = oeeDecanter * quality;

        Map<String, Double> parameters = new HashMap<>();
        for (EconomicParameter parameter : economicParameterRepository.findAll()) {
            parameters.put(parameter.getName(), parameter.getValue());
        }
        // Costo di un'ora di fermo = olio non prodotto in un'ora x prezzo + costo del personale fermo
        double hourlyDowntimeCost = (oilLiters / decanter.workedHours)
                * requiredParameter(parameters, "Prezzo olio EVO")
                + requiredParameter(parameters, "Costo manodopera")
                * requiredParameter(parameters, "Addetti per turno");

        List<Downtime> downtimes = downtimeRepository.findAll();
        double frangitoreDowntimeCost = calculateDowntimeCost(downtimes, FRANGITORE, hourlyDowntimeCost);
        double decanterDowntimeCost = calculateDowntimeCost(downtimes, DECANTER, hourlyDowntimeCost);

        double totalKwh = production.stream()
                .mapToDouble(row -> valueOrZero(row.getKwh()))
                .sum();
        double emissionFactor = requiredParameter(parameters, "Fattore emissione rete Puglia");
        // CO2 per litro = kWh / litri x fattore di emissione della rete pugliese (gCO2/kWh)
        double co2GramsPerLiter = totalKwh / oilLiters * emissionFactor;
        double co2TotalKg = totalKwh * emissionFactor / 1000;

        List<ByProduct> byProducts = byProductRepository.findAll();
        double wetPomaceKg = byProducts.stream()
                .mapToDouble(row -> valueOrZero(row.getWetPomaceKg()))
                .sum();
        requirePositive(wetPomaceKg, "I kg totali di sansa umida");
        // Quota di sansa recuperata sul totale prodotto
        double recoveredByProduct = byProducts.stream()
                .mapToDouble(row -> valueOrZero(row.getRecoveredKg()))
                .sum() / wetPomaceKg;

        return new CampaignKpiSummary(
                percentage(oeeFrangitore),
                percentage(oeeDecanter),
                percentage(quality),
                percentage(lineOee),
                round(hourlyDowntimeCost, 2),
                round(frangitoreDowntimeCost, 2),
                round(decanterDowntimeCost, 2),
                round(co2GramsPerLiter, 2),
                round(co2TotalKg, 0),
                percentage(recoveredByProduct));
    }

    // KPI giorno per giorno, per i grafici dell'andamento nel tempo.
    // Il costo orario del fermo è quello medio della campagna, così i giorni sono confrontabili.
    @Transactional(readOnly = true)
    public List<DailyKpi> calculateDailyKpis() {
        double hourlyDowntimeCost = calculateCampaignKpis().hourlyDowntimeCostEur();
        double emissionFactor = requiredParameter(loadParameters(), "Fattore emissione rete Puglia");

        Map<LocalDate, List<DailyProduction>> productionByDay = dailyProductionRepository.findAll().stream()
                .collect(Collectors.groupingBy(DailyProduction::getDate, TreeMap::new, Collectors.toList()));
        Map<LocalDate, Double> downtimeHoursByDay = downtimeRepository.findAll().stream()
                .collect(Collectors.groupingBy(Downtime::getDate,
                        Collectors.summingDouble(row -> valueOrZero(row.getDurationHours()))));
        Map<LocalDate, List<ByProduct>> byProductsByDay = byProductRepository.findAll().stream()
                .collect(Collectors.groupingBy(ByProduct::getDate));

        List<DailyKpi> result = new ArrayList<>();
        for (Map.Entry<LocalDate, List<DailyProduction>> day : productionByDay.entrySet()) {
            List<DailyProduction> rows = day.getValue();
            DailyProduction frangitore = rowFor(rows, FRANGITORE);
            DailyProduction decanter = rowFor(rows, DECANTER);

            double oilLiters = rows.stream().mapToDouble(row -> valueOrZero(row.getOilLiters())).sum();
            double downgradedLiters = rows.stream().mapToDouble(row -> valueOrZero(row.getDowngradedOilLiters())).sum();
            double kwh = rows.stream().mapToDouble(row -> valueOrZero(row.getKwh())).sum();
            double quality = oilLiters > 0 ? (oilLiters - downgradedLiters) / oilLiters : 0;
            double oeeDecanter = dailyOee(decanter);
            double downtimeHours = downtimeHoursByDay.getOrDefault(day.getKey(), 0.0);

            List<ByProduct> byProducts = byProductsByDay.getOrDefault(day.getKey(), List.of());
            double wetPomaceKg = byProducts.stream().mapToDouble(row -> valueOrZero(row.getWetPomaceKg())).sum();
            double recoveredKg = byProducts.stream().mapToDouble(row -> valueOrZero(row.getRecoveredKg())).sum();

            result.add(new DailyKpi(
                    day.getKey(),
                    frangitore == null ? 0 : valueOrZero(frangitore.getProcessedKg()),
                    round(oilLiters, 1),
                    round(kwh, 1),
                    percentage(dailyOee(frangitore)),
                    percentage(oeeDecanter),
                    percentage(oeeDecanter * quality),
                    oilLiters > 0 ? percentage(downgradedLiters / oilLiters) : 0,
                    oilLiters > 0 ? round(kwh / oilLiters * emissionFactor, 2) : 0,
                    round(downtimeHours, 2),
                    round(downtimeHours * hourlyDowntimeCost, 2),
                    wetPomaceKg > 0 ? percentage(recoveredKg / wetPomaceKg) : 0));
        }
        return result;
    }

    // Riga di produzione di una macchina in un giorno
    private DailyProduction rowFor(List<DailyProduction> rows, String machineName) {
        return rows.stream()
                .filter(row -> row.getMachine() != null && machineName.equals(row.getMachine().getName()))
                .findFirst()
                .orElse(null);
    }

    // OEE di un singolo giorno: disponibilità x prestazione; 0 se mancano i dati
    private double dailyOee(DailyProduction row) {
        if (row == null || valueOrZero(row.getPlannedHours()) <= 0 || valueOrZero(row.getWorkedHours()) <= 0
                || row.getMachine().getCapacityKgH() == null) {
            return 0;
        }
        double availability = row.getWorkedHours() / row.getPlannedHours();
        double performance = valueOrZero(row.getProcessedKg())
                / (row.getWorkedHours() * row.getMachine().getCapacityKgH());
        return availability * performance;
    }

    // Legge i parametri economici dal database (nome -> valore)
    private Map<String, Double> loadParameters() {
        Map<String, Double> parameters = new HashMap<>();
        for (EconomicParameter parameter : economicParameterRepository.findAll()) {
            parameters.put(parameter.getName(), parameter.getValue());
        }
        return parameters;
    }

    // Somma ore previste, ore lavorate e kg di una macchina su tutta la campagna
    private ProductionTotals totalsFor(List<DailyProduction> production, String machineName) {
        List<DailyProduction> rows = production.stream()
                .filter(row -> row.getMachine() != null
                        && machineName.equals(row.getMachine().getName()))
                .toList();
        if (rows.isEmpty()) {
            throw new IllegalStateException("Nessun dato di produzione trovato per " + machineName);
        }

        Machine machine = rows.getFirst().getMachine();
        double plannedHours = rows.stream().mapToDouble(row -> valueOrZero(row.getPlannedHours())).sum();
        double workedHours = rows.stream().mapToDouble(row -> valueOrZero(row.getWorkedHours())).sum();
        double processedKg = rows.stream().mapToDouble(row -> valueOrZero(row.getProcessedKg())).sum();
        double capacityKgH = valueOrZero(machine.getCapacityKgH());
        requirePositive(plannedHours, "Le ore pianificate per " + machineName);
        requirePositive(workedHours, "Le ore lavorate per " + machineName);
        requirePositive(capacityKgH, "La capacità nominale per " + machineName);

        return new ProductionTotals(plannedHours, workedHours, processedKg, capacityKgH);
    }

    // OEE di una macchina = disponibilità x prestazioni (la qualità si applica solo alla linea)
    private double calculateOee(ProductionTotals totals) {
        // Disponibilità: ore lavorate / ore previste
        double availability = totals.workedHours / totals.plannedHours;
        // Prestazioni: kg lavorati / kg lavorabili alla capacità nominale
        double performance = totals.processedKg / (totals.workedHours * totals.capacityKgH);
        return availability * performance;
    }

    // Costo dei fermi di una macchina = ore di fermo totali x costo orario
    private double calculateDowntimeCost(List<Downtime> downtimes,
                                         String machineName,
                                         double hourlyDowntimeCost) {
        double totalDowntimeHours = 0;
        for (Downtime downtime : downtimes) {
            if (downtime.getMachine() == null || downtime.getDurationHours() == null) {
                throw new IllegalStateException("Dati incompleti nei fermi macchina");
            }
            if (machineName.equals(downtime.getMachine().getName())) {
                totalDowntimeHours += downtime.getDurationHours();
            }
        }

        // Ore di fermo = minuti totali / 60 (la conversione avviene al caricamento), senza arrotondamenti intermedi.
        return totalDowntimeHours * hourlyDowntimeCost;
    }

    private Machine requiredMachine(String name) {
        return machineRepository.findByName(name)
                .orElseThrow(() -> new IllegalStateException("Macchina mancante: " + name));
    }

    // Errore esplicito se manca un parametro necessario al calcolo
    private double requiredParameter(Map<String, Double> parameters, String name) {
        Double value = parameters.get(name);
        if (value == null) {
            throw new IllegalStateException("Parametro economico mancante: " + name);
        }
        return value;
    }

    // Blocca le divisioni per zero quando mancano i dati
    private void requirePositive(double value, String description) {
        if (value <= 0) {
            throw new IllegalStateException(description + " devono essere maggiori di zero");
        }
    }

    // I valori mancanti (null) contano come zero
    private double valueOrZero(Double value) {
        return value == null ? 0 : value;
    }

    // Da rapporto a percentuale con due decimali
    private double percentage(double ratio) {
        return round(ratio * 100, 2);
    }

    // Arrotondamento con BigDecimal per evitare gli errori dei numeri in virgola mobile
    private double round(double value, int scale) {
        return BigDecimal.valueOf(value).setScale(scale, RoundingMode.HALF_UP).doubleValue();
    }

    // KPI di un giorno, restituiti da GET /api/kpi/daily
    public record DailyKpi(
        LocalDate date,
        double processedKg,
        double oilLiters,
        double kwh,
        double oeeFrangitorePct,
        double oeeDecanterPct,
        double lineOeePct,
        double downgradedOilPct,
        double co2GramsPerLiter,
        double downtimeHours,
        double downtimeCostEur,
        double recoveredByProductPct) {
    }

    // KPI di campagna, restituiti da GET /api/kpi/campaign
    public record CampaignKpiSummary(
        double oeeFrangitorePct,
        double oeeDecanterPct,
        double qualityPct,
        double lineOeePct,
        double hourlyDowntimeCostEur,
        double frangitoreDowntimeCostEur,
        double decanterDowntimeCostEur,
        double co2GramsPerLiter,
        double co2TotalKg,
        double recoveredByProductPct) {
    }

    // Totali di campagna di una macchina, usati per l'OEE
    private record ProductionTotals(
        double plannedHours,
        double workedHours,
        double processedKg,
        double capacityKgH) {
    }
}

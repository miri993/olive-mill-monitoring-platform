import Alert from '@mui/material/Alert'
import DailyLineChart from '../../../components/DailyLineChart/DailyLineChart'
import SemiCircleChart from '../../../components/SemiCircleChart/SemiCircleChart'
import KpiCard from '../../../components/KpiCard/KpiCard'
import Panel from '../../../components/Panel/Panel'
import { useAppSelector } from '../../../store/hooks'
import { colors } from '../../../styles/variables'
import { formatNumber } from '../../../utils/format'
import SectionHeader from '../../../components/SectionHeader/SectionHeader'
import './DashboardSections.css'

// Sezione "Panoramica": KPI principali della campagna e andamento OEE
export default function OverviewSection() {
  // I KPI arrivano dallo store: HomePage li carica una sola volta con
  // dispatch(fetchCampaignKpis()) e dispatch(fetchDailyKpis())
  const { campaign, campaignStatus, daily } = useAppSelector((state) => state.kpi)

  // Il back end restituisce il costo dei fermi per macchina: la card mostra la somma
  const totalDowntimeCost = campaign ? campaign.frangitoreDowntimeCostEur + campaign.decanterDowntimeCostEur : 0
  // Finché i dati non sono arrivati la card mostra un trattino
  const show = (text: string) => (campaign ? text : '—')

  return (
    <section className="dashboard-section">
      <SectionHeader title="Panoramica" intro="Gli indicatori principali dell'intera campagna olearia." />

      {/* campaignStatus 'failed': il back end non ha risposto */}
      {campaignStatus === 'failed' && (
        <Alert severity="error">Impossibile caricare i dati: controlla che il back end sia avviato.</Alert>
      )}

      {/* KpiCard riceve label, valore già formattato e il testo info mostrato nel Tooltip della «i» */}
      <div className="kpi-grid">
        <KpiCard label="OEE linea" value={show(`${formatNumber(campaign?.lineOeePct ?? 0, 1)} %`)}
          info="Efficienza complessiva della linea: disponibilità × prestazioni × qualità." />
        <KpiCard label="Costo fermi" value={show(`${formatNumber(totalDowntimeCost)} €`)}
          info="Valore della produzione persa durante i fermi di frangitore e decanter a due fasi." />
        <KpiCard label="CO₂ per litro" value={show(`${formatNumber(campaign?.co2GramsPerLiter ?? 0, 1)} g/L`)}
          info="Grammi di CO₂ dovuti all'energia elettrica consumata per ogni litro di olio." />
        <KpiCard label="Sottoprodotti recuperati" value={show(`${formatNumber(campaign?.recoveredByProductPct ?? 0, 1)} %`)}
          info="Quota di sansa e acque di vegetazione destinata a riutilizzo." />
      </div>

      <div className="panel-grid">
        <Panel title="OEE linea">
          {campaign && (
            <>
              <SemiCircleChart value={campaign.lineOeePct} label="OEE linea" />
              <dl className="value-list">
                <div><dt>OEE frangitore</dt><dd>{formatNumber(campaign.oeeFrangitorePct, 1)} %</dd></div>
                <div><dt>OEE decanter a due fasi</dt><dd>{formatNumber(campaign.oeeDecanterPct, 1)} %</dd></div>
                <div><dt>Qualità</dt><dd>{formatNumber(campaign.qualityPct, 1)} %</dd></div>
              </dl>
            </>
          )}
        </Panel>

        <Panel title="Andamento OEE giorno per giorno">
          <DailyLineChart data={daily} unit="%" yDomain={[0, 100]} lines={[
            { dataKey: 'lineOeePct', name: 'Linea', color: colors.oliveDark },
            { dataKey: 'oeeDecanterPct', name: 'Decanter a due fasi', color: colors.olive, dashed: true },
          ]} />
        </Panel>
      </div>
    </section>
  )
}

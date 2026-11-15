import { useEffect } from 'react'
import DailyLineChart from '../../../components/DailyLineChart/DailyLineChart'
import KpiCard from '../../../components/KpiCard/KpiCard'
import Panel from '../../../components/Panel/Panel'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { fetchByProducts } from '../../../store/slices/byProductSlice'
import { colors } from '../../../styles/variables'
import { formatNumber } from '../../../utils/format'
import './DashboardSections.css'

const destinationLabels: Record<string, string> = {
  biogas: 'Biogas',
  compost: 'Compost',
  sansificio: 'Sansificio',
}

// Sezione "Sostenibilità": energia, CO2 per litro e destinazione della sansa
export default function SustainabilitySection() {
  const campaign = useAppSelector((state) => state.kpi.campaign)
  const daily = useAppSelector((state) => state.kpi.daily)
  const byProducts = useAppSelector((state) => state.byProducts.items)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchByProducts())
  }, [dispatch])

  const totalKwh = daily.reduce((sum, day) => sum + day.kwh, 0)
  const totalPomaceKg = byProducts.reduce((sum, item) => sum + item.wetPomaceKg, 0)
  const show = (text: string) => (campaign && byProducts.length > 0 ? text : '—')

  // kg recuperati per destinazione: { biogas: 120000, compost: 80000, ... }
  const recoveredByDestination = byProducts.reduce<Record<string, number>>((totals, item) => {
    totals[item.destination] = (totals[item.destination] ?? 0) + item.recoveredKg
    return totals
  }, {})
  const totalRecoveredKg = Object.values(recoveredByDestination).reduce((sum, kg) => sum + kg, 0)

  return (
    <section className="dashboard-section">
      <div>
        <h1 className="dashboard-title">Sostenibilità</h1>
        <p className="dashboard-intro">Energia consumata, CO₂ emessa e quanta sansa viene recuperata.</p>
      </div>

      <div className="kpi-grid">
        <KpiCard label="Energia consumata" value={show(`${formatNumber(totalKwh)} kWh`)}
          info="Energia elettrica usata da frangitore e decanter a due fasi in tutta la campagna." />
        <KpiCard label="CO₂ per litro" value={show(`${formatNumber(campaign?.co2GramsPerLiter ?? 0, 1)} g/L`)}
          info="Grammi di CO₂ dovuti all'energia elettrica consumata per ogni litro di olio." />
        <KpiCard label="CO₂ totale" value={show(`${formatNumber(campaign?.co2TotalKg ?? 0)} kg`)}
          info="CO₂ emessa nell'intera campagna per l'energia elettrica consumata." />
        <KpiCard label="Sansa prodotta" value={show(`${formatNumber(totalPomaceKg)} kg`)} />
        <KpiCard label="Sottoprodotti recuperati" value={show(`${formatNumber(campaign?.recoveredByProductPct ?? 0, 1)} %`)}
          info="Quota di sansa destinata a riutilizzo (biogas, compost, sansificio)." />
      </div>

      <div className="panel-grid">
        <Panel title="Destinazione della sansa recuperata">
          <dl className="value-list">
            {Object.entries(recoveredByDestination).map(([destination, kg]) => (
              <div key={destination}>
                <dt>{destinationLabels[destination] ?? destination}</dt>
                <dd>{formatNumber(kg)} kg · {formatNumber((kg / totalRecoveredKg) * 100, 1)} %</dd>
              </div>
            ))}
          </dl>
        </Panel>

        <Panel title="CO₂ per litro giorno per giorno" subtitle="g/L">
          <DailyLineChart data={daily} unit="" lines={[
            { dataKey: 'co2GramsPerLiter', name: 'CO₂ per litro', color: colors.oliveDark },
          ]} />
        </Panel>
      </div>
    </section>
  )
}

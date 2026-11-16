import DailyBarChart from '../../../components/DailyBarChart/DailyBarChart'
import KpiCard from '../../../components/KpiCard/KpiCard'
import Panel from '../../../components/Panel/Panel'
import { useAppSelector } from '../../../store/hooks'
import { colors } from '../../../styles/variables'
import { formatNumber } from '../../../utils/format'
import SectionHeader from '../../../components/SectionHeader/SectionHeader'
import productionImage from '../../../assets/guglielmi-rotoballa.jpg'
import './DashboardSections.css'

// Sezione "Produzione": olive lavorate, olio prodotto e resa
export default function ProductionSection() {
  const daily = useAppSelector((state) => state.kpi.daily)

  const totalKg = daily.reduce((sum, day) => sum + day.processedKg, 0)
  const totalLiters = daily.reduce((sum, day) => sum + day.oilLiters, 0)
  const litersPerQuintal = totalKg > 0 ? (totalLiters / totalKg) * 100 : 0
  const show = (text: string) => (daily.length > 0 ? text : '—')

  return (
    <section className="dashboard-section">
      <SectionHeader title="Produzione" intro="Olive lavorate e olio prodotto durante la campagna, giorno per giorno."
        imageSrc={productionImage} imageAlt="Rotoballa di fieno accanto a un ulivo, con i trulli sullo sfondo" imageCredit="Foto di Mimmo Guglielmi, per gentile concessione" />

      <div className="kpi-grid">
        <KpiCard label="Olive lavorate" value={show(`${formatNumber(totalKg)} kg`)} />
        <KpiCard label="Olio prodotto" value={show(`${formatNumber(totalLiters)} L`)} />
        <KpiCard label="Litri per quintale" value={show(formatNumber(litersPerQuintal, 1))}
          info="Litri di olio ottenuti ogni 100 kg di olive lavorate." />
      </div>

      <Panel title="Olio prodotto giorno per giorno" subtitle="litri">
        <DailyBarChart data={daily} dataKey="oilLiters" name="Olio" unit="L" color={colors.olive} />
      </Panel>
    </section>
  )
}

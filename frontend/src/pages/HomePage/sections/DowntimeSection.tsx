import { useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import DailyBarChart from '../../../components/DailyBarChart/DailyBarChart'
import KpiCard from '../../../components/KpiCard/KpiCard'
import Panel from '../../../components/Panel/Panel'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { fetchDowntimes } from '../../../store/slices/downtimeSlice'
import { colors } from '../../../styles/variables'
import { formatNumber, formatShortDate } from '../../../utils/format'
import SectionHeader from '../../../components/SectionHeader/SectionHeader'
import downtimeImage from '../../../assets/guglielmi-neve.jpg'
import './DashboardSections.css'

// Sezione "Fermi": ore e costi dei fermi per macchina e per causa
export default function DowntimeSection() {
  const campaign = useAppSelector((state) => state.kpi.campaign)
  const daily = useAppSelector((state) => state.kpi.daily)
  const downtimes = useAppSelector((state) => state.downtimes.items)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchDowntimes())
  }, [dispatch])

  const totalHours = downtimes.reduce((sum, downtime) => sum + downtime.durationHours, 0)
  const totalCost = (campaign?.frangitoreDowntimeCostEur ?? 0) + (campaign?.decanterDowntimeCostEur ?? 0)
  const show = (text: string) => (downtimes.length > 0 ? text : '—')

  // ultimi 10 fermi, dal più recente
  const lastDowntimes = [...downtimes]
    .sort((a, b) => `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`))
    .slice(0, 10)

  return (
    <section className="dashboard-section">
      <SectionHeader title="Fermi" intro="Quante volte e per quanto tempo si sono fermate le macchine, e quanto è costato."
        imageSrc={downtimeImage} imageAlt="Ulivi e trullo sotto la neve" imageCredit="Foto di Mimmo Guglielmi, per gentile concessione" />

      <div className="kpi-grid">
        <KpiCard label="Numero fermi" value={show(formatNumber(downtimes.length))} />
        <KpiCard label="Ore di fermo" value={show(`${formatNumber(totalHours, 1)} h`)} />
        <KpiCard label="Costo dei fermi" value={show(`${formatNumber(totalCost)} €`)}
          info="Valore della produzione persa durante i fermi di frangitore e decanter a due fasi." />
        <KpiCard label="Costo di un'ora di fermo" value={show(`${formatNumber(campaign?.hourlyDowntimeCostEur ?? 0)} €`)}
          info="Quanto costa al frantoio ogni ora in cui la linea è ferma." />
      </div>

      <Panel title="Ore di fermo giorno per giorno" subtitle="ore">
        <DailyBarChart data={daily} dataKey="downtimeHours" name="Fermi" unit="h" decimals={1} color={colors.olive} />
      </Panel>

      <Panel title="Ultimi fermi della campagna olearia">
        <div className="table-scroll">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Data</TableCell>
                <TableCell>Ora</TableCell>
                <TableCell>Macchina</TableCell>
                <TableCell>Causa</TableCell>
                <TableCell align="right">Durata</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lastDowntimes.map((downtime) => (
                <TableRow key={downtime.id}>
                  <TableCell>{formatShortDate(downtime.date)}</TableCell>
                  <TableCell>{downtime.startTime.slice(0, 5)}</TableCell>
                  <TableCell>{downtime.machine.name}</TableCell>
                  <TableCell>{downtime.cause}</TableCell>
                  <TableCell align="right">{formatNumber(downtime.durationHours * 60)} min</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </section>
  )
}

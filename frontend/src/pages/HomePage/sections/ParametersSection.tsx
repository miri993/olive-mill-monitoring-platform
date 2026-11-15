import { useEffect } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Panel from '../../../components/Panel/Panel'
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { fetchParameters } from '../../../store/slices/parameterSlice'
import './DashboardSections.css'

// Sezione "Parametri": valori economici e tecnici usati per calcolare i KPI
export default function ParametersSection() {
  const parameters = useAppSelector((state) => state.parameters.items)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchParameters())
  }, [dispatch])

  return (
    <section className="dashboard-section">
      <div>
        <h1 className="dashboard-title">Parametri</h1>
        <p className="dashboard-intro">I valori usati per calcolare costi, efficienza e CO₂ della campagna.</p>
      </div>

      <Panel title="Parametri di calcolo">
        <div className="table-scroll">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Parametro</TableCell>
                <TableCell align="right">Valore</TableCell>
                <TableCell>Unità</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parameters.map((parameter) => (
                <TableRow key={parameter.id}>
                  <TableCell>{parameter.name}</TableCell>
                  <TableCell align="right">{parameter.value.toLocaleString('it-IT')}</TableCell>
                  <TableCell>{parameter.unit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
    </section>
  )
}

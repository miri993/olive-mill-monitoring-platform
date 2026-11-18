import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber, formatShortDate } from '../../utils/format'

// Una serie del grafico: dataKey è il nome del campo nei dati (es. 'lineOeePct')
export type ChartLine = {
  dataKey: string
  name: string
  color: string
  dashed?: boolean
}

// data: array di oggetti giornalieri con un campo date; lines: le serie da disegnare.
// Il tipo generico T permette di usarlo con KPI, produzione o fermi
type DailyLineChartProps<T> = {
  data: T[]
  lines: ChartLine[]
  unit?: string
  yDomain?: [number, number]
  decimals?: number
  height?: number
}

// Esempio d'uso nella Panoramica:
// <DailyLineChart data={daily} unit="%" lines={[{ dataKey: 'lineOeePct', name: 'Linea', color: colors.oliveDark }]} />
export default function DailyLineChart<T>({ data, lines, unit = '', yDomain, decimals = 1, height = 260 }: DailyLineChartProps<T>) {
  // ResponsiveContainer: larghezza al 100% del contenitore, altezza fissa
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke="#e6e6e6" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} minTickGap={24} fontSize={12} />
        <YAxis domain={yDomain} fontSize={12} tickFormatter={(value) => `${formatNumber(Number(value))}${unit}`} />
        <Tooltip labelFormatter={(date) => formatShortDate(String(date))}
          formatter={(value) => `${formatNumber(Number(value), decimals)} ${unit}`} />
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 13 }} />}
        {/* Una Line per ogni serie: Recharts legge il valore da data[i][dataKey] */}
        {lines.map((line, index) => (
          <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} name={line.name} stroke={line.color}
            strokeWidth={index === 0 ? 3 : 2} strokeDasharray={line.dashed ? '6 5' : undefined} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber, formatShortDate } from '../../utils/format'

export type ChartLine = {
  dataKey: string
  name: string
  color: string
  dashed?: boolean
}

type DailyLineChartProps<T> = {
  data: T[]
  lines: ChartLine[]
  unit?: string
  yDomain?: [number, number]
  decimals?: number
  height?: number
}

// Grafico a linee con le date sull'asse X
export default function DailyLineChart<T>({ data, lines, unit = '', yDomain, decimals = 1, height = 260 }: DailyLineChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid stroke="#e6e6e6" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} minTickGap={24} fontSize={12} />
        <YAxis domain={yDomain} fontSize={12} tickFormatter={(value) => `${formatNumber(Number(value))}${unit}`} />
        <Tooltip labelFormatter={(date) => formatShortDate(String(date))}
          formatter={(value) => `${formatNumber(Number(value), decimals)} ${unit}`} />
        {lines.length > 1 && <Legend wrapperStyle={{ fontSize: 13 }} />}
        {lines.map((line, index) => (
          <Line key={line.dataKey} type="monotone" dataKey={line.dataKey} name={line.name} stroke={line.color}
            strokeWidth={index === 0 ? 3 : 2} strokeDasharray={line.dashed ? '6 5' : undefined} dot={false} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { formatNumber, formatShortDate } from '../../utils/format'

type DailyBarChartProps<T> = {
  data: T[]
  dataKey: string
  name: string
  color: string
  unit?: string
  decimals?: number
  height?: number
}

// Grafico a barre con le date sull'asse X 
export default function DailyBarChart<T>({ data, dataKey, name, color, unit = '', decimals = 0, height = 260 }: DailyBarChartProps<T>) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#e6e6e6" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} minTickGap={24} fontSize={12} />
        <YAxis fontSize={12} tickFormatter={(value) => formatNumber(Number(value))} />
        <Tooltip labelFormatter={(date) => formatShortDate(String(date))}
          formatter={(value) => [`${formatNumber(Number(value), decimals)} ${unit}`, name]} />
        <Bar dataKey={dataKey} fill={color} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

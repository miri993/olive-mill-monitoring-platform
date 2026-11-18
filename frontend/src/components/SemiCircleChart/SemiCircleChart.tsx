import { Pie, PieChart, ResponsiveContainer } from 'recharts'
import { colors } from '../../styles/variables'
import { formatNumber } from '../../utils/format'
import './SemiCircleChart.css'

type SemiCircleChartProps = {
  value: number
  label: string
}

// Grafico a semicerchio (Recharts) per i KPI in percentuale, ad esempio l'OEE
export default function SemiCircleChart({ value, label }: SemiCircleChartProps) {
  // Due spicchi: il valore del KPI e la parte che manca per arrivare al 100%
  const data = [
    { name: 'valore', value, fill: colors.olive },
    { name: 'resto', value: Math.max(100 - value, 0), fill: colors.oliveTint },
  ]

  return (
    <div className="semi-circle-chart" role="img" aria-label={`${label}: ${formatNumber(value, 1)} %`}>
      <ResponsiveContainer width="100%" aspect={2}>
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie data={data} dataKey="value" startAngle={180} endAngle={0} cx="50%" cy="100%"
            innerRadius="130%" outerRadius="196%" stroke="none" isAnimationActive={false} />
        </PieChart>
      </ResponsiveContainer>
      <span className="semi-circle-chart-value">{formatNumber(value, 1)} %</span>
    </div>
  )
}

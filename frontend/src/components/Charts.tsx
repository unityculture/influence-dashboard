import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#6366f1', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}

export function ChartContainer({ title, subtitle, children, delay = 0 }: ChartContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-6"
    >
      <div className="mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        {subtitle && (
          <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
        )}
      </div>
      {children}
    </motion.div>
  );
}

interface EngagementTrendChartProps {
  data: Array<{ date: string; reach: number; engagement: number }>;
}

export function EngagementTrendChart({ data }: EngagementTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorReach" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          fontSize={12}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '12px',
          }}
          labelStyle={{ color: '#f8fafc' }}
        />
        <Area
          type="monotone"
          dataKey="reach"
          stroke="#6366f1"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorReach)"
          name="觸及"
        />
        <Area
          type="monotone"
          dataKey="engagement"
          stroke="#06b6d4"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorEngagement)"
          name="互動"
        />
        <Legend />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface PlatformDistributionChartProps {
  data: Record<string, { count: number; avg_engagement: number }>;
}

export function PlatformDistributionChart({ data }: PlatformDistributionChartProps) {
  const chartData = Object.entries(data).map(([platform, stats]) => ({
    name: platform.charAt(0).toUpperCase() + platform.slice(1),
    value: stats.count,
    engagement: stats.avg_engagement,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={false}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '12px',
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface CategoryBarChartProps {
  data: Array<{
    category: string;
    kol_count: number;
    avg_engagement: number;
  }>;
}

export function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis type="number" stroke="#94a3b8" fontSize={12} />
        <YAxis
          dataKey="category"
          type="category"
          stroke="#94a3b8"
          fontSize={12}
          width={80}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '12px',
          }}
        />
        <Bar
          dataKey="kol_count"
          fill="#6366f1"
          radius={[0, 4, 4, 0]}
          name="KOL 數量"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface SentimentChartProps {
  positive: number;
  neutral: number;
  negative: number;
}

export function SentimentChart({ positive, neutral, negative }: SentimentChartProps) {
  const data = [
    { name: '正面', value: positive, color: '#10b981' },
    { name: '中立', value: neutral, color: '#f59e0b' },
    { name: '負面', value: negative, color: '#ef4444' },
  ];

  return (
    <div className="flex items-center gap-6">
      <ResponsiveContainer width={150} height={150}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-[var(--text-secondary)]">{item.name}</span>
            <span className="font-semibold" style={{ color: item.color }}>
              {item.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface RadarComparisonChartProps {
  data: Array<{
    name: string;
    影響力: number;
    互動率: number;
    情緒正面: number;
    真實性: number;
    受眾品質: number;
  }>;
}

export function RadarComparisonChart({ data }: RadarComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
        <PolarGrid stroke="#475569" />
        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={12} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
        {data.map((_, index) => (
          <Radar
            key={index}
            name={data[index].name}
            dataKey="value"
            stroke={COLORS[index % COLORS.length]}
            fill={COLORS[index % COLORS.length]}
            fillOpacity={0.2}
          />
        ))}
        <Legend />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
}

interface BuzzTrendChartProps {
  data: Array<{ date: string; volume: number; sentiment: number }>;
}

export function BuzzTrendChart({ data }: BuzzTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="date"
          stroke="#94a3b8"
          fontSize={12}
          tickFormatter={(value) => value.slice(5)}
        />
        <YAxis yAxisId="left" stroke="#6366f1" fontSize={12} />
        <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '12px',
          }}
        />
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="volume"
          stroke="#6366f1"
          strokeWidth={2}
          dot={false}
          name="聲量"
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="sentiment"
          stroke="#10b981"
          strokeWidth={2}
          dot={false}
          name="情緒"
        />
        <Legend />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface AudienceAgeChartProps {
  data: Record<string, number>;
}

export function AudienceAgeChart({ data }: AudienceAgeChartProps) {
  const chartData = Object.entries(data).map(([age, percentage]) => ({
    age,
    percentage,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis dataKey="age" stroke="#94a3b8" fontSize={12} />
        <YAxis stroke="#94a3b8" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1e293b',
            border: '1px solid #475569',
            borderRadius: '12px',
          }}
          formatter={(value) => [`${(value as number).toFixed(1)}%`, '比例']}
        />
        <Bar dataKey="percentage" fill="#6366f1" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface GenderChartProps {
  data: Record<string, number>;
}

export function GenderChart({ data }: GenderChartProps) {
  const chartData = Object.entries(data).map(([gender, percentage]) => ({
    name: gender === 'male' ? '男性' : '女性',
    value: percentage,
    color: gender === 'male' ? '#6366f1' : '#ec4899',
  }));

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={120} height={120}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={35}
            outerRadius={50}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {chartData.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm">{item.name}</span>
            <span className="font-semibold">{item.value.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

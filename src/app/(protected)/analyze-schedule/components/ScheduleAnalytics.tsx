
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LegendProps } from 'recharts'
import ReactMarkdown from 'react-markdown'
import { format, parseISO } from 'date-fns'
interface DailyDuration {
  date: string;
  duration: number;
  estimated_duration: number;
}
interface TaskStatus {
  count: number;
  status: string;
}
interface ScheduleAnalyticsProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isLoading: boolean;
  error: string | null;
  dailyDurations: DailyDuration[];
  aiAnalysis: string | null;
  taskStatuses: TaskStatus[];
}
const COLORS = ['#0088FE', '#FF8042','#00C49F', '#FFBB28'];

const renderColorfulLegendText = (value: string, entry: LegendProps) => {
  const { color } = entry;
  return (
    <span style={{ color, fontWeight: 500 }}>
      {value}
    </span>
  );
};
function formatTime(value: number) {
  const seconds = Math.floor(value % 60);
  const minutes = Math.floor((value / 60) % 60);
  const hours = Math.floor((value / 3600) % 24);
  const days = Math.floor(value / 86400);


  const result = [];
  if (days > 0) result.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) result.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) result.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (seconds > 0) result.push(`${seconds} second${seconds > 1 ? 's' : ''}`);

  return result.join(', ');
}

export function ScheduleAnalytics({
  isLoading,
  error,
  dailyDurations,
  aiAnalysis,
  taskStatuses
}: ScheduleAnalyticsProps) {
  return (
    <div className="space-y-4">
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {dailyDurations.length > 0 && (
        <div className="mt-6 space-y-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">Daily Durations</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyDurations}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => format(parseISO(value), 'MMM d')}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => format(parseISO(label), 'MMMM d, yyyy')}
                  formatter={(value, name) => [`${formatTime(Number(value))}`, name]}
                />
                <Legend />
                <Bar dataKey="duration" fill="#8884d8" name="Actual Duration" />
                <Bar dataKey="estimated_duration" fill="#82ca9d" name="Estimated Duration" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Duration</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyDurations.map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">{format(parseISO(day.date), 'MMMM d, yyyy')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatTime(day.duration)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatTime(day.estimated_duration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {taskStatuses.length > 0 && (
        <div className="mt-6 space-y-6">
          {/* <h3 className="text-2xl font-semibold mb-4 text-center">Task Statuses</h3> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatuses}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={({ percent }) => percent === 0 ? '' : `${(percent * 100).toFixed(0)}%`}
                  >
                    {taskStatuses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  {/* <Tooltip/> */}
                  <Legend
                    formatter={(value, entry) => renderColorfulLegendText(value, entry as LegendProps)}
                    payload={
                      taskStatuses.map((item, index) => ({
                        id: item.status,
                        type: "square",
                        value: `${item.status}`,
                        color: COLORS[index % COLORS.length]
                      }))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taskStatuses.map((status, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">{status.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{status.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {aiAnalysis && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-center">Feedbacks</h3>
          <div className="prose max-w-none">
            <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}


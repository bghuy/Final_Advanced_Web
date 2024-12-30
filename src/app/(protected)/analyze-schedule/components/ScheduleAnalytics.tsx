
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import ReactMarkdown from 'react-markdown'
import { format, parseISO } from 'date-fns'

interface DailyDuration {
  date: string;
  duration: number;
  estimated_duration: number;
}

interface ScheduleAnalyticsProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isLoading: boolean;
  error: string | null;
  dailyDurations: DailyDuration[];
  aiAnalysis: string | null;
}

export function ScheduleAnalytics({
  isLoading,
  error,
  dailyDurations,
  aiAnalysis
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
                  formatter={(value, name) => [`${value} minutes`, name]}
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
                    <td className="px-6 py-4 whitespace-nowrap">{day.duration} minutes</td>
                    <td className="px-6 py-4 whitespace-nowrap">{day.estimated_duration} minutes</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {aiAnalysis && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4 text-center">AI Analysis</h3>
          <div className="prose max-w-none">
            <ReactMarkdown>{aiAnalysis}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}


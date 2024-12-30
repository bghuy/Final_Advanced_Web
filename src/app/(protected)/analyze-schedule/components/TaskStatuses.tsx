import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LegendProps} from 'recharts'

interface TaskStatus {
  count: number;
  status: string;
}

interface TaskStatusesProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isLoading: boolean;
  error: string | null;
  taskStatuses: TaskStatus[];
}

const COLORS = ['#0088FE', '#FF8042', '#FFBB28','#00C49F'];

const renderColorfulLegendText = (value: string, entry: LegendProps) => {
  const { color } = entry;
  return (
    <span style={{ color, fontWeight: 500 }}>
      {value}
    </span>
  );
};
// const CustomTooltip = ({ active, payload }: TooltipProps<ValueType, NameType>) => {
//   if (active && payload && payload.length) {
//     const data = payload[0].payload;
//     return (
//       <div className="bg-white p-2 rounded shadow">
//         <p>{`${data.status}: ${data.count}`}</p>
//       </div>
//     );
//   }
//   return null;
// };

export function TaskStatuses({
  isLoading,
  error,
  taskStatuses
}: TaskStatusesProps) {
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
      {taskStatuses.length > 0 && (
        <div className="mt-6 space-y-6">
          <h3 className="text-2xl font-semibold mb-4 text-center">Task Statuses</h3>
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
    </div>
  )
}

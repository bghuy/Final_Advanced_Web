import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LegendProps} from 'recharts'
import ReactMarkdown from 'react-markdown'
interface TaskStatus {
  count: number;
  status: string;
}

interface TaskStatusesProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  isLoading: boolean;
  error: string | null;
  taskStatuses?: TaskStatus[];
  scheduleAnalytics: string | null;
}

// const COLORS = ['#0088FE', '#FF8042', '#FFBB28','#00C49F'];

// const renderColorfulLegendText = (value: string, entry: LegendProps) => {
//   const { color } = entry;
//   return (
//     <span style={{ color, fontWeight: 500 }}>
//       {value}
//     </span>
//   );
// };
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  taskStatuses,
  scheduleAnalytics
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
      {scheduleAnalytics && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          {/* <h3 className="text-2xl font-semibold mb-4 text-center">Feedbacks</h3> */}
          <div className="prose max-w-none">
            <ReactMarkdown>{scheduleAnalytics}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  )
}

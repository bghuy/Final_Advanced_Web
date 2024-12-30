'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateFilterButton } from '../../tasks/components/DateFilterButton'
import { ScheduleAnalytics } from './ScheduleAnalytics'
import { TaskStatuses } from './TaskStatuses'
import { Button } from "@/components/ui/button"
import { BarChartIcon, CalendarIcon, ClockIcon, ListTodoIcon, TrendingUpIcon } from 'lucide-react'
import { getAIAnalyzeSchedule, getCountAllStatus, getCountDailyDuration } from '@/services/analytics'

type DateFilterField = 'start_time' | 'end_time';

interface DailyDuration {
  date: string;
  duration: number;
  estimated_duration: number;
}

interface TaskStatus {
  count: number;
  status: string;
}

export default function AnalyzeSchedule() {
  const [activeTab, setActiveTab] = useState("schedule")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [message, setMessage] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [dateFilterField, setDateFilterField] = useState<DateFilterField>('start_time')
  const [dailyDurations, setDailyDurations] = useState<DailyDuration[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskStatuses, setTaskStatuses] = useState<TaskStatus[]>([])
  const [isLoadingTaskStatus, setIsLoadingTaskStatus] = useState(false)
  const [taskStatusError, setTaskStatusError] = useState<string | null>(null)

  const formatDateTime = (date: Date | undefined) => {
    return date ? date.toISOString() : ''
  }

  const analyzeConclusionSchedule = useCallback(async () => {
    if (!startDate || !endDate) return

    setIsLoading(true)
    setError(null)

    try {
        const startTimeParam = encodeURIComponent(formatDateTime(startDate))
        const endTimeParam = encodeURIComponent(formatDateTime(endDate))

        const [dailyDurationsResponse, aiAnalysisResponse] = await Promise.all([
            getCountDailyDuration(startTimeParam, endTimeParam),
            getAIAnalyzeSchedule(startTimeParam, endTimeParam),
        ])
        console.log(dailyDurationsResponse,aiAnalysisResponse);
        

        const dailyDurationsData = await dailyDurationsResponse
        const aiAnalysisData = await aiAnalysisResponse

        setDailyDurations(dailyDurationsData)
        setAiAnalysis(aiAnalysisData.content)

    } catch (error: unknown) {
        console.error('Error fetching data:', error)
        setError(error instanceof Error ? error.message : 'An error occurred while fetching data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate])

  const fetchTaskStatuses = useCallback(async () => {
    setIsLoadingTaskStatus(true)
    setTaskStatusError(null)

    try {
    //   let url = '/api/analyze-schedule?type=task/count-all-status'
    //   if (startDate && endDate) {
    //     const startTimeParam = encodeURIComponent(formatDateTime(startDate))
    //     const endTimeParam = encodeURIComponent(formatDateTime(endDate))
    //     url += `&start_time=${startTimeParam}&end_time=${endTimeParam}`
    //   }
    const startTimeParam = encodeURIComponent(formatDateTime(startDate))
    const endTimeParam = encodeURIComponent(formatDateTime(endDate))

        const response = await getCountAllStatus(startTimeParam, endTimeParam)

        setTaskStatuses(response)

    } catch (error) {
      console.error('Error fetching task status data:', error)
      setTaskStatusError('An error occurred while fetching task status data. Please try again.')
    } finally {
      setIsLoadingTaskStatus(false)
    }
  }, [startDate, endDate])

  const handleApply = useCallback(() => {
    if (startDate && endDate) {
      if (activeTab === "schedule") {
        analyzeConclusionSchedule()
      } else {
        fetchTaskStatuses()
      }
    }
  }, [startDate, endDate, activeTab, analyzeConclusionSchedule, fetchTaskStatuses])

  const handleClear = useCallback(() => {
    setStartDate(undefined)
    setEndDate(undefined)
    setMessage(null)
    setDailyDurations([])
    setAiAnalysis(null)
    setError(null)
    setTaskStatuses([])
    setTaskStatusError(null)
  }, [])

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Analyze Your Schedule</CardTitle>
        <CardDescription className="text-lg mt-2">Gain insights into your productivity and time management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="schedule">Schedule Analysis</TabsTrigger>
            <TabsTrigger value="tasks">Task Statuses</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <DateFilterButton
                dateFilterField={dateFilterField}
                startDate={startDate}
                endDate={endDate}
                onDateFilterFieldChange={setDateFilterField}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleApply}
                onClear={handleClear}
              />
              <Button 
                onClick={analyzeConclusionSchedule} 
                disabled={!startDate || !endDate || isLoading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                <BarChartIcon className="w-4 h-4 mr-2" />
                Analyze Schedule
              </Button>
            </div>
            {(!startDate || !endDate) && (
                <div className="text-center space-y-8 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CalendarIcon className="w-12 h-12 text-purple-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Select Date Range</h3>
                            <p className="text-gray-600">Choose your desired time period for analysis</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <ClockIcon className="w-12 h-12 text-pink-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Track Durations</h3>
                            <p className="text-gray-600">Compare actual vs. estimated task durations</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <TrendingUpIcon className="w-12 h-12 text-indigo-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Gain Insights</h3>
                            <p className="text-gray-600">Receive AI-powered analysis of your schedule</p>
                        </div>
                    </div>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Start by selecting a date range to analyze your schedule. Our AI will provide insights to help you optimize your time management and boost productivity.
                    </p>
                </div>
            )}
            <ScheduleAnalytics
              startDate={startDate}
              endDate={endDate}
              isLoading={isLoading}
              error={error}
              dailyDurations={dailyDurations}
              aiAnalysis={aiAnalysis}
            />
          </TabsContent>
          <TabsContent value="tasks" className="space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <DateFilterButton
                dateFilterField={dateFilterField}
                startDate={startDate}
                endDate={endDate}
                onDateFilterFieldChange={setDateFilterField}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
                onApply={handleApply}
                onClear={handleClear}
              />
              <Button
                onClick={fetchTaskStatuses}
                disabled={isLoadingTaskStatus}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all duration-300"
              >
                <ListTodoIcon className="w-4 h-4 mr-2" />
                Fetch Task Statuses
              </Button>
            </div>
            {(!startDate || !endDate) && (
                <div className="text-center space-y-8 mt-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <CalendarIcon className="w-12 h-12 text-purple-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Select Date Range</h3>
                            <p className="text-gray-600">Choose your desired time period for analysis</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <ClockIcon className="w-12 h-12 text-pink-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Track Durations</h3>
                            <p className="text-gray-600">Compare actual vs. estimated task durations</p>
                        </div>
                        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                            <TrendingUpIcon className="w-12 h-12 text-indigo-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">Gain Insights</h3>
                            <p className="text-gray-600">Receive AI-powered analysis of your schedule</p>
                        </div>
                    </div>
                    <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                        Start by selecting a date range to analyze your schedule. Our AI will provide insights to help you optimize your time management and boost productivity.
                    </p>
                </div>
            )}
            <TaskStatuses
              startDate={startDate}
              endDate={endDate}
              isLoading={isLoadingTaskStatus}
              error={taskStatusError}
              taskStatuses={taskStatuses}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}


'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DateFilterButton } from '../../tasks/components/DateFilterButton'
import { format } from 'date-fns'
import { BarChartIcon, CalendarIcon, ClockIcon, TrendingUpIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type DateFilterField = 'start_time' | 'end_time';

interface DailyDuration {
  date: string;
  duration: number;
  estimated_duration: number;
}

export default function AnalyzeSchedule() {
//   const [message, setMessage] = useState<string | null>(null)
  const [startDate, setStartDate] = useState<Date | undefined>()
  const [endDate, setEndDate] = useState<Date | undefined>()
  const [dateFilterField, setDateFilterField] = useState<DateFilterField>('start_time')
  const [dailyDurations, setDailyDurations] = useState<DailyDuration[]>([])
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatDateTime = (date: Date | undefined) => {
    return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss'Z'") : ''
  }

  const analyzeConclusionSchedule = useCallback(async () => {
    if (!startDate || !endDate) return

    setIsLoading(true)
    setError(null)

    try {
      const startTimeParam = encodeURIComponent(formatDateTime(startDate))
      const endTimeParam = encodeURIComponent(formatDateTime(endDate))

      const [dailyDurationsResponse, aiAnalysisResponse] = await Promise.all([
        fetch(`/api/analyze-schedule?start_time=${startTimeParam}&end_time=${endTimeParam}&type=focus-timer/count-daily-duration`),
        fetch(`/api/analyze-schedule?start_time=${startTimeParam}&end_time=${endTimeParam}&type=ai/analyze-shedule`)
      ])

      const dailyDurationsData = await dailyDurationsResponse.json()
      const aiAnalysisData = await aiAnalysisResponse.json()

      if (dailyDurationsData.error_code === 0 && aiAnalysisData.error_code === 0) {
        setDailyDurations(dailyDurationsData.data)
        setAiAnalysis(aiAnalysisData.data.content)
      } else {
        setError('An error occurred while fetching data. Please try again.')
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setError('An error occurred while fetching data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [startDate, endDate])

  const handleApply = useCallback(() => {
    if (startDate && endDate) {
      // setDailyDurations([]);
      // setAiAnalysis(null);
      analyzeConclusionSchedule()
    }
  }, [startDate, endDate, analyzeConclusionSchedule])

  const handleClear = useCallback(() => {
    setStartDate(undefined)
    setEndDate(undefined)
    // setMessage(null)
    setDailyDurations([])
    setAiAnalysis(null)
    setError(null)
  }, [])

  return (
    <Card className={`w-full max-w-4xl mx-auto ${!startDate || !endDate ? 'min-h-[calc(100vh-8rem)]' : ''}`}>
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Analyze Your Schedule</CardTitle>
        <CardDescription className="text-lg mt-2">Gain insights into your productivity and time management</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
          <div className="mt-0 space-y-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">Daily Durations</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyDurations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
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
                      <td className="px-6 py-4 whitespace-nowrap">{day.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{day.duration}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{day.estimated_duration}</td>
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
      </CardContent>
    </Card>
  )
}


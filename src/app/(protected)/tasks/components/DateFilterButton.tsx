import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from 'lucide-react'
import { format } from "date-fns"

type DateFilterField = 'start_time' | 'end_time';

interface DateFilterButtonProps {
  dateFilterField: DateFilterField
  startDate: Date | undefined
  endDate: Date | undefined
  onDateFilterFieldChange: (value: DateFilterField) => void
  onStartDateChange: (date: Date | undefined) => void
  onEndDateChange: (date: Date | undefined) => void
  onApply: () => void
  onClear: () => void
}

export function DateFilterButton({
  dateFilterField,
  startDate,
  endDate,
  onDateFilterFieldChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onClear
}: DateFilterButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleApply = () => {
    onApply()
    setIsOpen(false)
  }

  const handleClear = () => {
    onClear()
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate && endDate ? (
            <>
              {format(startDate, "LLL dd, y")} - {format(endDate, "LLL dd, y")}
            </>
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-2 p-2">
          <Select value={dateFilterField} onValueChange={(value) => onDateFilterFieldChange(value as DateFilterField)}>
            <SelectTrigger>
              <SelectValue placeholder="Select date field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="start_time">Start Time</SelectItem>
              <SelectItem value="end_time">End Time</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-2 flex-row">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={onStartDateChange}
              initialFocus
            />
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={onEndDateChange}
              initialFocus
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button size="sm" onClick={handleClear}>Clear</Button>
            <Button size="sm" onClick={handleApply}>Apply</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}


import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { DatePicker } from '../DatePicker';
import { useDateRange } from './hooks/useDateRange';
import { DateRangeProps } from './types';
import { Dayjs } from 'dayjs';

type Props = {
  onDateSet?: ({ endDate, startDate }: DateRangeProps) => void;
  startDate : Dayjs | null;
  setStartDate?: Dispatch<SetStateAction<Dayjs | null>>
  endDate : Dayjs | null;
  setEndDate?: Dispatch<SetStateAction<Dayjs | null>>
};
export function DateRange({ onDateSet, startDate, setStartDate, endDate, setEndDate }: Props) {
  const { handleDateRangeChange } = useDateRange({ onDateSet, setStartDate, setEndDate });


  return (
    <div className=" flex w-full gap-4">
      <DatePicker
        onChange={(value) => handleDateRangeChange({ startDate: value, endDate })}
        value={startDate}
        label="Data inicial"
      />
      <DatePicker
        onChange={(value) => handleDateRangeChange({ startDate, endDate: value })}
        value={endDate}
        label="Data final"
      />
    </div>
  );
}

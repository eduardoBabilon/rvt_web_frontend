import { Dayjs } from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { DateRangeProps } from '../types';

type Props = {
  onDateSet?: ({ endDate, startDate }: DateRangeProps) => void;
  setStartDate?: Dispatch<SetStateAction<Dayjs | null>>
  setEndDate?: Dispatch<SetStateAction<Dayjs | null>>
};

export function useDateRange({ onDateSet, setStartDate, setEndDate }: Props) {
  
  

  const handleDateRangeChange = ({ startDate, endDate }: DateRangeProps) => {
    // onDateSet?.({ startDate, endDate });
    setStartDate!(startDate);
    setEndDate!(endDate);
  };

  return {
    handleDateRangeChange,
  };
}

import React from 'react';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as DatePickerMui } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ptBR } from '@mui/x-date-pickers/locales';
import { FormControl } from '@mui/material';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/pt-br';

interface InitialDateProps {
  value?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  label?: string;
}

export function DatePicker({ value, onChange, label = 'Selecione uma data' }: InitialDateProps) {
  return (
    <div className="w-full">
      <LocalizationProvider
        localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
        adapterLocale='pt-br'
        dateAdapter={AdapterDayjs}
      >
        <FormControl sx={{ width: '100%' }}>
          <DatePickerMui
            format="DD/MM/YYYY"
            value={value}
            onChange={onChange}
            label={label}
            sx={{
              input: { fontSize: '14px', height: '23px', width: '100%' },
            }}
          />
        </FormControl>
      </LocalizationProvider>
    </div>
  );
}

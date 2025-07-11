import React, { ComponentProps, ReactElement, forwardRef } from 'react';

import { twMerge } from 'tailwind-merge';
import { When } from '@/components/@shared/When';
import { TextField } from '@mui/material';

export type BaseInputProps = ComponentProps<typeof TextField> & {
  hideMaxLengthLabel?: boolean;
  containerClassName?: string;
  hideError?: boolean;
  label?: string;
  charLen?: number;
  maxLength?: number;
  anotherFields?: any;
};

export const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>((props, ref) => {
  const {
    containerClassName = '',
    hideMaxLengthLabel,
    anotherFields,
    charLen = 0,
    helperText,
    onKeyDown,
    hideError,
    maxLength,
    error,
    ...rest
  } = props;

  return (
    <div
      className={twMerge(
        `${
          rest.type === 'hidden' || rest.type === 'file' ? 'hidden' : 'flex'
        } flex-col w-full min-w-fit pt-2 ` + containerClassName,
      )}
    >
      {maxLength ?
        <TextField
          error={!!error}
          id={'input-' + props.id}
          ref={ref}
          {...anotherFields}
          {...rest}
          inputProps={{maxLength: maxLength}}
        />
        :
        <TextField
          error={!!error}
          id={'input-' + props.id}
          ref={ref}
          {...anotherFields}
          {...rest}
        />
      }
      <div className="flex w-full flex-row justify-between">
        <div className="flex w-[90%] flex-row">
          <When value={!hideError && helperText}>
            <div
              data-testid={'messageValidation'}
              className={'flex flex-row gap-2 items-center pl-4 h-max mt-2'}
            >
              <label className={'text-alerts-red font-light text-xs leading-4'}>{helperText}</label>
            </div>
          </When>
        </div>
        <When value={!hideMaxLengthLabel && maxLength}>
          <div className={'flex flex-row gap-2 items-center pr-4 h-max mt-2'}>
            {/* <label className={'text-[#646981] font-light text-xs leading-4'}>
              {charLen}/{maxLength}
            </label> */}
          </div>
        </When>
      </div>
    </div>
  );
});

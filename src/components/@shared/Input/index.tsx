'use client';

import React, { useState } from 'react';

import { RegisterOptions } from 'react-hook-form';
import { ErrorHookForm, ErrorsHookForm } from '@/@types/hookForm';
import { iterateObject } from '@/utils/functions/object';
import { Controller } from 'react-hook-form';
import { ConnectForm } from '../ConnectForm';
import { useInput } from './hook/useInput';
import { When } from '../When';
import { BaseInput, BaseInputProps } from './components/BaseInput';

export type InputProps =  Omit<BaseInputProps, 'ref' | 'error' | 'anotherFields'> & {
  customRef?: React.LegacyRef<HTMLInputElement>;
  preventEnterSubmit?: boolean;
  rules?: RegisterOptions;
  withoutControl?: boolean;
  hideMaxLengthLabel?: boolean;
  error?: string;
};

export function Input({
  preventEnterSubmit = true,
  onKeyDown: onKeyDownProp,
  withoutControl = false,
  onChange: onChangeProp,
  hideMaxLengthLabel,
  variant = 'outlined',
  error: errorProp,
  defaultValue  = '',
  customRef,
  hideError,
  rules,
  label,
  ...rest
}: InputProps) {
  const { inputRef, onKeyDown, inputFileValue, setInputFileValue } = useInput({
    customRef,
    preventEnterSubmit,
    onKeyDownProp,
  });
  const [charLen, setCharLen] = useState(0);

  return (
    <>
      <When value={!withoutControl}>
        <ConnectForm>
          {({ control, formState }) => {
            const id = rest.id || rest.name || 'input';
            const idParts = id.split('.');
            const errors = formState?.errors ?? {};
            const hasControlError = iterateObject<ErrorHookForm>(idParts, errors as ErrorsHookForm);
            const error = hasControlError?.message || errorProp;

            return (
              <Controller
                defaultValue={defaultValue}
                control={control}
                rules={rules}
                name={id}
                render={({ field: { ref, onChange, value, ...fields } }) => {
                  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
                    if (rest.type === 'file') {
                      onChange(e.target.files);
                      setInputFileValue(e.target.value);
                    } else {
                      onChange(e);
                    }

                    onChangeProp?.(e);
                  }
                  function handleRef(e: HTMLInputElement) {
                    ref(e);
                    inputRef.current = e;
                    setCharLen(e?.value?.length ?? 0);
                  }

                  const isInputFile = rest.type === 'file';
                  const valueNormalized = isInputFile ? inputFileValue : value;

                  return (
                    <BaseInput
                      anotherFields={fields}
                      onChange={handleChange}
                      value={valueNormalized}
                      onKeyDown={onKeyDown}
                      hideError={hideError}
                      variant={variant}
                      ref={handleRef}
                      error={!!error}
                      helperText={error}
                      label={label}
                      hideMaxLengthLabel={hideMaxLengthLabel}
                      charLen={charLen}
                      {...rest}
                    />
                  );
                }}
              />
            );
          }}
        </ConnectForm>
      </When>
      <When value={withoutControl}>
        <BaseInput
          hideMaxLengthLabel={hideMaxLengthLabel}
          defaultValue={defaultValue}
          onChange={onChangeProp}
          onKeyDown={onKeyDown}
          hideError={hideError}
          error={!!errorProp}
          helperText={errorProp}
          variant={variant}
          charLen={charLen}
          ref={inputRef}
          label={label}
          {...rest}
        />
      </When>
    </>
  );
}

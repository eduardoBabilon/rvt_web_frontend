import React, { ComponentProps, HTMLAttributes, useEffect } from 'react';

import { RegisterOptions } from 'react-hook-form/dist/types/validator';
import { useFormContext, useWatch } from 'react-hook-form';
import { useRadioGroup } from './hook/useRadioGroup';
import { InputRadio } from '../InputRadio';
import { ErrorLabel } from '../ErrorLabel';
import { twMerge } from 'tailwind-merge';
import { Option } from '@/utils/types';
import { Text5 } from '../Texts';
import { When } from '../When';

type Props = {
  customRef?: React.LegacyRef<HTMLInputElement>;
  onChange?: (value: string) => void;
  customRadioProps?: Omit<
    ComponentProps<typeof InputRadio>,
    'value' | 'isDisabled' | 'onClick' | 'checked' | 'name'
  >;
  classNameContainer?: HTMLAttributes<HTMLDivElement>['className'];
  hideMessageError?: boolean;
  classNameContent?: string;
  rules?: RegisterOptions;
  options: Option[];
  label?: string;
  error?: string;
  name?: string;
  id?: string;
  labelClassName?: string;
  isDisabled?: boolean;
};

export function RadioGroup({
  hideMessageError = false,
  classNameContainer = '',
  onChange,
  classNameContent = '',
  customRadioProps,
  error: errorProp,
  isDisabled,
  customRef,
  options,
  label,
  rules,
  name,
  id,
  labelClassName,
}: Props) {
  const { radioGroupRef } = useRadioGroup({ customRef });
  const currentId = id || name || 'radioGroup';

  const {
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
  } = useFormContext();

  const { ref, onChange: onChangeHook, ...methods } = register(currentId, rules);
  const errorHook = (errors[currentId]?.message ?? '') as string;
  const value = useWatch({ name: currentId }) as string;

  useEffect(() => {
    onChange?.(value);
  }, [value]);

  const selectedValue = watch(currentId);

  return (
    <div className={`flex  flex-col ${classNameContainer}`}>
      <div className="flex gap-3 justify-center w-fit items-center">
        <When value={label}>
          <Text5 className="mb-1 text-text-semiLight">{label}</Text5>
        </When>
      </div>

      <div className={twMerge(`flex flex-row ${classNameContent}`)}>
        <input
          {...methods}
          ref={(e) => {
            ref(e);
            radioGroupRef.current = e;
          }}
          onChange={onChangeHook}
          type="hidden"
        />
        {options.map(({ label, value: optionValue }, idx) => {
          return (
            <InputRadio
              {...customRadioProps}
              value={optionValue}
              isDisabled={isDisabled}
              onClick={() => {
                setValue(currentId, optionValue);
                trigger(currentId);
              }}
              checked={selectedValue === optionValue}
              name={`${currentId}-options`}
              key={idx}
            >
              <Text5 className={labelClassName}>{label}</Text5>
            </InputRadio>
          );
        })}
      </div>
      <div className="flex">
        <ErrorLabel messageError={hideMessageError ? '' : errorProp || errorHook || ''} />
      </div>
    </div>
  );
}

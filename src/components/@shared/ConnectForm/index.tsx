'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form';

type Props = {
  children: (methods: UseFormReturn) => React.ReactNode;
};

export function ConnectForm({ children }: Props) {
  const methods = useFormContext();

  return children({ ...methods });
}

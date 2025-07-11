import React from 'react';

import { useButton } from '../@shared/Button/hooks/useButton';
import { Loading } from '../@shared/Loading';
import { Text6 } from '../@shared/Texts';
import { When } from '../@shared/When';

type Props = {
  actionTypeButton?: 'button' | 'submit';
  onConfirm?: () => void;
  onCancel: () => void;
  actionText?: string;
  isLoading?: boolean;
};

export function ActionButtons({
  actionTypeButton,
  actionText,
  onConfirm,
  isLoading,
  onCancel,
}: Props) {
  const { getAnimation } = useButton();
  return (
    <When
      value={isLoading}
      render={
        <div className='flex justify-center items-center h-8'>
          <Loading iconProps={{ size: 20 }} />
        </div>
      }
      elseRender={
        <div className="flex justify-between w-full text-text-brand uppercase font-bold h-8">
          <button type="button" onClick={onCancel} className={getAnimation()}>
            <Text6 className="text-gray-500 uppercase ">Cancelar</Text6>
          </button>
          <button onClick={onConfirm} type={actionTypeButton} className={getAnimation()}>
            <Text6 className="uppercase text-text-brand">{actionText}</Text6>
          </button>
        </div>
      }
    />
  );
}

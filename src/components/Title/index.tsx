'use client';
import { useAuthContext } from '@/contexts/Auth';
import { Text4, Text6 } from '../@shared/Texts';

export function Title() {
  const { isCentralRole } = useAuthContext();
  return (
    <div className="flex w-full h-full justify-start items-center">
      <div className="flex flex-col gap-1 justify-center items-start sm:col-span-3 h-full min-w-fit w-full sm:flex-row sm:justify-start sm:items-center ">
        <Text4 className="flex justify-center items-center min-w-fit w-ful whitespace-nowrap">
          RVT
        </Text4>
        <div className="flex gap-1 justify-center items-center">
          {/* <Text6 className="text-brand-primary min-w-fit w-ful">/</Text6>
          <Text6 className="text-brand-primary min-w-fit w-ful">
             {isCentralRole ? 'Central' : 'Filial'} 
          </Text6> */}
        </div>
      </div>
    </div>
  );
}

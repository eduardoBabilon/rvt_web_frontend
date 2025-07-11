import React, { useEffect, Dispatch, SetStateAction } from 'react';
import { useListPagination } from './hooks/useListPagination';
import { ButtonArrow } from './components/ButtonArrow';
import { ButtonPage } from './components/ButtonPage';
import { ThreeDots } from '../ThreeDots';
import { When } from '../When';
import { Select } from '../Select';
import { Text6 } from '../Texts';

type Props = {
  setPageItems: Dispatch<SetStateAction<any[]>>;
  setSkip?: Dispatch<SetStateAction<any>>;
  defaultItemsPerPage?: number;
  scrollToId?: string;
  rangeOfCustomItemsPerPage?: number;
  items?: any[];
  itemsAmount?: number;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  currentPage?: number;
  middleThreePages?: number[];
  setMiddleThreePages?: Dispatch<SetStateAction<number[]>> 
};

export function ListPagination({
  defaultItemsPerPage = 10, // Valor padrão para defaultItemsPerPage
  items = [], // Valor padrão para items
  setPageItems,
  scrollToId,
  rangeOfCustomItemsPerPage,
  itemsAmount,
  setSkip,
  currentPage,
  setCurrentPage,
  middleThreePages,
  setMiddleThreePages
}: Props) {
  const {
    shouldDisplayFirstDotsGroup,
    shouldDisplayLastDotsGroup,
    firstItemOfPage,
    lastItemOfPage,
    totalPages,
    changePage,
    totalItems,
    changeItemsPerPage,
    itemsPerPageOptions,
    itemsPerPage,
  } = useListPagination({
    defaultItemsPerPage,
    items,
    setPageItems,
    scrollToId,
    rangeOfCustomItemsPerPage,
    itemsAmount,
    currentPage,
    setCurrentPage,
    setMiddleThreePages

  });

  
  useEffect(() => {
    setPageItems(items.slice(0, itemsPerPage || defaultItemsPerPage)); // Inicializa com os itens da primeira página
  }, [items, itemsPerPage, defaultItemsPerPage, setPageItems]);

  function handleChangePage(page: number){
    changePage(page)
    setSkip? setSkip((page * 4) - 4) : 'ok'
  }

  return (
    <When value={itemsAmount! > 4 }>
      <div className="flex gap-4 justify-end items-center">
        <div className="flex flex-col w-fit justify-center items-center">
          {`${firstItemOfPage ?? 0} - ${lastItemOfPage ?? 0} de ${totalItems ?? 0}`}
        </div>
        <div className="flex w-fit gap-2 text-text-primary select-none justify-center items-center">
          <ButtonArrow
            onClick={() => handleChangePage((currentPage! ?? 1) - 1)}
            direction="left"
            isEnabled={currentPage !== 1}
          />
          <ButtonPage isSelected={1 === currentPage} onClick={() => handleChangePage(1)} label={1} />

          <When value={shouldDisplayFirstDotsGroup} render={<ThreeDots />} />
          {middleThreePages!.map((page) => (
            <ButtonPage
              isSelected={page === currentPage}
              onClick={() => handleChangePage(page)}
              label={page}
              key={page}
            />
          ))}
          <When value={shouldDisplayLastDotsGroup} render={<ThreeDots />} />

          <ButtonPage
            isSelected={totalPages === currentPage}
            onClick={() => handleChangePage(totalPages)}
            label={totalPages}
          />
          <ButtonArrow
            onClick={() => handleChangePage((currentPage ?? 1) + 1)}
            direction="right"
            isEnabled={currentPage !== totalPages}
          />
        </div>
      </div>
    </When>
  );
}

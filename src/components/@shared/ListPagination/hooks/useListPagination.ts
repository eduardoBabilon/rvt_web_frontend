import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type Props<T = any> = {
  setPageItems: Dispatch<SetStateAction<T[]>>;
  defaultItemsPerPage?: number;
  scrollToId?: string;
  rangeOfCustomItemsPerPage?: number;
  items?: T[];
  itemsAmount?: number;
  setCurrentPage?: Dispatch<SetStateAction<number>>;
  currentPage?: number;
  setMiddleThreePages?: Dispatch<SetStateAction<number[]>>;
};

export function useListPagination({
  items,
  defaultItemsPerPage,
  setPageItems,
  scrollToId,
  rangeOfCustomItemsPerPage,
  itemsAmount,
  currentPage,
  setCurrentPage,
  setMiddleThreePages
}: Props) {
  const currentItem = items ?? [];

  const totalItems = itemsAmount;

  const [itemsPerPage, setItemsPerPage] = useState<number | null>(defaultItemsPerPage ?? null);
  const totalPages = totalItems ? Math.ceil(totalItems / (itemsPerPage ?? 1)) : 1;
  

  const itemsPerPageOptions = Array.from({ length: 10 }, (_, index) => {
    const value = (index * (rangeOfCustomItemsPerPage ?? 1));
    return {
      value: value,
      label: value.toString(),
    };
  });

  

  const firstItemOfPage = (currentPage! - 1) * (itemsPerPage ?? 0) + 1;
  const lastItemOfPage = Math.min(currentPage! * (itemsPerPage ?? 0), totalItems!);
  const shouldDisplayFirstDotsGroup = totalPages >= 6 && currentPage! >= 4;
  const shouldDisplayLastDotsGroup = totalPages >= 6 && currentPage! < totalPages - 2;

  function getPageItems(page: number) {
    const startIndex = (page - 1) * (itemsPerPage ?? 1);
    const endIndex = startIndex + (itemsPerPage ?? 0);
    const newItems = currentItem.slice(startIndex, endIndex);
    return newItems;
  }

  function handlePageClick(page: number) {
    const newItems = getPageItems(page);
    setPageItems(newItems);

    if (scrollToId) {
      const target = document.getElementById(scrollToId);
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function normalizeMiddlePages(middlePages: number[]) {
    const normalizedMiddlePages = middlePages.filter((page) => page > 1 && page < totalPages);
    return normalizedMiddlePages;
  }

  function getMiddleThreePages(actualPage: number, totalPages: number) {
    if (totalPages <= 3) {
      return normalizeMiddlePages([1, 2, 3]);
    }
    if (actualPage <= 3) {
      return normalizeMiddlePages([2, 3, 4]);
    }
    if (actualPage >= totalPages - 2) {
      return normalizeMiddlePages([totalPages - 3, totalPages - 2, totalPages - 1]);
    }

    return normalizeMiddlePages([actualPage - 1, actualPage, actualPage + 1]);
  }



  function changePage(page: number) {
    if (page < 1 || page > totalPages) return;
    setCurrentPage!(page);
    const newMiddlePages = getMiddleThreePages(page, totalPages);
 
    setMiddleThreePages!(newMiddlePages);
    handlePageClick(page);
  }

  function changeItemsPerPage(newItemsPerPage: number) {
    setItemsPerPage(newItemsPerPage);
    changePage(1);
  }

  useEffect(() => {
    if (typeof items === undefined) return;
    // if (itemsPerPage) {
    //   changePage(1);
    // } else {
    //   setPageItems(currentItem);
    // }
  }, [items, itemsPerPage]);

  return {
    shouldDisplayFirstDotsGroup,
    shouldDisplayLastDotsGroup,
    itemsPerPageOptions,
    changeItemsPerPage,
    firstItemOfPage,
    lastItemOfPage,
    totalItems,
    changePage,
    totalPages,
    itemsPerPage,
  };
}

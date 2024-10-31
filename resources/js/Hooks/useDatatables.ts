import { useRef } from 'react';

import { DataTableRef } from '@/Components/Datatables';

/**
 * Interface for the return type of useDataTable.
 */
interface DataTableHook<T extends DataTableRef> {
  dataTableRef: React.RefObject<{ refetch: () => void } | T>;
  refetch: () => void;
}

/**
 * A custom hook to manage the DataTable's data fetching logic.
 *
 * @returns {DataTableHook<T extends DataTableRef>} An object containing a refetch function to refresh data from the server.
 */
export const useDataTable = <T extends DataTableRef>(): DataTableHook<T> => {
  const dataTableRef = useRef<DataTableRef>(null);

  /**
   * Refetch the data from the DataTable component.
   */
  const refetch = () => {
    dataTableRef.current?.refetch();
  };

  return { dataTableRef, refetch };
};

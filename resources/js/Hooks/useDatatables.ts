import { useRef, useEffect } from 'react'
import { DataTableRef } from '@/Components/DataTable'
import useDataTableStore from '@/Store/dataTableStore'

/**
 * Hook untuk mengelola referensi dan pembaruan DataTable
 *
 * @returns {Object} Object yang berisi:
 *   - dataTableRef: Referensi ke komponen DataTable
 *   - refetch: Fungsi untuk memuat ulang data tabel
 *
 * @example
 * ```tsx
 * const { dataTableRef, refetch } = useDataTable();
 *
 * return (
 *   <DataTable ref={dataTableRef}>
 *     // konten tabel
 *   </DataTable>
 * );
 * ```
 */
export const useDataTable = () => {
  const dataTableRef = useRef<DataTableRef>(null)
  const { setDataTableRef, refetch } = useDataTableStore()

  useEffect(() => {
    setDataTableRef(dataTableRef)
  }, [setDataTableRef])

  return { dataTableRef, refetch }
}

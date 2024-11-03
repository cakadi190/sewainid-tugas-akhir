import { useRef, useEffect } from 'react'
import { DataTableRef } from '@/Components/DataTable'
import useDataTableStore from '@/Store/dataTableStore'

export const useDataTable = () => {
  const dataTableRef = useRef<DataTableRef>(null)
  const { setDataTableRef, refetch } = useDataTableStore()

  useEffect(() => {
    setDataTableRef(dataTableRef)
  }, [setDataTableRef])

  return { dataTableRef, refetch }
}

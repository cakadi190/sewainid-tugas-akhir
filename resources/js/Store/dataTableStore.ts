import { create } from 'zustand'
import { DataTableRef } from '@/Components/DataTable'

interface DataTableState {
  dataTableRef: React.RefObject<DataTableRef> | null
  setDataTableRef: (ref: React.RefObject<DataTableRef>) => void
  refetch: () => void
}

const useDataTableStore = create<DataTableState>()((set, get) => ({
  dataTableRef: null,

  setDataTableRef: (ref) => {
    set({ dataTableRef: ref })
  },

  refetch: () => {
    const { dataTableRef } = get()
    if (dataTableRef?.current) {
      dataTableRef.current.refetch()
      console.log(dataTableRef.current)
    }
  }
}))

export default useDataTableStore

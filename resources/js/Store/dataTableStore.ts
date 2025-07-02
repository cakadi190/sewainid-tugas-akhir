import { DataTableRef } from '@/Components/DataTable'
import { create } from 'zustand'

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
    }
  }
}))

export default useDataTableStore

import { MUIDataTableState } from "mui-datatables";

export interface Search {
  [key: string]: string
}

export interface PageManagement {
  page: number,
  pageCount: number,
  count: number,
  limit: number,
  search: Search,
  sort: 'asc' | 'desc',
  sortColumn: string
}

export interface DataTableStatus {
  data: any,
  pageManagement: PageManagement,
  isLoading: boolean
}

export function setPageManagement(tableState: MUIDataTableState): PageManagement {
  let pageManagement: PageManagement = {
    // page: (tableState.page == 0) ? 1 : tableState.page,
    page: tableState.page + 1,
    pageCount: Math.ceil(tableState.count / tableState.rowsPerPage),
    count: tableState.count,
    limit: tableState.rowsPerPage,
    search: {},
    sort: tableState.sortOrder.direction,
    sortColumn: tableState.sortOrder.name,
  }
  return pageManagement;
}


export default function getDataTableState(): DataTableStatus {
  let dataTableStatus: DataTableStatus = {
    data: [],
    pageManagement: {
      page: 1,
      pageCount: 1,
      count: 0,
      limit: 10,
      search: {},
      sort: "asc",
      sortColumn: "",
    },
    isLoading: false
  }
  return dataTableStatus;
};


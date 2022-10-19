import { MUIDataTableState } from "mui-datatables";

export interface PageManagement {
  page: number,
  pageCount: number,
  count: number,
  limit: number,
  search: { [key: string]: string },
  sort: 'asc' | 'desc',
  sortColumn: string
}

interface DataTableStatus {
  data: any,
  pageManagement: PageManagement
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


function getDataTableState(): DataTableStatus {
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
    }
  }
  return dataTableStatus;
};

export default getDataTableState;

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface TableColumn<TData = any> {
  key: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  sortable?: boolean;
  render?: (value: any, row: TData) => React.ReactNode;
}

export interface ExpandableConfig<TData = any, TSubData = any> {
  condition?: (row: TData) => boolean;
  fetchUrl?: (row: TData) => string;
  transform?: (response: any) => TSubData;
  render: (
    subData: TSubData | undefined,
    row: TData,
    loading: boolean,
    error: string | null
  ) => React.ReactNode;
  cacheKey?: (row: TData) => string;
}

export interface PaginationConfig {
  enabled?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  serverConfig?: {
    totalAccessor?: string;
  };
}

export interface SearchConfig {
  enabled?: boolean;
  placeholder?: string;
  debounceMs?: number;
  serverConfig?: {
    queryParam?: string;
  };
}

export interface DataTableProps<TData = any, TSubData = any> {
  columns: TableColumn<TData>[];
  fetchUrl: string;
  title?: string;
  expandable?: ExpandableConfig<TData, TSubData>;
  pagination?: PaginationConfig;
  search?: SearchConfig;
  actions?: (row: TData) => React.ReactNode;
  striped?: boolean;
  defaultAlign?: "left" | "center" | "right";
  emptyMessage?: string;
  loadingRows?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  error?: string;
}

export interface UseTableDataReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  meta?: ApiResponse<T[]>["meta"];
  refetch: () => void;
}

export interface UseExpandableReturn<T> {
  expandedRows: Set<string>;
  toggleRow: (rowId: string) => void;
  fetchSubData: (rowId: string, url: string) => Promise<T>;
  subDataCache: Map<string, T>;
  loadingStates: Map<string, boolean>;
  errorStates: Map<string, string>;
}

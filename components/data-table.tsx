"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useExpandable } from "@/hooks/useExpandable";
import { useTableData } from "@/hooks/useTableData";
import { cn } from "@/lib/utils";
import { DataTableProps } from "@/types/table";
import { Fragment, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { TableSkeleton } from "./ui/table-skeleton";
import { ExpandableContent, ExpandableToggle } from "./ui/expandable-row";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Search from "./ui/search";

const DataTable = <TData extends Record<string, any>, TSubData = any>({
  columns,
  fetchUrl,
  title,
  expandable,
  pagination = {
    enabled: true,
    pageSize: 15,
    pageSizeOptions: [5, 10, 15, 25],
  },
  search,
  actions,
  striped = false,
  defaultAlign = "left",
  emptyMessage = "No data available",
  loadingRows = 5,
}: DataTableProps<TData, TSubData>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(pagination.pageSize || 15);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, error, meta } = useTableData<TData>({
    fetchUrl,
    page: currentPage,
    pageSize,
    search: debouncedSearch,
  });

  console.log("data", data);

  const { expandedRows, toggleRow } = useExpandable<TSubData>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, search?.debounceMs || 300);

    return () => clearTimeout(timer);
  }, [searchQuery, search?.debounceMs]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getAlignClass = (align?: "left" | "center" | "right") => {
    const alignment = align || defaultAlign;
    switch (alignment) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  const getCellValue = (row: TData, column: (typeof columns)[0]) => {
    const value = row[column.key];
    return column.render ? column.render(value, row) : value;
  };

  const getRowId = (row: TData, index: number): string => {
    return expandable?.cacheKey
      ? expandable.cacheKey(row)
      : row.id?.toString() || index.toString();
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: string) => {
    setPageSize(parseInt(newSize));
    setCurrentPage(1);
  };

  const totalPages = meta?.totalPages || 1;
  const hasExpandable = !!expandable;
  const hasActions = !!actions;
  const totalColumns =
    columns.length + (hasExpandable ? 1 : 0) + (hasActions ? 1 : 0);

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "flex md:flex-row flex-col items-center gap-4",
          title || search?.enabled ? "justify-between" : "justify-start"
        )}
      >
        {title && <h1 className="text-2xl font-semibold">{title}</h1>}

        {search?.enabled && (
          <Search
            placeholder={search.placeholder}
            value={searchQuery}
            onSearch={handleSearch}
            containerClassName="w-full max-w-sm"
          />
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {hasExpandable && <TableHead className="w-10" />}
              {columns.map((column: any) => (
                <TableHead
                  key={column.key}
                  className={cn(
                    getAlignClass(column.align),
                    column.width && `w-[${column.width}]`
                  )}
                >
                  {column.label}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton
                columns={columns.length}
                rows={loadingRows}
                hasExpandable={hasExpandable}
              />
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns}
                  className="h-24 text-center text-destructive"
                >
                  Error: {error}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={totalColumns}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, index) => {
                const rowId = getRowId(row, index);
                const isExpanded = expandedRows.has(rowId);
                const canExpand = expandable?.condition?.(row) ?? true;

                return (
                  <Fragment key={rowId}>
                    <TableRow
                      key={rowId}
                      className={cn(
                        striped && index % 2 === 0 && "bg-muted/50"
                      )}
                    >
                      {hasExpandable && (
                        <ExpandableToggle
                          row={row}
                          config={expandable}
                          isExpanded={isExpanded}
                          onToggle={() => toggleRow(rowId)}
                        />
                      )}

                      {columns.map((column: any) => (
                        <TableCell
                          key={column.key}
                          className={getAlignClass(column.align)}
                        >
                          {getCellValue(row, column)}
                        </TableCell>
                      ))}

                      {hasActions && (
                        <TableCell className="text-center">
                          <div className="flex items-center justify-end gap-2">
                            {actions(row)}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>

                    {hasExpandable && canExpand && isExpanded && (
                      <TableRow key={`${rowId}-expanded`}>
                        <ExpandableContent
                          row={row}
                          rowId={rowId}
                          columns={columns.length + (hasActions ? 1 : 0)}
                          config={expandable}
                        />
                      </TableRow>
                    )}
                  </Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.enabled && meta && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(pagination.pageSizeOptions || [5, 10, 15, 25]).map(
                  (size: any) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!meta.hasPrevPage}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!meta.hasNextPage}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;

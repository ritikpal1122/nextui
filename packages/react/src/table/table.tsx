import React from 'react';
import { TableRowData } from './table-types';
import { CSS } from '../theme/stitches.config';
import { hasChild, pickChild } from '../utils/collections';
import {
  StyledTable,
  StyledTableHead,
  StyledTableRow,
  StyledTableBody,
  TableVariantsProps
} from './table.styles';
import TableColumn, { TableColumnProps } from './table-column';
import TableCell from './table-cell';

interface Props<TableDataItem extends TableRowData> {
  rows?: Array<TableDataItem>;
  columns?: Array<TableColumnProps<TableDataItem>>;
  as?: keyof JSX.IntrinsicElements;
}

type NativeAttrs = Omit<React.TableHTMLAttributes<unknown>, keyof Props<any>>;

export type TableProps<TableDataItem extends TableRowData> =
  Props<TableDataItem> & NativeAttrs & TableVariantsProps & { css?: CSS };

const Table = React.forwardRef<
  HTMLTableElement,
  React.PropsWithChildren<TableProps<TableRowData>>
>(({ columns, rows, children, ...props }, ref) => {
  const [withoutTableHeadChildren, tableHeadChildren] = pickChild(
    children,
    StyledTableHead
  );

  const [withoutTableBodyChildren, tableBodyChildren] = pickChild(
    withoutTableHeadChildren,
    StyledTableHead
  );

  const hasTableHead = hasChild(withoutTableHeadChildren, StyledTableHead);
  const hasTableBody = hasChild(withoutTableBodyChildren, StyledTableHead);

  return (
    <StyledTable role="table" ref={ref} {...props}>
      {hasTableHead ? (
        tableHeadChildren
      ) : (
        <StyledTableHead>
          <StyledTableRow role="row">
            {columns?.map((column, index) => (
              <TableColumn
                key={`column-${column.field}-${index}`}
                {...column}
              />
            ))}
          </StyledTableRow>
        </StyledTableHead>
      )}
      {hasTableBody ? (
        tableBodyChildren
      ) : (
        <StyledTableBody role="rowgroup">
          {rows?.map((row, index) => (
            <StyledTableRow role="row" key={`tbody-row-${index}`}>
              <TableCell columns={columns} row={row} rowIndex={index} />
            </StyledTableRow>
          ))}
        </StyledTableBody>
      )}
    </StyledTable>
  );
});

Table.displayName = 'NextUI - Table';
Table.toString = () => '.nextui-table';

export default Table;

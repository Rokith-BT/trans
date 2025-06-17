import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

interface TableColumn {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'right' | 'left' | 'center';
}

interface TableData {
  [key: string]: string | number;
}

interface CellExtra {
  rowIndex: number;
  columnId: string;
  content: React.ReactNode;
}

interface HorizontalTableProps {
  columns: TableColumn[];
  data: TableData[];
  extras?: React.ReactNode;
  cellExtras?: CellExtra[];
}

export const HorizontalTable: React.FC<HorizontalTableProps> = ({ columns, data, extras, cellExtras = [] }) => {
  return (
    <TableContainer
      component={Paper}
      style={{ overflowX: "auto" }}
      className="border-[1px] border-[#80459580] !rounded-l-lg"
    >
      <Table>
        <TableHead>
          <TableRow className="">
            <TableCell className="bg-[#E6DDEF] !text-[16px] !text-[#804595]  !font-[500] !border-[1px] !border-[#80459580] sticky left-0 z-10 !p-2 !min-h-[36px]">
              <span className="!pl-2"> S.No</span>
            </TableCell>
            {data.map((_, index) => (
              <TableCell
                key={index}
                align="left"
                className="!text-[16px] !text-[#1A0616] !font-[400] !border-[1px] !border-[#80459580] !p-2 !min-h-[36px]"
              >
                <span className="pl-2"> {index + 1}</span>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {columns.map((column) => (
            <TableRow
              key={column.id}
              className="!border-[1px] !border-[#80459580]  !p-2 !min-h-[36px]"
            >
              <TableCell
                className="bg-[#E6DDEF] !text-[16px] !text-[#804595] !font-[500] !border-[1px] !border-[#80459580] sticky left-0 z-10 !p-2 !min-h-[36px]"
                style={{ minWidth: column.minWidth }}
              >
                <span className="!pl-2">{column.label}</span>
              </TableCell>
              {data.map((row, rowIndex) => {
                const extraContent = cellExtras.find(
                  (extra) => extra.rowIndex === rowIndex && extra.columnId === column.id
                );
                return (
                  <TableCell
                    key={rowIndex}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    className="!text-[16px] !text-[#1A0616] !font-[400] !border-[1px] !border-[#80459580] !p-1 !min-h-[36px] !align-middle "
                  >
                    <span className="pl-2 flex items-center  h-[36px]">
                      {extraContent ? extraContent.content : row[column.id]}
                    </span>
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          {extras && (
            <TableRow>
              <TableCell className="!p-2 !min-h-[36px]">Actions</TableCell>
              {data.map((_, rowIndex) => (
                <TableCell key={rowIndex} className="!p-2 !align-middle !min-h-[36px]">
                  {React.cloneElement(extras as React.ReactElement, {
                    rowIndex
                  })}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

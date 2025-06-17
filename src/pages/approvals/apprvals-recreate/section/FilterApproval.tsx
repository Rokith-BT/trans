import { Box, Button, CustomDialog, Select, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';

interface FilterOption {
  key: string;
  label: string;
  options: { value: string | number; label: string }[];
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  filters: FilterOption[];
  // eslint-disable-next-line no-unused-vars
  onApply: (filters: Record<string, string | null>) => void;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose, filters,onApply }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [dialogFilters, setDialogFilters] = useState<Record<string, string | null>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | null>>({});

  // Parse existing query string
  useEffect(() => {
    if (open) {
      const parsedQS = QS.parse(location.search);
      const initialFilters = filters.reduce(
        (acc, filter) => {
          const filterKey = `filter[${filter.key}]`;
          acc[filter.key] = (parsedQS[filterKey] as string | null) || null;
          return acc;
        },
        {} as Record<string, string | null>
      );

      setDialogFilters(initialFilters); // Update dialog filters
      setAppliedFilters(initialFilters); // Sync applied filters
    }
  }, [open, location.search, filters]);

  // Handle dropdown value changes
  const handleFilterChange = (key: string, value: string | null) => {
    setDialogFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Apply filters: Update query string
  // const handleApplyFilter = () => {
  //   const parsedQS = QS.parse(location.search);

  //   const updatedQS = { ...parsedQS };

  //   // Add selected filters to the query
  //   Object.entries(dialogFilters).forEach(([key, value]) => {
  //     const filterKey = `filter[${key}]`;
  //     if (value) {
  //       updatedQS[filterKey] = value;
  //     } else {
  //       delete updatedQS[filterKey]; // Remove filters that are null
  //     }
  //   });

  //   navigate({ hash: location.hash, search: QS.stringify(updatedQS, { encode: false }) });
  //   setAppliedFilters(dialogFilters); // Sync applied filters
  //   onClose(); // Close the dialog
  // };
   const handleApplyFilter = () => {
     onApply(dialogFilters); // Pass the selected filters to the parent component
     onClose();
   };

  // Clear filters: Set selected filters to null
  const handleClearFilter = () => {
    const parsedQS = QS.parse(location.search);

    const updatedQS = { ...parsedQS };

    // Remove only the applied filters
    Object.keys(appliedFilters).forEach((key) => {
      const filterKey = `filter[${key}]`;
      delete updatedQS[filterKey];
    });

    navigate({ hash: location.hash, search: QS.stringify(updatedQS, { encode: false }) });

    const clearedFilters = Object.keys(appliedFilters).reduce(
      (acc, key) => {
        acc[key] = null;
        return acc;
      },
      {} as Record<string, null>
    );

    setDialogFilters(clearedFilters); // Reset dialog filters
    setAppliedFilters(clearedFilters); // Reset applied filters
    onClose();
  };

  const isFilterApplied = Object.values(appliedFilters).some((value) => value !== null);
  console.log('applied filters ', appliedFilters);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="xs">
      <Box className="py-[10px]">
        <Text className="text-[#804595] !font-[700] !text-[16px] !mb-[25px]">Smart Filter</Text>
        <Box className="flex flex-col gap-4">
          {filters.map((filter) => (
            <Select
              key={filter.key}
              menuOptions={filter.options}
              label={filter.label}
              value={dialogFilters[filter.key] || ''}
              onChange={(e) => handleFilterChange(filter.key, e.target.value as string | null)}
              fullWidth
            />
          ))}
        </Box>
        <Box className="flex items-center justify-between gap-4 mt-[60px]">
          <Button variant="outlined" className="w-full" onClick={onClose}>
            Cancel
          </Button>
          {isFilterApplied ? (
            <Button variant="contained" className="w-full" onClick={handleClearFilter}>
              Clear Filter
            </Button>
          ) : (
            <Button variant="contained" className="w-full" onClick={handleApplyFilter}>
              Apply
            </Button>
          )}
        </Box>
      </Box>
    </CustomDialog>
  );
};

export default FilterDialog;

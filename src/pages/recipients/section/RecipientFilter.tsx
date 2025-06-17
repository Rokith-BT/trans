import { Box, Button, AutoComplete, CustomDatePicker, CustomDialog, Select, Text } from '@/atoms';
import React, { useEffect, useState } from 'react';
import QS from 'query-string';
import { FilterOption } from '@/pages/approvals/apprvals-recreate/section/SubContent';
import { useLocation, useNavigate } from 'react-router';
import dayjs from 'dayjs';

interface RecipientFilterProps {
  open: boolean;
  onClose: () => void;
  activeHash?: string;
  filters: FilterOption[];
  // eslint-disable-next-line no-unused-vars
  onApply: (filters: Record<string, string | null>) => void;
}

const RecipientFilter: React.FC<RecipientFilterProps> = ({ open, onClose, filters, onApply }) => {
  //parsed Qs
  const navigate = useNavigate();
  const location = useLocation();

  const [dialogFilters, setDialogFilters] = useState<Record<string, string | null>>({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string | null>>({});

  // Parse existing query string
  useEffect(() => {
    if (open && filters?.length > 0) {
      const parsedQS = QS.parse(location.search);
      const initialFilters = filters?.reduce(
        (acc, filter) => {
          const filterKey = `filter[${filter.key}]`;
          acc[filter.key] = (parsedQS[filterKey] as string | null) || null;
          return acc;
        },
        {} as Record<string, string | null>
      );

      setDialogFilters(initialFilters);
      setAppliedFilters(initialFilters);
    }
  }, [open, location.search, filters]);

  // Handle dropdown value changes
  const handleFilterChange = (key: string, value: string | null) => {
    setDialogFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilter = () => {
    const filtersToApply: Record<string, string | null> = {};
    console.log(filters, 'filtersfiltersfilters');

    filters.forEach((filter) => {
      const selectedLabel = dialogFilters[filter.key];
      if (selectedLabel) {
        console.log(filter, selectedLabel, 'dfvsdvfdsgvfd');
        const selectedOption = filter.options.find((option) => option.value === selectedLabel);
        if (selectedOption) {
          filtersToApply[filter.key] = selectedOption.label.toString(); // Store key as string
        }
      } else {
        filtersToApply[filter.key] = null;
      }
    });
    console.log(filtersToApply, 'filtersToApply');
    onApply(filtersToApply);
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

    setDialogFilters(clearedFilters);
    setAppliedFilters(clearedFilters);
    onClose();
  };

  const isFilterApplied = Object?.values(appliedFilters).some((value) => value !== null);
  console.log('applied filters ', appliedFilters);

  return (
    <CustomDialog open={open} onClose={onClose} maxWidth="sm">
      <Box className="py-[10px]">
        <Text className="text-[#804595] !font-[700] !text-[16px] !mb-[25px]">Smart Filter</Text>
        <Box className="flex flex-wrap ">
          {filters?.map((filter) => {
            const type = filter.fieldType ?? 'select';
            return (
              <Box key={filter.key} className="flex w-1/2 p-3">
                {type === 'select' && (
                  <Select
                    menuOptions={filter.options}
                    label={filter.label}
                    value={dialogFilters[filter.key] || ''}
                    onChange={(e) => handleFilterChange(filter.key, e.target.value as string | null)}
                    fullWidth
                  />
                )}
                {type === 'date' && (
                  <CustomDatePicker
                    label={filter.key}
                    name={filter.key}
                    value={dialogFilters[filter.key] ? dayjs(dialogFilters[filter.key]) : null}
                    onChange={(date) => handleFilterChange(filter.key, date ? date.format('YYYY-MM-DD') : null)}
                  />
                )}
                {type === 'text' && (
                  <AutoComplete
                    label={filter.label}
                    menuOptions={filter.options}
                    value={filter.options.find((option) => option.label === dialogFilters[filter.key]) || null}
                    onChange={(e) => handleFilterChange(filter.key, e?.label as string | null)}
                  />
                )}
              </Box>
            );
          })}
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

export default RecipientFilter;

import {
  FormControl,
  MenuItem,
  Pagination as MPagination,
  PaginationProps as MPaginationProps,
  PaginationItem,
  Select
} from '@mui/material';
import { Flex, Text } from '..';
import { ArrowCircleLeft, ArrowCircleRight } from '@/assets/icons';
import { useWindowType } from '@/hooks/useWindowType';

type OptionType = { value: string; label: string };

export interface PaginationProps extends MPaginationProps {
  totalPages: number;
  currentPageSize: number;
  pageSizeOptions: OptionType[];
  // eslint-disable-next-line no-unused-vars
  onPageSizeChanged: (option: string) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPageSize = 10,
  pageSizeOptions,
  onPageSizeChanged,
  totalPages,
  ...props
}: PaginationProps) => {
  const { isDesktop } = useWindowType();
  const getVisiblePages = (current: number, total: number): (number | 'dots')[] => {
    const pages: (number | 'dots')[] = [];

    if (total <= 2) {
      // Show all pages if total is small
      for (let i = 1; i <= total; i++) pages.push(i);
      return pages;
    }

    // Always show first
    pages.push(1);

    if (current > 3) pages.push('dots');

    // Show up to 3 middle pages
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) pages.push('dots');

    // Always show last
    pages.push(total);

    return pages;
  };
  return (
    <Flex justifyItems={'center'} alignItems={'center'}>
      <Text className="text-[#C967A280] !text-[12px] md:!text-[12px] xl:!text-[14px] !font-[500]">Rows per page</Text>
      <FormControl sx={{ m: 1 }} size="small" className="">
        <Select
          id="pagination-select"
          value={currentPageSize.toString()}
          size="small"
          className="!border-none !hover:border-none !text-[12px] md:!text-[16px] !font-[500] !text-[#C967A2]"
          sx={{
            '& .MuiSelect-select': {
              'padding-top': '4.5px',
              'padding-bottom': '4.5px'
            }
          }}
          onChange={(event) => onPageSizeChanged(event.target.value.toString())}
        >
          {pageSizeOptions.map((x: OptionType) => (
            <MenuItem key={x.value} value={x.value} className="">
              {x.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* <MPagination
        {...props}
        variant="text"
        shape="rounded"
        
        siblingCount={isMobile ? 1 : 2}
        boundaryCount={isMobile ? 1 : 2}
        renderItem={(item) => {
          console.log('page item', item);
          return (
            <PaginationItem
              component={() => {
                if (item.type === 'page')
                  return (
                    <Flex
                      className={`min-w-[24px] px-[5px] rounded justify-center items-center text-[16px] cursor-pointer text-[#C967A2] ${item.selected ? 'bg-[#D876A94D]' : 'bg-[#A1999F26]'} mr-[5px]`}
                      onClick={(e) => {
                        e.preventDefault();
                        item.onClick(e);
                      }}
                    >
                      {item.page}
                    </Flex>
                  );
                else if (item.type === 'previous') {
                  // Handle disabled when going to first page.
                  return <ArrowCircleLeft className="cursor-pointer" onClick={item.onClick} />;
                } else if (item.type === 'next') {
                  // Handle disabled when going to last page.
                  return <ArrowCircleRight className="cursor-pointer" onClick={item.onClick} />;
                }
              }}
              {...item}
            />
          );
        }}
        count={totalPages}
      /> */}
      {/* <MPagination
        {...props}
        variant="text"
        shape="rounded"
        count={totalPages}
        siblingCount={isMobile ? 1 : 1} // Show ±1 sibling on mobile, ±2 on desktop
        boundaryCount={isMobile ? 1 : 1} // Show 1 page at start/end on mobile
        renderItem={(item) => {
          if (item.type === 'page') {
            return (
              <Flex
                className={`min-w-[24px] px-[5px] rounded justify-center items-center text-[16px] cursor-pointer text-[#C967A2] ${
                  item.selected ? 'bg-[#D876A94D]' : 'bg-[#A1999F26]'
                } mr-[5px]`}
                onClick={(e) => {
                  e.preventDefault();
                  item.onClick?.(e);
                }}
              >
                {item.page}
              </Flex>
            );
          } else if (item.type === 'previous') {
            return <ArrowCircleLeft className="cursor-pointer" onClick={item.onClick} />;
          } else if (item.type === 'next') {
            return <ArrowCircleRight className="cursor-pointer" onClick={item.onClick} />;
          }

          // Default render for ellipsis
          return <PaginationItem {...item} />;
        }}
      /> */}
      <MPagination
        {...props}
        count={totalPages}
        variant="text"
        shape="rounded"
        siblingCount={isDesktop ? 1 : 1}
        boundaryCount={isDesktop ? 1 : 1}
        renderItem={(item) => {
          const visiblePages = isDesktop ? getVisiblePages(Number(props.page), totalPages) : null;

          if (isDesktop) {
            const page = item.page;
            const type = item.type;

            if (type === 'page') {
              if (page === null || !visiblePages?.includes(page)) return null;
              return (
                <Flex
                  className={`min-w-[24px] px-[5px] rounded justify-center items-center text-[12px] md:text-[16px] cursor-pointer !text-[#C967A2] ${
                    item.selected ? 'bg-[#D876A94D]' : 'bg-[#A1999F26]'
                  } mr-[5px]`}
                  onClick={(e) => {
                    e.preventDefault();
                    item.onClick?.(e);
                  }}
                >
                  {page}
                </Flex>
              );
            }

            if (type === 'start-ellipsis' || type === 'end-ellipsis') {
              return <Flex className="px-2 !text-[#C967A2]">...</Flex>;
            }

            if (type === 'previous') {
              return <ArrowCircleLeft className="cursor-pointer" onClick={item.onClick} />;
            }

            if (type === 'next') {
              return <ArrowCircleRight className="cursor-pointer" onClick={item.onClick} />;
            }

            return null;
          }

          // Desktop default behavior
          return (
            <PaginationItem
              component={() => {
                if (item.type === 'page')
                  return (
                    <Flex
                      className={`min-w-[24px] px-[5px] rounded justify-center items-center text-[16px] cursor-pointer text-[#C967A2] ${item.selected ? 'bg-[#D876A94D]' : 'bg-[#A1999F26]'} mr-[5px]`}
                      onClick={(e) => {
                        e.preventDefault();
                        item.onClick(e);
                      }}
                    >
                      {item.page}
                    </Flex>
                  );
                else if (item.type === 'previous') {
                  // Handle disabled when going to first page.
                  return <ArrowCircleLeft className="cursor-pointer" onClick={item.onClick} />;
                } else if (item.type === 'next') {
                  // Handle disabled when going to last page.
                  return <ArrowCircleRight className="cursor-pointer" onClick={item.onClick} />;
                }
              }}
              {...item}
            />
          );
        }}
      />
    </Flex>
  );
};

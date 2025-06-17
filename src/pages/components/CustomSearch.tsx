import { SearchIcon } from '@/assets/icons';
import { Box } from '@/atoms';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { createSearchParams } from 'react-router-dom';
import QS from 'query-string';

interface CustomSearchProps {
  className?: string;
  name?: string;
  isLeftSearch?: boolean;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
  name = 'Search any',
  className = 'h-[30px] sm:h-[36px] w-[150px] sm:w-[276px] rounded-[20px]  pr-8 ',
  isLeftSearch = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQS = QS.parse(location.search);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [searchValue, setSearchValue] = useState<any>(parsedQS.q || '');
  const [debounceSearch, setDebounceSerach] = useState(searchValue);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  };
  // for 1 seond delay
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceSerach(searchValue);
    }, 1000);
    return () => clearTimeout(handler);
  }, [searchValue]);
  useEffect(() => {
    if (debounceSearch !== parsedQS.q) {
      navigate({
        ...location,
        search: createSearchParams({ ...parsedQS, q: debounceSearch, page: '1' }).toString()
      });
    }
  }, [debounceSearch]);

  useEffect(() => {
    const newParsedQs = QS.parse(location.search);
    if (!newParsedQs.q) {
      setSearchValue('');
    } else {
      setSearchValue(newParsedQs.q);
    }
  }, [location.hash]);

  return (
    <Box className={`relative ${className}`}>
      <label htmlFor="search">{''}</label>
      <input
        className={`border-none text-[13px]  bg-[#A1999F26] outline-none ${isLeftSearch ? 'indent-[30px]' : 'indent-5'} ${className}`}
        name={name}
        maxLength={15}
        type="text"
        placeholder={name}
        value={searchValue}
        onChange={handleSearchChange}
      />
      <SearchIcon
        stroke="#C967A2"
        className={`absolute top-[8px] h-[13px] md:h-[17px] ${isLeftSearch ? 'left-2' : 'right-5'}`}
      />
    </Box>
  );
};

export default CustomSearch;

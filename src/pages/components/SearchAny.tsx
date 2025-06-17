import { SearchIcon, Star01 } from '@/assets/icons';
import { Box, Input } from '@/atoms';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import QS from 'query-string';
import { createSearchParams } from 'react-router-dom';

const SearchAny = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parsedQS = QS.parse(location.search);
  const [searchValue, setSearchValue] = useState(parsedQS.q || '');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);

    navigate({
      ...location,
      search: createSearchParams({ ...parsedQS, q: newValue, page: '1' }).toString()
    });
  };
  return (
    <Box>
      <span className="relative ">
        <Input
          label="Search Any"
          className=" md:!w-[300px] !border-none shadow-lg"
          value={searchValue}
          onChange={handleSearchChange}
          fullWidth
        />
        <span className="absolute top-[-7.5px] -right-[10px]">
          <Star01 className="!h-[50px]"/>
        </span>
        <span className="absolute top-[10px] right-[2px]">
          <SearchIcon />
        </span>
      </span>
    </Box>
  );
};

export default SearchAny;

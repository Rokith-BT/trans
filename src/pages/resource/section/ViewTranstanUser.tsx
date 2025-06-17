import { Box } from '@/atoms';
import React, { useEffect } from 'react';
import AddTranstanUser from './AddTranstanUser';
import { useLocation } from 'react-router-dom';
import { useResource } from '../ResourceContext';

const ViewTranstanUser = () => {
  const {
    state: { transtanUser },
    actions: { fetchUcerById }
  } = useResource();
  const location = useLocation();
  const { state: locationState } = location;
  const { isView, isEdit, id } = locationState || {};
  useEffect(() => {
    if (isView || isEdit) {
      fetchUcerById(id);
    }
  }, [isView, isEdit, id]);

  return (
    <Box>
      <AddTranstanUser
        isView={isView}
        isEdit={isEdit}
        userData={transtanUser}
        title={`${isView ? 'View' : 'Edit'} Transtan User`}
      />
    </Box>
  );
};

export default ViewTranstanUser;

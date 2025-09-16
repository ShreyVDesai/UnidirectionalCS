import React from 'react';
import { List } from '@mui/material';
import RequestItem from './RequestItem';
import { Request } from '../types';

interface Props {
  requests: Request[];
  onSelect?: (req: Request) => void;
  actionButton?: (req: Request) => React.ReactNode;
}

const RequestList: React.FC<Props> = ({ requests, onSelect, actionButton }) => {
  return (
    <List>
      {requests.map(req => (
        <RequestItem
          key={req._id}
          request={req}
          onClick={onSelect ? () => onSelect(req) : undefined}
          actionButton={actionButton ? actionButton(req) : undefined}
        />
      ))}
    </List>
  );
};

export default RequestList;

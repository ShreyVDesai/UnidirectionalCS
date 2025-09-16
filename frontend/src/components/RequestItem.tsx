import React from 'react';
import { ListItem, ListItemText, ListItemButton, Button } from '@mui/material';
import { Request } from '../types';

interface Props {
  request: Request;
  onClick?: () => void;
  actionButton?: React.ReactNode;
}

const RequestItem: React.FC<Props> = ({ request, onClick, actionButton }) => {
  return (
    <ListItem
      secondaryAction={actionButton}
      disablePadding
    >
      {onClick ? (
        <ListItemButton onClick={onClick}>
          <ListItemText
            primary={`Request from ${typeof request.from === 'string' ? request.from : request.from.username}`}
            secondary={request.acceptedAt ? `Accepted at: ${new Date(request.acceptedAt).toLocaleString()}` : 'Pending'}
          />
        </ListItemButton>
      ) : (
        <ListItemText
          primary={`Request from ${typeof request.from === 'string' ? request.from : request.from.username}`}
          secondary={request.acceptedAt ? `Accepted at: ${new Date(request.acceptedAt).toLocaleString()}` : 'Pending'}
        />
      )}
    </ListItem>
  );
};

export default RequestItem;

import { useNavigate } from '@tanstack/react-router';
import { MoreHorizontal, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import type { IUser } from '../types';

interface UsersDataTableRowActionsProps {
  row: {
    original: IUser;
  };
}

export const UsersDataTableRowActions = ({
  row,
}: UsersDataTableRowActionsProps) => {
  const user = row.original;
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate({
      to: '/admin/users/$userId',
      params: { userId: user.id },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleViewDetails}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

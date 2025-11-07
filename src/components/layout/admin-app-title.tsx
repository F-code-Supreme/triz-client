import { Link } from '@tanstack/react-router';

export const AdminAppTitle = () => {
  return (
    <Link
      to="/admin"
      className="flex items-center gap-2 font-semibold no-underline hover:opacity-80 transition-opacity"
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <span className="text-sm font-bold">T</span>
      </div>
      <div className="flex flex-col gap-0.5 leading-none">
        <span>TRIZ Admin</span>
        <span className="text-xs text-muted-foreground">Management</span>
      </div>
    </Link>
  );
};

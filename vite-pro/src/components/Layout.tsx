import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex">
      <Outlet />
    </div>
  );
}
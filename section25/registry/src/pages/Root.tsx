import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

export default function Root() {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-12 lg:px-20 min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <Outlet />
      </main>
    </div>
  );
}

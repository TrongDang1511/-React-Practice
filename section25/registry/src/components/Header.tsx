import { Link } from 'react-router-dom';
import SearchInput from './SearchInput';

export default function Header() {
  return (
    <header className="flex items-center justify-between py-4 border-b border-gray-200 gap-4">
      <Link to="/" className="text-xl font-bold tracking-tight text-slate-900 shrink-0">
        NPM Registry
      </Link>
      <div className="w-full max-w-md">
        <SearchInput />
      </div>
    </header>
  );
}

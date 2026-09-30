import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VscSearch } from 'react-icons/vsc';

export default function SearchInput() {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!term.trim()) return;
    navigate(`/search?term=${encodeURIComponent(term)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
          <VscSearch className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search npm packages..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 text-gray-900 border border-transparent rounded-full focus:bg-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all"
        />
      </div>
    </form>
  );
}

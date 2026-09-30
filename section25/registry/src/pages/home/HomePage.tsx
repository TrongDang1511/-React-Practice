import { useLoaderData, Link } from 'react-router-dom';
import { HomeLoaderResult } from './homeLoader';

export default function HomePage() {
  const { featuredPackages } = useLoaderData() as HomeLoaderResult;

  const renderedPackages = featuredPackages.map((p) => {
    return (
      <div
        key={p.name}
        className="flex flex-col justify-between gap-3 border border-gray-200 rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition-shadow"
      >
        <div className="flex flex-col gap-2">
          <div className="font-bold text-center text-lg text-slate-900">{p.name}</div>
          <div className="text-sm text-gray-500 line-clamp-3">{p.description}</div>
          <div className="text-xs text-gray-400 mt-2">
            {p.maintainers?.length || 0} Maintainers
          </div>
        </div>
        <Link
          to={`/packages/${p.name}`}
          className="border border-slate-900 rounded-md text-center py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
        >
          View
        </Link>
      </div>
    );
  });

  return (
    <div className="py-12 space-y-8">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
          The NPM Registry
        </h1>
        <p className="mx-auto max-w-[600px] text-gray-500 text-lg">
          The package manager for JavaScript. Search and view packages effortlessly.
        </p>
      </div>

      <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-[1000px] items-stretch gap-4">
        {renderedPackages}
      </div>
    </div>
  );
}

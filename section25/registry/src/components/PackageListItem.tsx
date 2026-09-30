import { Link } from 'react-router-dom';
import { PackageSummary } from '../api/types/packageSummary';

interface PackageListItemProps {
  pack: PackageSummary;
}

export default function PackageListItem({ pack }: PackageListItemProps) {
  const renderedKeywords = (pack.keywords || []).map((keyword) => (
    <span
      key={keyword}
      className="border border-gray-200 py-0.5 px-2 text-xs bg-slate-100 text-slate-700 rounded-md"
    >
      {keyword}
    </span>
  ));

  return (
    <div className="border border-gray-200 p-4 rounded-lg flex justify-between items-center bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-2 max-w-2xl">
        <Link to={`/packages/${pack.name}`} className="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
          {pack.name}
        </Link>
        <p className="text-sm text-gray-600 line-clamp-2">{pack.description}</p>
        <div className="flex flex-wrap gap-1 mt-1">{renderedKeywords}</div>
      </div>
      <div className="mr-2 shrink-0">
        <Link
          to={`/packages/${pack.name}`}
          className="py-2 px-4 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          View
        </Link>
      </div>
    </div>
  );
}

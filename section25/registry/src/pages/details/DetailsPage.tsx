import { useLoaderData } from 'react-router-dom';
import { DetailsLoaderResult } from './detailsLoader';

export default function DetailsPage() {
  const { details } = useLoaderData() as DetailsLoaderResult;

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 border-b border-gray-200 pb-4">
        {details.name}
      </h1>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Description</h3>
        <div className="p-4 bg-gray-100 rounded-lg text-slate-700 leading-relaxed">
          {details.description || 'No description provided.'}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">License</h3>
        <div className="p-4 bg-gray-100 rounded-lg text-slate-700 font-mono text-sm">
          {details.license || 'N/A'}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">Author</h3>
        <div className="p-4 bg-gray-100 rounded-lg text-slate-700">
          {details.author?.name || 'N/A'}
        </div>
      </div>
    </div>
  );
}

import { searchPackages } from '../../api/queries/searchPackages';
import { PackageSummary } from '../../api/types/packageSummary';

export interface SearchLoaderResult {
  searchResults: PackageSummary[];
}

export async function searchLoader({ request }: { request: Request }): Promise<SearchLoaderResult> {
  const url = new URL(request.url);
  const term = url.searchParams.get('term') || '';

  const searchResults = await searchPackages(term);

  return {
    searchResults,
  };
}

import { useGetAllBeers } from '../hooks/useQueries';
import { BeerCard } from './BeerCard';
import { Skeleton } from './ui/skeleton';
import { Beer } from 'lucide-react';

export function BeerList() {
  const { data: beers, isLoading } = useGetAllBeers();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!beers || beers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center mb-6">
          <Beer className="w-12 h-12 text-amber-600 dark:text-amber-400" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">No Beers Yet</h2>
        <p className="text-muted-foreground max-w-md">
          Start building your tap list by adding your first beer. Click the "Add Beer" button above to get started.
        </p>
      </div>
    );
  }

  const onTapBeers = beers.filter(beer => beer.onTap);
  const bottledBeers = beers.filter(beer => !beer.onTap);

  return (
    <div className="space-y-12">
      {onTapBeers.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/assets/generated/beer-tap-icon-transparent.dim_64x64.png" 
              alt="On Tap" 
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-bold">On Tap</h2>
            <span className="text-sm text-muted-foreground">({onTapBeers.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onTapBeers.map(beer => (
              <BeerCard key={beer.id.toString()} beer={beer} />
            ))}
          </div>
        </section>
      )}

      {bottledBeers.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <img 
              src="/assets/generated/beer-bottle-icon-transparent.dim_48x48.png" 
              alt="Bottled" 
              className="w-8 h-8"
            />
            <h2 className="text-2xl font-bold">Bottled</h2>
            <span className="text-sm text-muted-foreground">({bottledBeers.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bottledBeers.map(beer => (
              <BeerCard key={beer.id.toString()} beer={beer} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

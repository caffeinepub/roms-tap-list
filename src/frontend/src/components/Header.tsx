import { Plus } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onAddBeer: () => void;
}

export function Header({ onAddBeer }: HeaderProps) {
  return (
    <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/assets/generated/beer-tap-icon-transparent.dim_64x64.png" 
              alt="Brew Board" 
              className="w-12 h-12"
            />
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 dark:from-amber-400 dark:via-amber-300 dark:to-yellow-400 bg-clip-text text-transparent">
                Brew Board
              </h1>
              <p className="text-sm text-muted-foreground">Home Brewery Tap List</p>
            </div>
          </div>
          <Button 
            onClick={onAddBeer}
            size="lg"
            className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Beer
          </Button>
        </div>
      </div>
    </header>
  );
}

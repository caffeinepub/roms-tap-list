import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import type { Beer } from '../backend';
import { useToggleOnTap, useRemoveBeer } from '../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { EditBeerDialog } from './EditBeerDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { toast } from 'sonner';

interface BeerCardProps {
  beer: Beer;
}

export function BeerCard({ beer }: BeerCardProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const toggleOnTap = useToggleOnTap();
  const removeBeer = useRemoveBeer();

  const handleToggle = async () => {
    try {
      await toggleOnTap.mutateAsync(beer.id);
      toast.success(`${beer.name} moved to ${beer.onTap ? 'Bottle' : 'On Tap'}`);
    } catch (error) {
      toast.error('Failed to update beer status');
    }
  };

  const handleDelete = async () => {
    try {
      await removeBeer.mutateAsync(beer.id);
      toast.success(`${beer.name} removed from tap list`);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error('Failed to remove beer');
    }
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-xl mb-1 truncate">{beer.name}</CardTitle>
              <Badge variant="secondary" className="text-xs font-medium">
                {beer.style}
              </Badge>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditDialogOpen(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 bg-amber-50 dark:bg-amber-950/20 rounded-lg p-3 text-center border border-amber-200/50 dark:border-amber-800/30">
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {beer.abv.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground font-medium">ABV</div>
            </div>
            <div className="flex-1 bg-orange-50 dark:bg-orange-950/20 rounded-lg p-3 text-center border border-orange-200/50 dark:border-orange-800/30">
              <div className="text-2xl font-bold text-orange-700 dark:text-orange-400">
                {beer.ibu.toString()}
              </div>
              <div className="text-xs text-muted-foreground font-medium">IBU</div>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3.75rem]">
            {beer.description}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <Label htmlFor={`toggle-${beer.id}`} className="text-sm font-medium cursor-pointer">
              {beer.onTap ? 'On Tap' : 'Bottled'}
            </Label>
            <div className="flex items-center gap-2">
              <img 
                src={beer.onTap ? "/assets/generated/beer-tap-icon-transparent.dim_64x64.png" : "/assets/generated/beer-bottle-icon-transparent.dim_48x48.png"}
                alt={beer.onTap ? "On Tap" : "Bottled"}
                className="w-5 h-5 opacity-60"
              />
              <Switch
                id={`toggle-${beer.id}`}
                checked={beer.onTap}
                onCheckedChange={handleToggle}
                disabled={toggleOnTap.isPending}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <EditBeerDialog
        beer={beer}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Beer?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{beer.name}" from your tap list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

import { useState, useEffect } from 'react';
import type { Beer } from '../backend';
import { useUpdateBeer, useToggleOnTap } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { toast } from 'sonner';

interface EditBeerDialogProps {
  beer: Beer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditBeerDialog({ beer, open, onOpenChange }: EditBeerDialogProps) {
  const [name, setName] = useState(beer.name);
  const [style, setStyle] = useState(beer.style);
  const [abv, setAbv] = useState(beer.abv.toString());
  const [ibu, setIbu] = useState(beer.ibu.toString());
  const [description, setDescription] = useState(beer.description);
  const [onTap, setOnTap] = useState(beer.onTap);
  
  const updateBeer = useUpdateBeer();
  const toggleOnTap = useToggleOnTap();

  useEffect(() => {
    if (open) {
      setName(beer.name);
      setStyle(beer.style);
      setAbv(beer.abv.toString());
      setIbu(beer.ibu.toString());
      setDescription(beer.description);
      setOnTap(beer.onTap);
    }
  }, [open, beer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !style.trim() || !abv || !ibu || !description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const abvNum = parseFloat(abv);
    const ibuNum = parseInt(ibu);

    if (isNaN(abvNum) || abvNum < 0 || abvNum > 100) {
      toast.error('ABV must be between 0 and 100');
      return;
    }

    if (isNaN(ibuNum) || ibuNum < 0) {
      toast.error('IBU must be a positive number');
      return;
    }

    try {
      // Update beer details
      await updateBeer.mutateAsync({
        id: beer.id,
        name: name.trim(),
        style: style.trim(),
        abv: abvNum,
        ibu: BigInt(ibuNum),
        description: description.trim(),
      });

      // Toggle onTap status if it changed
      if (onTap !== beer.onTap) {
        await toggleOnTap.mutateAsync(beer.id);
      }

      toast.success(`${name} updated successfully!`);
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to update beer');
    }
  };

  const isLoading = updateBeer.isPending || toggleOnTap.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Beer</DialogTitle>
          <DialogDescription>
            Update the details for {beer.name}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Beer Name</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Hoppy IPA"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-style">Style</Label>
              <Input
                id="edit-style"
                placeholder="e.g., IPA, Stout, Lager"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-abv">ABV (%)</Label>
                <Input
                  id="edit-abv"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="e.g., 6.5"
                  value={abv}
                  onChange={(e) => setAbv(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ibu">IBU</Label>
                <Input
                  id="edit-ibu"
                  type="number"
                  min="0"
                  placeholder="e.g., 45"
                  value={ibu}
                  onChange={(e) => setIbu(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                placeholder="Describe the beer's flavor profile, aroma, and characteristics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <Label htmlFor="edit-on-tap" className="text-sm font-medium cursor-pointer">
                {onTap ? 'On Tap' : 'Bottled'}
              </Label>
              <div className="flex items-center gap-2">
                <img 
                  src={onTap ? "/assets/generated/beer-tap-icon-transparent.dim_64x64.png" : "/assets/generated/beer-bottle-icon-transparent.dim_48x48.png"}
                  alt={onTap ? "On Tap" : "Bottled"}
                  className="w-5 h-5 opacity-60"
                />
                <Switch
                  id="edit-on-tap"
                  checked={onTap}
                  onCheckedChange={setOnTap}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

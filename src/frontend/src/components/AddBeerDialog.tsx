import { useState } from 'react';
import { useAddBeer } from '../hooks/useQueries';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface AddBeerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddBeerDialog({ open, onOpenChange }: AddBeerDialogProps) {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('');
  const [abv, setAbv] = useState('');
  const [ibu, setIbu] = useState('');
  const [description, setDescription] = useState('');
  
  const addBeer = useAddBeer();

  const resetForm = () => {
    setName('');
    setStyle('');
    setAbv('');
    setIbu('');
    setDescription('');
  };

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
      await addBeer.mutateAsync({
        name: name.trim(),
        style: style.trim(),
        abv: abvNum,
        ibu: BigInt(ibuNum),
        description: description.trim(),
      });
      toast.success(`${name} added to tap list!`);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add beer');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Beer</DialogTitle>
          <DialogDescription>
            Add a new beer to your tap list. Fill in all the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Beer Name</Label>
              <Input
                id="name"
                placeholder="e.g., Hoppy IPA"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="style">Style</Label>
              <Input
                id="style"
                placeholder="e.g., IPA, Stout, Lager"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="abv">ABV (%)</Label>
                <Input
                  id="abv"
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
                <Label htmlFor="ibu">IBU</Label>
                <Input
                  id="ibu"
                  type="number"
                  min="0"
                  placeholder="e.g., 45"
                  value={ibu}
                  onChange={(e) => setIbu(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the beer's flavor profile, aroma, and characteristics..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addBeer.isPending}
              className="bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600"
            >
              {addBeer.isPending ? 'Adding...' : 'Add Beer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

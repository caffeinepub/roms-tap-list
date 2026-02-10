import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Header } from './components/Header';
import { BeerList } from './components/BeerList';
import { AddBeerDialog } from './components/AddBeerDialog';
import { Footer } from './components/Footer';
import { Toaster } from './components/ui/sonner';

const queryClient = new QueryClient();

function AppContent() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
      <Header onAddBeer={() => setIsAddDialogOpen(true)} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <BeerList />
      </main>
      <Footer />
      <AddBeerDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

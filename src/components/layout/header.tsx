'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useLogout, useUser } from '@/hooks/use-user';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { ModeToggle } from '../mode-toggle';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';

export default function Header() {
  const pathname = usePathname();
  const { data: user, isLoading, error } = useUser();
  const logoutMutation = useLogout();

  const getUserDisplayName = () => {
    if (!user) return '';
    return user.first_name || user.username;
  };

  // Don't render header on the login page
  if (pathname === '/login') {
    return null;
  }

  return (
    <header className="flex h-16 items-center justify-between px-4 md:px-6 border-b bg-background">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold md:text-2xl">
          {isLoading ? (
            <Skeleton className="h-8 w-48" />
          ) : error ? (
            <span>Artiselite WMS</span>
          ) : (
            <>
              <span className="hidden md:inline">Welcome, </span>
              <span>{getUserDisplayName()}!</span>
            </>
          )}
        </h1>
      </div>

      {!isLoading && !error && (
        <div>
          {/* Desktop Menu */}
          <div className="hidden sm:flex items-center space-x-4">
            <ModeToggle />
            <Button
              onClick={() => logoutMutation.mutate()}
              variant="outline"
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="sm:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                >
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle className="sr-only">Menu</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 p-6">
                  <ModeToggle />
                  <Button
                    onClick={() => logoutMutation.mutate()}
                    variant="outline"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
    </header>
  );
}

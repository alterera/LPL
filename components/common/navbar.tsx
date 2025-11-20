'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { NavMenu } from '@/components/nav-menu';
import { NavigationSheet } from '@/components/navigation-sheet';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { User, LogOut, Shield, LayoutDashboard } from 'lucide-react';
import Image from 'next/image';

interface UserData {
  id: string;
  name: string;
  phone: string;
  role: string;
}

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  useEffect(() => {
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener('auth-change', handleAuthChange);
    return () => window.removeEventListener('auth-change', handleAuthChange);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      window.dispatchEvent(new Event('auth-change'));
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };


  return (
    <nav className="fixed top-6 inset-x-4 h-16 bg-background border max-w-6xl mx-auto rounded-full z-50">
      <div className="h-full flex items-center justify-between mx-auto px-4">
        <Link href="/">
          <Image src="/logo.png" height={50} width={50} alt="logo" />
        </Link>

        <NavMenu className="hidden md:block" user={user} />

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-full" />
          ) : user ? (
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <div className="px-2 py-1.5 mb-2 border-b">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.phone}</p>
                  </div>
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => router.push('/dashboard')}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                    {user.role === 'admin' && (
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => router.push('/admin/dashboard')}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Panel
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="md:hidden">
                <NavigationSheet user={user} />
              </div>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full bg-[#CD0D08] text-white"
                asChild
              >
                <Link href="/login">Log In</Link>
              </Button>
              <Button
                className="hidden sm:inline-flex rounded-full"
                asChild
              >
                <Link href="/signup">Signup</Link>
              </Button>

              <div className="md:hidden">
                <NavigationSheet user={user} />
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

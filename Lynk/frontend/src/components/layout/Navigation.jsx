import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../ui/sheet';
import { 
  Users, 
  UserPlus, 
  Home, 
  Menu, 
  LogOut, 
  User
} from 'lucide-react';

const Navigation = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { path: '/home', label: 'Dashboard', icon: Home },
    { path: '/all-contacts', label: 'All Contacts', icon: Users },
    { path: '/add-contact', label: 'Add Contact', icon: UserPlus },
  ];

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ item, onClick, className = '' }) => {
    const Icon = item.icon;
    return (
      <Button
        variant={isActive(item.path) ? 'default' : 'ghost'}
        onClick={onClick}
        className={`flex items-center gap-2 mx-10 ${className}`}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Button>
    );
  };

  const UserProfileDropdown = () => {
    const displayName = session?.user?.user_metadata?.display_name || 
                       session?.user?.user_metadata?.name ||
                       session?.user?.email?.split('@')[0] || 'User';
    const email = session?.user?.email || '';
    const avatarUrl = session?.user?.user_metadata?.avatar_url || '';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-12 w-12">
              <AvatarImage src={avatarUrl} alt={displayName} />
              <AvatarFallback>
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/settings')}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-2 mt-6">
          {navigationItems.map((item) => (
            <NavItem
              key={item.path}
              item={item}
              onClick={() => {
                navigate(item.path);
                setIsMobileMenuOpen(false);
              }}
              className="justify-start w-full"
            />
          ))}
        </div>
        <div className="mt-auto pt-6 border-t">
          <UserProfileDropdown />
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/home')}
              className="p-0 hover:bg-transparent focus:bg-transparent border-none shadow-none"
              aria-label="Go to Dashboard"
            >
              <img
                src='../../../lynk-logo.png'
                alt="Lynk Logo"
                className="h-20 w-20 object-contain mr-2"
                style={{ minWidth: 40 }}
              />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigationItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                onClick={() => navigate(item.path)}
              />
            ))}
          </div>

          {/* User Profile and Mobile Menu */}
          <div className="flex items-center space-x-2">
            <UserProfileDropdown />
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 
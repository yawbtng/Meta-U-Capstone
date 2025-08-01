import { useState } from 'react';
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
  SheetDescription,
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
import lynkLogo from "../../lynk-logo.png";
import { toast } from 'sonner';

const Navigation = () => {
  const { session, signOut, profile } = UserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast.error('Error signing out');
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
        className={`flex items-center gap-4 mx-4 px-8 py-4 text-xl font-semibold rounded-xl transition-all duration-200 scale-115 hover:scale-125 ${className}`}
        size="lg"
      >
        <Icon className="h-7 w-7" />
        {item.label}
      </Button>
    );
  };

  const UserProfileDropdown = () => {
    const displayName = profile?.displayName || profile?.name || profile?.email?.split('@')[0] || 'User';
    const email = profile?.email || '';
    const avatarUrl = profile?.avatar_url || '';

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-12 w-12 rounded-full">
            <Avatar className="h-14 w-14 border-2 border-gray-200">
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
                   <DropdownMenuItem onClick={() => navigate('/settings')} className="py-3">
           <User className="mr-3 h-5 w-5" />
           <span className="text-base">Profile</span>
         </DropdownMenuItem>
         <DropdownMenuSeparator />
         <DropdownMenuItem onClick={handleSignOut} className="py-3">
           <LogOut className="mr-3 h-5 w-5" />
           <span className="text-base">Log out</span>
         </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const MobileMenu = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Navigation</SheetTitle>
          <SheetDescription className="text-left">
            Access your dashboard, contacts, and profile settings
          </SheetDescription>
        </SheetHeader>
                 <div className="flex flex-col space-y-3 mt-6">
           {navigationItems.map((item) => (
             <NavItem
               key={item.path}
               item={item}
               onClick={() => {
                 navigate(item.path);
                 setIsMobileMenuOpen(false);
               }}
               className="justify-start w-full text-left"
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
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/home')}
              className="p-0 hover:bg-transparent focus:bg-transparent border-none shadow-none"
              aria-label="Go to Dashboard"
            >
              <img
                src={lynkLogo}
                alt="Lynk Logo"
                className="h-24 w-24 object-contain mr-2"
                style={{ minWidth: 48 }}
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
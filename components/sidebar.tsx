'use client'
import React, { useState } from 'react'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import {
  Home,
  Search,
  MessageSquare,
  Bell,
  PlusSquare,
  User,
  Users
} from "lucide-react";
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slice/userSlice';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  hideLabel?: boolean;
}

const NavItem = ({ icon, label, active, onClick, hideLabel = false }: NavItemProps) => {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto",
        hideLabel
          ? "flex flex-col items-center justify-center p-2 w-12"
          : "w-full justify-start gap-2 px-2 py-6",
        active && "font-medium text-foreground"
      )}
      onClick={onClick}
    >
      {icon}
      {!hideLabel && <span>{label}</span>}
    </Button>
  );
};


const Sidebar = () => {
  const [currentTab, setCurrentTab] = useState('Home');
  const user = useSelector(selectUser);
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Home" },
    { icon: <Search className="h-5 w-5" />, label: "Explore" },
    { icon: <Bell className="h-5 w-5" />, label: "Notifications" },
    { icon: <MessageSquare className="h-5 w-5" />, label: "Messages" },
    { icon: <User className="h-5 w-5" />, label: "Profile" },
    { icon: <PlusSquare className="h-5 w-5" />, label: "Create" },
    { icon: <Users className="h-5 w-5" />, label: "Friends" },
  ];

  return (
    user && <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 lg:w-72 flex-col gap-2 border-r border-border p-4 sticky h-screen">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={currentTab === item.label}
              onClick={() => setCurrentTab(item.label)}
            />
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Nav */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 flex justify-around border-t bg-background p-2 z-10'>
        {navItems.slice(0, 4).map(item => (
          <NavItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            active={currentTab === item.label}
            onClick={() => setCurrentTab(item.label)}
            hideLabel
          />
        ))}
      </div>

    </>
  );
};

export default Sidebar;

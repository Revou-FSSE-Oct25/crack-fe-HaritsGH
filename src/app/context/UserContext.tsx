'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userId: string | null;
  username: string | null;
  setUserInfo: (userId: string, username: string) => void;
  clearUserInfo: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  
  const setUserInfo = (id: string, name: string) => {
    setUserId(id);
    setUsername(name);
  };

  const clearUserInfo = () => {
    setUserId(null);
    setUsername(null);
  };

  return (
    <UserContext.Provider value={{ userId, username, setUserInfo, clearUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

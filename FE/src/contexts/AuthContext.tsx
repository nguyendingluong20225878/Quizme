import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService, type User as ApiUser } from '../services/authService';
import { userService } from '../services/userService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  onboardingCompleted: boolean;
  goals?: string[];
  subjects?: string[];
  level?: number;
  xp?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string, newPassword: string) => Promise<void>;
  completeOnboarding: (goals: string[], subjects: string[], placementLevel: number) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken();
      
      if (token) {
        try {
          // Fetch user data from backend
          const userData = await authService.getMe();
          setUser({
            id: userData.id,
            name: userData.fullName,
            email: userData.email,
            avatar: userData.avatar,
            onboardingCompleted: userData.onboardingCompleted,
            goals: userData.goals,
            subjects: userData.subjects,
            level: userData.level,
            xp: userData.xp,
          });
        } catch (error) {
          // Token invalid or expired
          console.error('Auth initialization error:', error);
          authService.logout();
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authService.login({ email, password });
      
      // Set user from API response
      setUser({
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        onboardingCompleted: response.user.onboardingCompleted || false,
        level: response.user.level || 1,
        xp: response.user.xp || 0,
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const response = await authService.register({
        fullName: name,
        email,
        password,
      });
      
      // Set user from API response
      setUser({
        id: response.user.id,
        name: response.user.fullName,
        email: response.user.email,
        onboardingCompleted: response.user.onboardingCompleted || false,
        level: response.user.level || 1,
        xp: response.user.xp || 0,
      });
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const resetPassword = async (email: string, newPassword: string) => {
    setIsLoading(true);
    
    try {
      // TODO: Implement reset password API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Password reset for:', email);
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeOnboarding = async (goals: string[], subjects: string[], placementLevel: number) => {
    if (user) {
      try {
        // Update via API
        await userService.updateProfile({
          onboardingCompleted: true,
          goals,
          subjects,
        });
        
        // Update local state
        const updatedUser = {
          ...user,
          onboardingCompleted: true,
          goals,
          subjects,
          level: placementLevel,
        };
        setUser(updatedUser);
      } catch (error) {
        console.error('Complete onboarding error:', error);
      }
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      try {
        // Update via API if needed
        await userService.updateProfile({
          fullName: updates.name,
          avatar: updates.avatar,
          goals: updates.goals,
          subjects: updates.subjects,
        });
        
        // Update local state
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
      } catch (error) {
        console.error('Update user error:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        completeOnboarding,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
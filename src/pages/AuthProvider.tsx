import React, { useEffect } from 'react';
import { supabase } from '../lib/supabase';

// Define TypeScript types for your database
type Profile = {
  id: string;
  email: string;
  updated_at: string;
  // Add other profile fields as needed
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profileData: Profile = {
            id: session.user.id,
            email: session.user.email || '',
            updated_at: new Date().toISOString()
          };

          const { error } = await supabase
            .from('profiles')
            .upsert(profileData);

          if (error) {
            console.error('Profile update error:', error);
          } else {
            console.log('Profile updated successfully');
          }
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
};
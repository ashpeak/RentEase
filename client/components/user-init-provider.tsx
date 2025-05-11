"use client";

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useUserStore } from '@/stores/useUserStore';
import { useToast } from '@/hooks/use-toast';

export function UserInitProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const { setProfile, profile } = useUserStore();
  const { toast } = useToast();

  useEffect(() => {
    // Only attempt to fetch data if Clerk has loaded and the user is signed in
    if (isLoaded && isSignedIn && user?.id && !profile) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`/api/user-init-data?clerkId=${user.id}`);

          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          const userData = await response.json();

          // Ensure we handle date fields properly, such as createdAt
          if (userData && userData.createdAt && typeof userData.createdAt === 'string') {
            try {
              // Convert string date to Date object
              userData.createdAt = new Date(userData.createdAt);
            } catch (err) {
              console.warn('Error parsing date:', err);
            }
          }

          setProfile(userData);
        } catch (error) {
          console.error('Error initializing user data:', error);
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile data. Please try refreshing the page.",
            variant: "destructive",
          });
        }
      };

      fetchUserData();
    }
  }, [isLoaded, isSignedIn, user, setProfile, profile, toast]);

  return <>{children}</>;
}
import { create } from 'zustand'

interface notificationStore {
  itemCount: number
  wishlistCount: number
  notificationCount: number
  fetchItems: (token: String) => Promise<void>
}

export const useNotificationStore = create<notificationStore>()((set) => ({
    itemCount: 0,
    wishlistCount: 0,
    notificationCount: 0,
    fetchItems: async (token: String) => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/count`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          set(() => ({
            itemCount: data.cartCount,
            wishlistCount: data.wishlistCount,
            notificationCount: data.notificationCount
          }));
        }
      } catch (error) {
        console.error('Error fetching notification count:', error)
      }
    }
  })
)
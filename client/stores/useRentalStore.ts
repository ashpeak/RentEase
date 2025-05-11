import { create } from 'zustand'

interface Rental {
  id: number
  role: 'renting' | 'lending'
  product: {
    id: number
    name: string
    description: string
    image: string
  }
  price: number
  period: string
  startDate: string
  endDate: string
  totalDays: number
  daysLeft?: number
  owner?: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  renter?: {
    id: string
    name: string
    avatar: string
    initials: string
  }
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'declined'
  rating?: number
}

interface RentalStore {
  rentals: Rental[]
  pendingRentals: Rental[]
  activeRentals: Rental[]
  completedRentals: Rental[]
  setRentals: (rentals: Rental[]) => void
  addRental: (rental: Rental) => void
  updateRental: (rentalId: number, updates: Partial<Rental>) => void
  filterRentalsByStatus: (status: Rental['status']) => Rental[]
}

export const useRentalStore = create<RentalStore>()((set, get) => ({
  rentals: [],
  pendingRentals: [],
  activeRentals: [],
  completedRentals: [],
  setRentals: (rentals) => {
    const pending = rentals.filter(rental => rental.status === 'pending')
    const active = rentals.filter(rental => rental.status === 'active')
    const completed = rentals.filter(rental => rental.status === 'completed')
    
    set({
      rentals,
      pendingRentals: pending,
      activeRentals: active,
      completedRentals: completed
    })
  },
  addRental: (rental) => 
    set((state) => ({
      rentals: [...state.rentals, rental],
      pendingRentals: rental.status === 'pending' 
        ? [...state.pendingRentals, rental]
        : state.pendingRentals
    })),
  updateRental: (rentalId, updates) =>
    set((state) => ({
      rentals: state.rentals.map(rental => 
        rental.id === rentalId ? { ...rental, ...updates } : rental
      )
    })),
  filterRentalsByStatus: (status) => {
    return get().rentals.filter(rental => rental.status === status)
  }
}))
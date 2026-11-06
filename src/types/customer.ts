export interface CustomerContact {
  id: string
  name: string
  email: string
  role: string
  contactPreferences: string
}

export interface Customer {
  id: string
  name: string
  customerType: string
  industry: string
  department: string
  description: string
  contacts: CustomerContact[]
  createdAt: string
  updatedAt: string
}
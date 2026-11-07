import { readStorage, writeStorage } from './storage'
import type { Customer } from '../types/customer'

const STORAGE_KEY = 'eia_customers'

interface LegacyCustomer {
  id: string
  organization: string
  department: string
  stakeholder: string
  email: string
  context: string
  createdAt: string
}

function normalizeCustomer(item: Customer | LegacyCustomer): Customer {
  if ('name' in item && 'contacts' in item) {
    return item
  }

  return {
    id: item.id,
    name: item.organization,
    customerType: 'Company',
    industry: '',
    department: item.department,
    description: item.context,
    contacts: item.stakeholder || item.email
      ? [{
          id: `${item.id}-contact`,
          name: item.stakeholder,
          email: item.email,
          role: 'Primary Stakeholder',
          contactPreferences: '',
        }]
      : [],
    createdAt: item.createdAt,
    updatedAt: item.createdAt,
  }
}

export function getCustomers(): Customer[] {
  const parsed = readStorage<Array<Customer | LegacyCustomer>>(STORAGE_KEY)

  if (!parsed) return []

  const customers = parsed.map(normalizeCustomer)
  writeStorage(STORAGE_KEY, customers)

  return customers
}

export function getCustomerById(id: string): Customer | undefined {
  return getCustomers().find((customer) => customer.id === id)
}

export function saveCustomer(customer: Customer): void {
  const customers = getCustomers()

  customers.push(customer)

  writeStorage(STORAGE_KEY, customers)
}

export function updateCustomer(updatedCustomer: Customer): void {
  const customers = getCustomers()

  const updatedCustomers = customers.map((customer) =>
    customer.id === updatedCustomer.id
      ? updatedCustomer
      : customer
  )

  writeStorage(STORAGE_KEY, updatedCustomers)
}

export function deleteCustomer(id: string): void {
  const customers = getCustomers()

  const updatedCustomers = customers.filter(
    (customer) => customer.id !== id
  )

  writeStorage(STORAGE_KEY, updatedCustomers)
}
import { useEffect, useState } from 'react'
import { Plus, Users, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCustomers } from '../../lib/customerStorage'
import type { Customer } from '../../types/customer'
import './CustomersPage.css'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])

  useEffect(() => {
    setCustomers(getCustomers())
  }, [])

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div>
          <p className="dashboard-eyebrow">WORKSPACE</p>
          <h1>Customers</h1>
          <p>Manage your customer organizations and their details.</p>
        </div>

        <Link to="/app/customers/new" className="new-engagement-btn">
          <Plus size={18} />
          Add Customer
        </Link>
      </header>

      {customers.length === 0 ? (
        <section className="dashboard-panel">
          <div className="empty-state">
            <Users size={30} />
            <h3>No customers yet</h3>
            <p>Your customer organizations will appear here.</p>
          </div>
        </section>
      ) : (
        <section className="dashboard-panel">
          <h2 style={{ marginBottom: '20px' }}>
            All Customers ({customers.length})
          </h2>

          {customers.map((customer) => (
            <div
              key={customer.id}
              style={{
                padding: '18px 0',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h3>{customer.name}</h3>

              <p>{customer.customerType}</p>

              <p>{customer.industry || 'No industry specified'}</p>

              <p>{customer.department || 'No department specified'}</p>

              {customer.contacts.length > 0 ? (
                customer.contacts.map((contact) => (
                  <p key={contact.id}>
                    <Mail size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    {contact.name || 'Unnamed contact'}
                    {contact.email ? ` — ${contact.email}` : ''}
                    {contact.role ? ` (${contact.role})` : ''}
                  </p>
                ))
              ) : (
                <p>No contacts added</p>
              )}
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
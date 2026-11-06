import { useEffect, useMemo, useState } from 'react'
import { Plus, Users, Building2, Mail, Factory, Layers } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCustomers } from '../../lib/customerStorage'
import type { Customer } from '../../types/customer'
import '../dashboard/DashboardPage.css'
import './CustomersPage.css'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    setCustomers(getCustomers())
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter((c) => {
      const haystack = [
        c.name,
        c.customerType,
        c.industry,
        c.department,
        c.description,
        ...c.contacts.map(
          (x) => `${x.name} ${x.email} ${x.role} ${x.contactPreferences}`
        ),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }, [customers, query])

  const withContacts = customers.filter((c) => c.contacts.length > 0).length

  return (
    <div className="dashboard-page customers-page">
      <section className="customers-hero">
        <div className="customers-hero-copy">
          <p className="customers-eyebrow">Workspace</p>
          <h1>Customers</h1>
          <p className="customers-lead">
            Organizations and internal business units you engage with. Contacts stay
            attached for stakeholder routing and approvals.
          </p>
          <div className="customers-hero-actions">
            <Link to="/app/customers/new" className="customers-primary-btn">
              <Plus size={18} strokeWidth={2.5} />
              Add customer
            </Link>
            <span className="customers-meta-pill">
              <Users size={14} />
              {customers.length} total
            </span>
          </div>
        </div>
        <div className="customers-hero-stats" aria-label="Customer summary">
          <div className="customers-mini-stat">
            <span className="customers-mini-label">Organizations</span>
            <strong>{customers.length}</strong>
          </div>
          <div className="customers-mini-stat">
            <span className="customers-mini-label">With contacts</span>
            <strong>{withContacts}</strong>
          </div>
          <div className="customers-mini-stat">
            <span className="customers-mini-label">Showing</span>
            <strong>{filtered.length}</strong>
          </div>
        </div>
      </section>

      <div className="customers-toolbar">
        <label htmlFor="customer-search" className="visually-hidden">
          Search customers
        </label>
        <input
          id="customer-search"
          type="search"
          className="customers-search"
          placeholder="Search by name, industry, department, or contact..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
        />
      </div>

      {customers.length === 0 ? (
        <section className="customers-empty">
          <div className="customers-empty-card">
            <div className="customers-empty-icon">
              <Users size={28} />
            </div>
            <h2>No customers yet</h2>
            <p>
              Add your first customer organization so engagements can reference the right
              stakeholders and context.
            </p>
            <Link to="/app/customers/new" className="customers-primary-btn">
              <Plus size={18} strokeWidth={2.5} />
              Add your first customer
            </Link>
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section className="customers-empty">
          <div className="customers-empty-card">
            <h2>No matches</h2>
            <p>Try a different search keyword.</p>
            <button
              type="button"
              className="customers-text-btn"
              onClick={() => setQuery('')}
            >
              Clear search
            </button>
          </div>
        </section>
      ) : (
        <ul className="customers-grid">
          {filtered.map((customer) => (
            <li key={customer.id}>
              <article className="customer-card">
                <header className="customer-card-head">
                  <div className="customer-card-title">
                    <Building2 size={18} aria-hidden />
                    <div>
                      <h2>{customer.name}</h2>
                      <p className="customer-card-type">{customer.customerType}</p>
                    </div>
                  </div>
                </header>

                <dl className="customer-card-meta">
                  <div>
                    <dt>
                      <Factory size={14} aria-hidden /> Industry
                    </dt>
                    <dd>{customer.industry || '—'}</dd>
                  </div>
                  <div>
                    <dt>
                      <Layers size={14} aria-hidden /> Department
                    </dt>
                    <dd>{customer.department || '—'}</dd>
                  </div>
                </dl>

                {customer.description ? (
                  <p className="customer-card-desc">{customer.description}</p>
                ) : null}

                <div className="customer-contacts">
                  <h3>Contacts</h3>
                  {customer.contacts.length === 0 ? (
                    <p className="customer-contacts-empty">No contacts on file.</p>
                  ) : (
                    <ul>
                      {customer.contacts.map((contact) => (
                        <li key={contact.id}>
                          <div className="contact-line">
                            <span className="contact-name">
                              {contact.name || 'Unnamed'}
                            </span>
                            {contact.role ? (
                              <span className="contact-role">{contact.role}</span>
                            ) : null}
                          </div>
                          {contact.email ? (
                            <a className="contact-email" href={`mailto:${contact.email}`}>
                              <Mail size={13} aria-hidden />
                              {contact.email}
                            </a>
                          ) : (
                            <span className="contact-email-muted">No email</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

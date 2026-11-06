import { z } from 'zod'

const emailOptional = z.union([z.literal(''), z.string().trim().email()])

export const signInSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

const contactSchema = z.object({
  id: z.string(),
  name: z.string().trim(),
  email: emailOptional,
  role: z.string().trim(),
  contactPreferences: z.string().trim(),
})

export const newCustomerSchema = z
  .object({
    name: z.string().trim().min(1, 'Organization name is required'),
    customerType: z.enum(['Company', 'Internal Business Unit', 'Other']),
    industry: z.string().trim(),
    department: z.string().trim(),
    description: z.string().trim(),
    contacts: z.array(contactSchema).min(1, 'At least one contact row is required'),
  })
  .superRefine((data, ctx) => {
    data.contacts.forEach((c, index) => {
      const name = c.name.trim()
      const email = c.email.trim()
      if (name.length === 0 && email.length === 0) return
      if (name.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Name is required when email is provided',
          path: ['contacts', index, 'name'],
        })
      }
      if (email.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required when name is provided',
          path: ['contacts', index, 'email'],
        })
      }
    })
    const meaningful = data.contacts.filter(
      (c) => c.name.trim().length > 0 && c.email.trim().length > 0
    )
    if (meaningful.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add at least one contact with name and email',
        path: ['contacts', 0, 'name'],
      })
    }
  })

export type NewCustomerFormValues = z.infer<typeof newCustomerSchema>

export const newEngagementSchema = z.object({
  title: z.string().trim().min(2, 'Title is required'),
  customerId: z.string().min(1, 'Select a customer'),
  problemStatement: z
    .string()
    .trim()
    .min(10, 'Add a clearer problem statement (10+ characters)'),
  objectives: z.string().trim(),
  constraints: z.string().trim(),
  successMetrics: z.string().trim(),
  stakeholders: z.string().trim(),
})

export type NewEngagementFormValues = z.infer<typeof newEngagementSchema>

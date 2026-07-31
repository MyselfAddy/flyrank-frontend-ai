import { useId, useState, type FormEvent } from 'react'
import './SettingsForm.css'

export type ThemeOption = 'light' | 'dark' | 'system'

export interface SettingsFormValues {
  displayName: string
  email: string
  bio: string
  theme: ThemeOption
  emailNotifications: boolean
}

export interface SettingsFormProps {
  initialValues?: Partial<SettingsFormValues>
  onSubmit?: (values: SettingsFormValues) => void
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const BIO_MAX_LENGTH = 200

const defaultValues: SettingsFormValues = {
  displayName: '',
  email: '',
  bio: '',
  theme: 'system',
  emailNotifications: false,
}

type FieldName = 'displayName' | 'email' | 'bio'

type FormErrors = Partial<Record<FieldName, string>>

function validateField(name: FieldName, values: SettingsFormValues): string | undefined {
  switch (name) {
    case 'displayName':
      if (!values.displayName.trim()) {
        return 'Display name is required.'
      }
      return undefined
    case 'email':
      if (!values.email.trim()) {
        return 'Email is required.'
      }
      if (!EMAIL_PATTERN.test(values.email.trim())) {
        return 'Please enter a valid email address.'
      }
      return undefined
    case 'bio':
      if (values.bio.length > BIO_MAX_LENGTH) {
        return `Bio must be ${BIO_MAX_LENGTH} characters or fewer.`
      }
      return undefined
    default:
      return undefined
  }
}

function validateForm(values: SettingsFormValues): FormErrors {
  const fields: FieldName[] = ['displayName', 'email', 'bio']
  const errors: FormErrors = {}

  for (const field of fields) {
    const error = validateField(field, values)
    if (error) {
      errors[field] = error
    }
  }

  return errors
}

function isFormValid(errors: FormErrors): boolean {
  return Object.keys(errors).length === 0
}

export function SettingsForm({ initialValues, onSubmit }: SettingsFormProps) {
  const formId = useId()
  const displayNameId = `${formId}-display-name`
  const emailId = `${formId}-email`
  const bioId = `${formId}-bio`
  const themeGroupId = `${formId}-theme`
  const emailNotificationsId = `${formId}-email-notifications`

  const [values, setValues] = useState<SettingsFormValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({})
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const errors = validateForm(values)
  const formIsValid = isFormValid(errors)

  const showError = (field: FieldName) =>
    Boolean(errors[field] && (touched[field] || submitAttempted))

  const handleBlur = (field: FieldName) => {
    setTouched((current) => ({ ...current, [field]: true }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitAttempted(true)

    if (!formIsValid) {
      return
    }

    onSubmit?.(values)
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <h2 className="settings-form__title">Settings</h2>

      <div className="settings-form__field">
        <label htmlFor={displayNameId}>Display Name</label>
        <input
          id={displayNameId}
          name="displayName"
          type="text"
          value={values.displayName}
          onChange={(event) =>
            setValues((current) => ({ ...current, displayName: event.target.value }))
          }
          onBlur={() => handleBlur('displayName')}
          aria-invalid={showError('displayName')}
          aria-describedby={showError('displayName') ? `${displayNameId}-error` : undefined}
          autoComplete="name"
          required
        />
        {showError('displayName') && (
          <p id={`${displayNameId}-error`} className="settings-form__error" role="alert">
            {errors.displayName}
          </p>
        )}
      </div>

      <div className="settings-form__field">
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          name="email"
          type="email"
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({ ...current, email: event.target.value }))
          }
          onBlur={() => handleBlur('email')}
          aria-invalid={showError('email')}
          aria-describedby={showError('email') ? `${emailId}-error` : undefined}
          autoComplete="email"
          required
        />
        {showError('email') && (
          <p id={`${emailId}-error`} className="settings-form__error" role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className="settings-form__field">
        <label htmlFor={bioId}>Bio</label>
        <textarea
          id={bioId}
          name="bio"
          value={values.bio}
          maxLength={BIO_MAX_LENGTH}
          onChange={(event) =>
            setValues((current) => ({ ...current, bio: event.target.value }))
          }
          onBlur={() => handleBlur('bio')}
          aria-invalid={showError('bio')}
          aria-describedby={`${bioId}-hint${showError('bio') ? ` ${bioId}-error` : ''}`}
        />
        <p id={`${bioId}-hint`} className="settings-form__hint">
          {values.bio.length}/{BIO_MAX_LENGTH} characters
        </p>
        {showError('bio') && (
          <p id={`${bioId}-error`} className="settings-form__error" role="alert">
            {errors.bio}
          </p>
        )}
      </div>

      <fieldset className="settings-form__field">
        <legend id={themeGroupId}>Theme</legend>
        <div className="settings-form__theme-group">
          {(['light', 'dark', 'system'] as const).map((theme) => {
            const optionId = `${formId}-theme-${theme}`
            const label = theme.charAt(0).toUpperCase() + theme.slice(1)

            return (
              <div key={theme} className="settings-form__theme-option">
                <input
                  id={optionId}
                  name="theme"
                  type="radio"
                  value={theme}
                  checked={values.theme === theme}
                  onChange={() => setValues((current) => ({ ...current, theme }))}
                />
                <label htmlFor={optionId}>{label}</label>
              </div>
            )
          })}
        </div>
      </fieldset>

      <div className="settings-form__field">
        <div className="settings-form__checkbox-row">
          <input
            id={emailNotificationsId}
            name="emailNotifications"
            type="checkbox"
            checked={values.emailNotifications}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                emailNotifications: event.target.checked,
              }))
            }
          />
          <label htmlFor={emailNotificationsId}>Email Notifications</label>
        </div>
      </div>

      <div className="settings-form__actions">
        <button type="submit" className="settings-form__submit" disabled={!formIsValid}>
          Save
        </button>
      </div>
    </form>
  )
}

export default SettingsForm

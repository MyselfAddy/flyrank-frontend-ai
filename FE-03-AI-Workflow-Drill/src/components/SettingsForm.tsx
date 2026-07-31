import { useState, type FormEvent } from 'react'
import './SettingsForm.css'

export type SettingsValues = {
  displayName: string
  email: string
  bio: string
  theme: 'light' | 'dark' | 'system'
  emailNotifications: boolean
}

const defaultValues: SettingsValues = {
  displayName: '',
  email: '',
  bio: '',
  theme: 'system',
  emailNotifications: true,
}

type SettingsFormProps = {
  initialValues?: Partial<SettingsValues>
  onSave?: (values: SettingsValues) => void
}

function SettingsForm({ initialValues, onSave }: SettingsFormProps) {
  const [values, setValues] = useState<SettingsValues>({
    ...defaultValues,
    ...initialValues,
  })
  const [saved, setSaved] = useState(false)

  function handleChange<K extends keyof SettingsValues>(
    field: K,
    value: SettingsValues[K],
  ) {
    setValues((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave?.(values)
    setSaved(true)
  }

  function handleReset() {
    setValues({ ...defaultValues, ...initialValues })
    setSaved(false)
  }

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <header className="settings-form__header">
        <h1>Settings</h1>
        <p>Manage your account preferences and profile details.</p>
      </header>

      <fieldset className="settings-form__section">
        <legend>Profile</legend>

        <div className="settings-form__field">
          <label htmlFor="displayName">Display name</label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            value={values.displayName}
            onChange={(event) =>
              handleChange('displayName', event.target.value)
            }
          />
        </div>

        <div className="settings-form__field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="jane@example.com"
            value={values.email}
            onChange={(event) => handleChange('email', event.target.value)}
          />
        </div>

        <div className="settings-form__field">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            placeholder="A short description about you"
            value={values.bio}
            onChange={(event) => handleChange('bio', event.target.value)}
          />
        </div>
      </fieldset>

      <fieldset className="settings-form__section">
        <legend>Preferences</legend>

        <div className="settings-form__field">
          <label htmlFor="theme">Theme</label>
          <select
            id="theme"
            name="theme"
            value={values.theme}
            onChange={(event) =>
              handleChange('theme', event.target.value as SettingsValues['theme'])
            }
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="settings-form__field settings-form__field--checkbox">
          <input
            id="emailNotifications"
            name="emailNotifications"
            type="checkbox"
            checked={values.emailNotifications}
            onChange={(event) =>
              handleChange('emailNotifications', event.target.checked)
            }
          />
          <label htmlFor="emailNotifications">Email notifications</label>
        </div>
      </fieldset>

      <div className="settings-form__actions">
        <button type="button" className="settings-form__btn settings-form__btn--secondary" onClick={handleReset}>
          Reset
        </button>
        <button type="submit" className="settings-form__btn settings-form__btn--primary">
          Save changes
        </button>
      </div>

      {saved && (
        <p className="settings-form__status" role="status" aria-live="polite">
          Settings saved successfully.
        </p>
      )}
    </form>
  )
}

export default SettingsForm

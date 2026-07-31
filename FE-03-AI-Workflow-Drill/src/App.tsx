import SettingsForm from './components/SettingsForm'

function App() {
  return (
    <main>
      <SettingsForm
        initialValues={{
          displayName: 'Jane Doe',
          email: 'jane@example.com',
        }}
        onSave={(values) => {
          console.log('Settings saved:', values)
        }}
      />
    </main>
  )
}

export default App

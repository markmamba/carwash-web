export const meta = () => ([
  { title: 'Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export default function HomePage() {
  return (
    <main style={ { padding: '2rem' } }>
      <h1>
        { 'Scorpio Carwash' }
      </h1>
      <p>
        { 'Admin portal scaffold ready.' }
      </p>
    </main>
  )
}

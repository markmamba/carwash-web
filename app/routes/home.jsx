export const meta = () => ([
  { title: 'Scorpio Carwash' },
  { name: 'robots', content: 'noindex, nofollow' }
])

export default function HomePage() {
  return (
    <main className="container py-5">
      <h1 className="mb-3">
        { 'Scorpio Carwash' }
      </h1>
      <p className="text-body-secondary mb-4">
        { 'Admin portal scaffold ready.' }
      </p>
      <button
        type="button"
        className="btn btn-primary"
      >
        { 'Bootstrap SCSS loaded' }
      </button>
    </main>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          Restaurant Management System
        </h1>
        <p className="text-muted-foreground mb-8">
          Welcome to the restaurant management platform
        </p>
        <div className="space-x-4">
          <a
            href="/admin"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Admin Dashboard
          </a>
          <a
            href="/manager"
            className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90"
          >
            Manager Portal
          </a>
        </div>
      </div>
    </div>
  );
}

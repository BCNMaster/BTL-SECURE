export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <p className="text-gray-600">The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" className="mt-8 text-blue-500 hover:text-blue-700">
        Return Home
      </a>
    </div>
  );
}

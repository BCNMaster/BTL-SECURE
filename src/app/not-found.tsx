import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-5xl">404</h2>
        <p className="mt-4 text-lg text-gray-600">The page you're looking for doesn't exist.</p>
        <Link 
          href="/" 
          className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

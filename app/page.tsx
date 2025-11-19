import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to{' '}
            <span className="text-blue-600 dark:text-blue-400">
              Balidunga Cricket Club
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join us for thrilling matches, community spirit, and unforgettable
            sporting moments. Register now to become part of our cricket family.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link href="/register">
                Register as Player
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            {/* <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6"
            >
              <Link href="/login">Login to Dashboard</Link>
            </Button> */}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Easy Registration
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simple and quick player registration process with secure payment
              system.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Track Your Status
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your registration status and payment details from your
              personal dashboard.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Community First
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Be part of a vibrant cricket community dedicated to excellence and
              sportsmanship.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

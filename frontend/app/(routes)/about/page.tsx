import Navbar from '@/components/Navbar';
import {
  Heart,
  CalendarDays,
  Clock,
  Users,
  Lightbulb,
  ShieldCheck,
} from 'lucide-react';

export default function AboutPage() {
  return (
    <>
   
      <Navbar />

      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 sm:p-8">
          
        
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 text-center sm:text-left">
            About SmartCare
          </h1>

      
          <p className="text-base sm:text-lg text-gray-700 mb-6 leading-relaxed text-center sm:text-left">
            SmartCare is a <span className="font-semibold text-blue-600">smart triage healthcare platform</span> designed to simplify the patient journey. 
            We help you find the right medical specialist quickly and easily.
          </p>

       
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 my-6 sm:my-8">
            
           
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg hover:shadow-md transition-shadow">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-2 stroke-[1.5]" />
              <h3 className="font-semibold text-blue-700 text-base sm:text-lg">Smart Triage</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Describe your symptoms and get an instant specialty recommendation.
              </p>
            </div>

   
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg hover:shadow-md transition-shadow">
              <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-2 stroke-[1.5]" />
              <h3 className="font-semibold text-blue-700 text-base sm:text-lg">Instant Booking</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Book appointments with the right doctor in seconds.
              </p>
            </div>

            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg hover:shadow-md transition-shadow">
              <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-2 stroke-[1.5]" />
              <h3 className="font-semibold text-blue-700 text-base sm:text-lg">Real-time Queue</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Track your position in the queue and know when it's your turn.
              </p>
            </div>

       
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg hover:shadow-md transition-shadow">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 mb-2 stroke-[1.5]" />
              <h3 className="font-semibold text-blue-700 text-base sm:text-lg">Trusted Doctors</h3>
              <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                Connect with verified medical professionals.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg border border-gray-200 mt-4 sm:mt-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-5 h-5 text-blue-600 stroke-[1.5]" />
              <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Our Mission</h3>
            </div>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 leading-relaxed">
              To make healthcare accessible and stress-free by guiding patients to the right specialist, 
              eliminating guesswork, and reducing waiting times.
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
              <ShieldCheck className="w-5 h-5 text-blue-600 stroke-[1.5]" />
              <span className="text-sm text-blue-700 font-medium">Secure & Trusted Healthcare Platform</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
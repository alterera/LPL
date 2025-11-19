import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Trophy, Home } from "lucide-react";
import Link from "next/link";

interface RegistrationClosedProps {
  type: 'player' | 'team';
}

const RegistrationClosed: React.FC<RegistrationClosedProps> = ({ type }) => {
  const isPlayer = type === 'player';
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
        style={{
          backgroundImage: "url('/bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-purple-900/60 to-indigo-900/70"></div>
        {/* Floating particles effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-4 h-4 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Registration Closed
            </h1>
            <p className="text-xl text-blue-100">
              {isPlayer ? 'Player' : 'Team'} registration is currently not available
            </p>
          </div>

          {/* Main Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="text-center pb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <Calendar className="w-10 h-10 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-gray-900">
                Registration Temporarily Closed
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {isPlayer 
                  ? 'Player registration is currently disabled by the administrators.'
                  : 'Team registration is currently disabled by the administrators.'
                }
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Status Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  {isPlayer ? (
                    <Users className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Trophy className="w-5 h-5 text-purple-600" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {isPlayer ? 'Player' : 'Team'} Registration Status
                    </p>
                    <p className="text-sm text-gray-600">
                      Currently not accepting new {isPlayer ? 'players' : 'teams'}
                    </p>
                  </div>
                </div>
              </div>

              {/* What to do next */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What you can do:</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check back later for registration updates</li>
                  <li>• Contact the administrators for more information</li>
                  <li>• Visit our homepage for other activities</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700">
                  <Link href="/">
                    <Home className="w-4 h-4 mr-2" />
                    Go to Homepage
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/contact">
                    Contact Us
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-blue-200 text-sm">
              Thank you for your interest in lpl {isPlayer ? 'Player' : 'Team'} Registration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationClosed; 
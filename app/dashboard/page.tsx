'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { UserPlus, CheckCircle2, XCircle, Calendar, Phone, MapPin, CreditCard } from 'lucide-react';
import Image from 'next/image';

interface PlayerData {
  id: string;
  playerPhoto: string;
  playerName: string;
  contactNumber: string;
  dateOfBirth: string;
  aadharNumber: string;
  village: string;
  postOffice: string;
  policeStation: string;
  city: string;
  gpSelection: string;
  parentName: string;
  parentContact: string;
  emergencyContactName: string;
  emergencyPhone: string;
  registrationDate: string;
  paymentStatus: 'pending' | 'completed';
  paymentDate?: string;
  transactionId?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    try {
      const response = await fetch('/api/players/me');
      if (response.ok) {
        const data = await response.json();
        setPlayer(data.player);
      }
    } catch (error) {
      console.error('Failed to fetch player data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  Not Registered as Player
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You haven't registered as a player yet. Click the button below to start your registration.
                </p>
                <Button asChild>
                  <Link href="/register">Register as Player</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Welcome back, {player.playerName}!</p>
        </div>

        {/* Payment Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {player.paymentStatus === 'completed' ? (
                <>
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="font-semibold text-green-600 dark:text-green-400">Payment Completed</p>
                    {player.paymentDate && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Paid on {format(new Date(player.paymentDate), 'PPP')}
                      </p>
                    )}
                    {player.transactionId && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Transaction ID: {player.transactionId}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400">Payment Pending</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Please complete the payment to finalize your registration.
                    </p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Player Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Player Information</CardTitle>
            <CardDescription>Your registration details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {player.playerPhoto && (
                <div className="md:col-span-2">
                  <Label className="text-sm text-gray-500 mb-2 block">Player Photo</Label>
                  <Image
                    src={player.playerPhoto}
                    alt={player.playerName}
                    width={150}
                    height={150}
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <div>
                <Label className="text-sm text-gray-500">Player Name</Label>
                <p className="mt-1 font-medium">{player.playerName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Contact Number</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {player.contactNumber}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Date of Birth</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {format(new Date(player.dateOfBirth), 'PPP')}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Aadhar Number</Label>
                <p className="mt-1 font-medium">{player.aadharNumber}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Village</Label>
                <p className="mt-1 font-medium">{player.village}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Post Office</Label>
                <p className="mt-1 font-medium">{player.postOffice}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Police Station</Label>
                <p className="mt-1 font-medium">{player.policeStation}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">City</Label>
                <p className="mt-1 font-medium">{player.city}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">GP Selection</Label>
                <p className="mt-1 font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {player.gpSelection}
                </p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Parent Name</Label>
                <p className="mt-1 font-medium">{player.parentName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Parent Contact</Label>
                <p className="mt-1 font-medium">{player.parentContact}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Emergency Contact Name</Label>
                <p className="mt-1 font-medium">{player.emergencyContactName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Emergency Phone</Label>
                <p className="mt-1 font-medium">{player.emergencyPhone}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Registration Date</Label>
                <p className="mt-1 font-medium">
                  {format(new Date(player.registrationDate), 'PPP')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}


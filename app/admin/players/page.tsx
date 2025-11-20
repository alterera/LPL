'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface Player {
  id: string;
  playerName: string;
  contactNumber: string;
  registrationDate: string;
  paymentStatus: 'pending' | 'completed';
  paymentDate?: string;
  transactionId?: string;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/admin/players?paymentStatus=completed');
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
      } else {
        toast.error('Failed to load players');
      }
    } catch (error) {
      console.error('Failed to fetch players:', error);
      toast.error('Failed to load players');
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

  return (
    <div className="min-h-[80vh] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 px-4 py-12 pt-30">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Registered Players
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Complete list of players with completed payment
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Players List</CardTitle>
            <CardDescription>
              Total players: {players.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player Name</TableHead>
                  <TableHead>Contact Number</TableHead>
                  <TableHead>Registration Date</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-gray-500">
                      No players registered yet
                    </TableCell>
                  </TableRow>
                ) : (
                  players.map((player) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{player.playerName}</TableCell>
                      <TableCell>{player.contactNumber}</TableCell>
                      <TableCell>
                        {format(new Date(player.registrationDate), 'PPP')}
                      </TableCell>
                      <TableCell>
                        {player.paymentDate
                          ? format(new Date(player.paymentDate), 'PPP')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {player.transactionId || 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


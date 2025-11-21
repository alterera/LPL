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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface Player {
  id: string;
  playerName: string;
  playerPhoto: string;
  aadharNumber: string;
  contactNumber: string;
  registrationDate: string;
  paymentStatus: 'pending' | 'completed';
  paymentDate?: string;
  transactionId?: string;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await fetch('/api/admin/players');
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

  const handleViewPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setDialogOpen(true);
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
        <div className="flex items-center gap-4 justify-between">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-base md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              All Players
            </h1>
            
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
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Transaction ID</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-gray-500">
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
                        <Badge
                          variant={player.paymentStatus === 'completed' ? 'default' : 'secondary'}
                          className={
                            player.paymentStatus === 'completed'
                              ? 'bg-green-500 hover:bg-green-600'
                              : 'bg-yellow-500 hover:bg-yellow-600'
                          }
                        >
                          {player.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {player.paymentDate
                          ? format(new Date(player.paymentDate), 'PPP')
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {player.transactionId || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewPlayer(player)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Player Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Player Details</DialogTitle>
            <DialogDescription>
              View detailed information about the player
            </DialogDescription>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-4">
              <div className="flex justify-center">
                {selectedPlayer.playerPhoto && (
                  <Image
                    src={selectedPlayer.playerPhoto}
                    alt={selectedPlayer.playerName}
                    width={200}
                    height={200}
                    className="rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Player Name</p>
                  <p className="font-semibold">{selectedPlayer.playerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Aadhaar Number</p>
                  <p className="font-semibold">{selectedPlayer.aadharNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Contact Number</p>
                  <p className="font-semibold">{selectedPlayer.contactNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Status</p>
                  <Badge
                    variant={selectedPlayer.paymentStatus === 'completed' ? 'default' : 'secondary'}
                    className={
                      selectedPlayer.paymentStatus === 'completed'
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-yellow-500 hover:bg-yellow-600'
                    }
                  >
                    {selectedPlayer.paymentStatus === 'completed' ? 'Completed' : 'Pending'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


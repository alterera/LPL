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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { format } from 'date-fns';
import { ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const PLAYERS_PER_PAGE = 30;

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
  bowlingStyle?: string[];
  battingStyle?: string[];
  primaryRole?: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  useEffect(() => {
    fetchPlayers(currentPage);
  }, [currentPage]);

  const fetchPlayers = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/players?page=${page}&limit=${PLAYERS_PER_PAGE}`);
      if (response.ok) {
        const data = await response.json();
        setPlayers(data.players);
        setPagination(data.pagination);
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
              {pagination ? `Total players: ${pagination.total} | Showing page ${pagination.page} of ${pagination.totalPages}` : `Total players: ${players.length}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Player Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Contact Number</TableHead>
                    <TableHead className="hidden md:table-cell">Registration Date</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Payment Date</TableHead>
                    <TableHead className="hidden xl:table-cell">Transaction ID</TableHead>
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
                        <TableCell className="hidden sm:table-cell">{player.contactNumber}</TableCell>
                        <TableCell className="hidden md:table-cell">
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
                        <TableCell className="hidden lg:table-cell">
                          {player.paymentDate
                            ? format(new Date(player.paymentDate), 'PPP')
                            : 'N/A'}
                        </TableCell>
                        <TableCell className="hidden xl:table-cell font-mono text-xs">
                          {player.transactionId || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewPlayer(player)}
                          >
                            <Eye className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      if (
                        page === 1 ||
                        page === pagination.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                      ) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <PaginationItem key={page}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }
                      return null;
                    })}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < pagination.totalPages) {
                            setCurrentPage(currentPage + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className={currentPage === pagination.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Player Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Player Details</DialogTitle>
            <DialogDescription>
              View detailed information about the player
            </DialogDescription>
          </DialogHeader>
          {selectedPlayer && (
            <div className="space-y-6">
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
              
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Registration Date</p>
                    <p className="font-semibold">
                      {format(new Date(selectedPlayer.registrationDate), 'PPP')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Player Attributes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Player Attributes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Primary Role</p>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {selectedPlayer.primaryRole || 'N/A'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Bowling Style</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayer.bowlingStyle && selectedPlayer.bowlingStyle.length > 0 ? (
                        selectedPlayer.bowlingStyle.map((style, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {style}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Batting Style</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedPlayer.battingStyle && selectedPlayer.battingStyle.length > 0 ? (
                        selectedPlayer.battingStyle.map((style, index) => (
                          <Badge key={index} variant="secondary" className="text-sm">
                            {style}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Payment Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {selectedPlayer.paymentDate && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Payment Date</p>
                      <p className="font-semibold">
                        {format(new Date(selectedPlayer.paymentDate), 'PPP')}
                      </p>
                    </div>
                  )}
                  {selectedPlayer.transactionId && (
                    <div className="sm:col-span-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Transaction ID</p>
                      <p className="font-mono text-sm break-all">{selectedPlayer.transactionId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}


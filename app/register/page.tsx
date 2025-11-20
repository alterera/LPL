'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ImageUpload from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const GP_OPTIONS = ['Bhuragaon', 'Balidunga', 'Laharighat'];

interface FormData {
  playerPhoto: string;
  playerName: string;
  contactNumber: string;
  dateOfBirth: Date | null;
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
}

interface ExistingPlayerData {
  playerName: string;
  registrationDate?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [existingPlayer, setExistingPlayer] = useState<ExistingPlayerData | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsDialogOpen, setTermsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    playerPhoto: '',
    playerName: '',
    contactNumber: '',
    dateOfBirth: null,
    aadharNumber: '',
    village: '',
    postOffice: '',
    policeStation: '',
    city: '',
    gpSelection: '',
    parentName: '',
    parentContact: '',
    emergencyContactName: '',
    emergencyPhone: '',
  });

  useEffect(() => {
    // Check if user is already registered as a player
    // Note: Authentication is handled by middleware, so if user reaches this page, they are authenticated
    const checkPlayerStatus = async () => {
      try {
        // Check if already registered as player
        const playerResponse = await fetch('/api/players/me');
        if (playerResponse.ok) {
          const data = await playerResponse.json();
          if (data.player) {
            setIsRegistered(true);
            setExistingPlayer({
              playerName: data.player.playerName,
              registrationDate: data.player.registrationDate,
            });
          }
        }
        // If playerResponse is not ok, user is not registered yet, which is fine
        // They can proceed with registration
      } catch (error) {
        // Error checking player status, but don't redirect
        // User is authenticated (middleware ensures this), so allow them to register
        console.error('Error checking player status:', error);
      } finally {
        setCheckingStatus(false);
      }
    };
    checkPlayerStatus();
  }, []);

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.playerPhoto || !formData.playerName || !formData.contactNumber || !formData.dateOfBirth) {
          toast.error('Please fill all fields in Step 1');
          return false;
        }
        return true;
      case 2:
        if (!formData.aadharNumber || !formData.village || !formData.postOffice || !formData.policeStation || !formData.city || !formData.gpSelection) {
          toast.error('Please fill all fields in Step 2');
          return false;
        }
        return true;
      case 3:
        if (!formData.parentName || !formData.parentContact || !formData.emergencyContactName || !formData.emergencyPhone) {
          toast.error('Please fill all fields in Step 3');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      toast.error('Please complete all steps');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/players/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth?.toISOString(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful! Please proceed to payment.');
        setCurrentStep(5); // Move to payment step
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the Terms and Conditions to proceed');
      return;
    }

    setLoading(true);
    try {
      // Create payment order
      const paymentResponse = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok && paymentData.payment?.paymentUrl) {
        toast.success('Redirecting to payment gateway...');
        // Redirect to payment gateway
        window.location.href = paymentData.payment.paymentUrl;
      } else {
        toast.error(paymentData.error || 'Failed to create payment order');
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label className='pb-2'>Player Photo</Label>
              <ImageUpload
                onImageUpload={(url) => updateFormData('playerPhoto', url)}
                currentImage={formData.playerPhoto}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="playerName">Player Name *</Label>
              <Input
                id="playerName"
                value={formData.playerName}
                onChange={(e) => updateFormData('playerName', e.target.value)}
                placeholder="Enter player's full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                type="tel"
                value={formData.contactNumber}
                onChange={(e) => updateFormData('contactNumber', e.target.value)}
                placeholder="Enter contact number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Date of Birth *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dateOfBirth ? (
                      format(formData.dateOfBirth, 'PPP')
                    ) : (
                      <span>Select date of birth</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dateOfBirth || undefined}
                    onSelect={(date) => updateFormData('dateOfBirth', date)}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number *</Label>
              <Input
                id="aadharNumber"
                value={formData.aadharNumber}
                onChange={(e) => updateFormData('aadharNumber', e.target.value)}
                placeholder="Enter Aadhar number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="village">Village *</Label>
              <Input
                id="village"
                value={formData.village}
                onChange={(e) => updateFormData('village', e.target.value)}
                placeholder="Enter village name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postOffice">Post Office *</Label>
              <Input
                id="postOffice"
                value={formData.postOffice}
                onChange={(e) => updateFormData('postOffice', e.target.value)}
                placeholder="Enter post office"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="policeStation">Police Station *</Label>
              <Input
                id="policeStation"
                value={formData.policeStation}
                onChange={(e) => updateFormData('policeStation', e.target.value)}
                placeholder="Enter police station"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => updateFormData('city', e.target.value)}
                placeholder="Enter city name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gpSelection">GP Selection *</Label>
              <Select
                value={formData.gpSelection}
                onValueChange={(value) => updateFormData('gpSelection', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select GP" />
                </SelectTrigger>
                <SelectContent>
                  {GP_OPTIONS.map((gp) => (
                    <SelectItem key={gp} value={gp}>
                      {gp}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="parentName">Parent Name *</Label>
              <Input
                id="parentName"
                value={formData.parentName}
                onChange={(e) => updateFormData('parentName', e.target.value)}
                placeholder="Enter parent's name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentContact">Parent Contact *</Label>
              <Input
                id="parentContact"
                type="tel"
                value={formData.parentContact}
                onChange={(e) => updateFormData('parentContact', e.target.value)}
                placeholder="Enter parent's contact number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
              <Input
                id="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={(e) => updateFormData('emergencyContactName', e.target.value)}
                placeholder="Enter emergency contact name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Phone *</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => updateFormData('emergencyPhone', e.target.value)}
                placeholder="Enter emergency phone number"
                required
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold mb-4">Review Your Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Player Photo</Label>
                {formData.playerPhoto && (
                  <img src={formData.playerPhoto} alt="Player" className="mt-2 w-24 h-24 object-cover rounded" />
                )}
              </div>
              <div>
                <Label className="text-sm text-gray-500">Player Name</Label>
                <p className="mt-1">{formData.playerName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Contact Number</Label>
                <p className="mt-1">{formData.contactNumber}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Date of Birth</Label>
                <p className="mt-1">{formData.dateOfBirth ? format(formData.dateOfBirth, 'PPP') : 'N/A'}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Aadhar Number</Label>
                <p className="mt-1">{formData.aadharNumber}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Village</Label>
                <p className="mt-1">{formData.village}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Post Office</Label>
                <p className="mt-1">{formData.postOffice}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Police Station</Label>
                <p className="mt-1">{formData.policeStation}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">City</Label>
                <p className="mt-1">{formData.city}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">GP Selection</Label>
                <p className="mt-1">{formData.gpSelection}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Parent Name</Label>
                <p className="mt-1">{formData.parentName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Parent Contact</Label>
                <p className="mt-1">{formData.parentContact}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Emergency Contact Name</Label>
                <p className="mt-1">{formData.emergencyContactName}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Emergency Phone</Label>
                <p className="mt-1">{formData.emergencyPhone}</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={handleSubmit}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </Button>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            <h3 className="text-lg font-semibold">Registration Successful!</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please complete the payment to finalize your registration.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹100</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Registration Fee</p>
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms-checkbox" className="text-sm text-left text-gray-700 dark:text-gray-300 cursor-pointer flex-1">
                I accept the{' '}
                <Dialog open={termsDialogOpen} onOpenChange={setTermsDialogOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        setTermsDialogOpen(true);
                      }}
                    >
                      Terms and Conditions
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Terms and Conditions</DialogTitle>
                      <DialogDescription>
                        Please read the following terms and conditions carefully before proceeding with payment.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm text-gray-700 dark:text-gray-300">
                      <div className="space-y-4">
                        <section>
                          <h3 className="font-semibold text-base mb-2">1. Registration and Eligibility</h3>
                          <p className="mb-2">
                            By registering for the Laharighat Premier League (LPL), you confirm that:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>You are at least 16 years of age or have parental consent</li>
                            <li>All information provided during registration is accurate and truthful</li>
                            <li>You meet the eligibility criteria as specified by the tournament organizers</li>
                            <li>You have the necessary medical clearance to participate in cricket activities</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">2. Payment and Refund Policy</h3>
                          <p className="mb-2">
                            The registration fee of ₹100 is non-refundable under the following circumstances:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Once payment is processed, no refunds will be issued</li>
                            <li>Refunds may only be considered in case of tournament cancellation by organizers</li>
                            <li>Any disputes regarding payments must be raised within 7 days of transaction</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">3. Code of Conduct</h3>
                          <p className="mb-2">
                            All participants are expected to:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Maintain sportsmanlike behavior on and off the field</li>
                            <li>Respect fellow players, officials, and spectators</li>
                            <li>Follow all tournament rules and regulations</li>
                            <li>Abstain from any form of misconduct, including but not limited to verbal abuse, physical altercations, or cheating</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">4. Liability and Risk</h3>
                          <p className="mb-2">
                            Participation in the Laharighat Premier League involves inherent risks. By registering, you acknowledge that:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>You participate at your own risk</li>
                            <li>The organizers are not liable for any injuries, damages, or losses incurred during the tournament</li>
                            <li>You are responsible for your own medical insurance and coverage</li>
                            <li>You will not hold the organizers responsible for any accidents or incidents</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">5. Data Privacy</h3>
                          <p className="mb-2">
                            Your personal information will be:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Used solely for tournament administration and communication</li>
                            <li>Protected in accordance with applicable data protection laws</li>
                            <li>Not shared with third parties without your explicit consent</li>
                            <li>Retained for tournament records and future communications</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">6. Tournament Rules</h3>
                          <p className="mb-2">
                            All participants must comply with:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Official tournament rules and regulations</li>
                            <li>Match schedules and timing requirements</li>
                            <li>Equipment and uniform standards</li>
                            <li>Decisions made by tournament officials and umpires</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">7. Disqualification</h3>
                          <p className="mb-2">
                            The organizers reserve the right to disqualify any participant who:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Violates the code of conduct</li>
                            <li>Provides false information during registration</li>
                            <li>Engages in unsportsmanlike behavior</li>
                            <li>Fails to comply with tournament rules and regulations</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">8. Changes and Cancellations</h3>
                          <p className="mb-2">
                            The organizers reserve the right to:
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-2">
                            <li>Modify tournament schedules, venues, or formats as necessary</li>
                            <li>Cancel or postpone the tournament due to unforeseen circumstances</li>
                            <li>Make changes to rules and regulations with prior notice</li>
                          </ul>
                        </section>

                        <section>
                          <h3 className="font-semibold text-base mb-2">9. Acceptance</h3>
                          <p className="mb-2">
                            By checking the "I accept the Terms and Conditions" checkbox and proceeding with payment, you acknowledge that you have read, understood, and agree to be bound by all the terms and conditions stated above.
                          </p>
                        </section>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t">
                      <Button onClick={() => setTermsDialogOpen(false)}>Close</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </label>
            </div>

            <Button
              type="button"
              onClick={handlePayment}
              className="w-full"
              disabled={loading || !termsAccepted}
            >
              {loading ? 'Processing Payment...' : 'Pay Now'}
            </Button>
            {!termsAccepted && (
              <p className="text-xs text-red-500 dark:text-red-400">
                Please accept the Terms and Conditions to proceed with payment
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking registration status...</p>
        </div>
      </div>
    );
  }

  if (isRegistered) {
    return (
      <div className="px-4 py-12 pt-40 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-2xl mx-auto">
          <Card className="border border-amber-200 bg-white/80 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">Player Already Registered</CardTitle>
              <CardDescription className="text-center">
                {existingPlayer?.playerName
                  ? `${existingPlayer.playerName}, you have already completed your player registration.`
                  : 'You have already completed your player registration.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {existingPlayer?.registrationDate && (
                <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 text-center text-sm text-amber-700">
                  Registered on {format(new Date(existingPlayer.registrationDate), 'PPP')}
                </div>
              )}
              <p className="text-gray-600 dark:text-gray-400 text-center">
                You can view your registration details and payment status from your dashboard.
              </p>
              <div className="flex justify-center">
                <Button
                  className="rounded-full px-6"
                  onClick={() => router.push('/dashboard')}
                >
                  View registration details
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] px-4 py-12 pt-30">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Player Registration</CardTitle>
            <CardDescription className="text-center">
              Step {currentStep} of 5
            </CardDescription>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 5) * 100}%` }}
              />
            </div>
          </CardHeader>
          <CardContent>
            {renderStep()}
            {currentStep < 4 && (
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNext}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


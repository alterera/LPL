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

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
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
    // Check if user is authenticated first
    const checkAuth = async () => {
      try {
        const authResponse = await fetch('/api/auth/me');
        if (!authResponse.ok) {
          // User not authenticated, redirect to login
          router.push('/login?redirect=/register');
          return;
        }

        // User is authenticated, check if already registered
        const playerResponse = await fetch('/api/players/me');
        if (playerResponse.ok) {
          const data = await playerResponse.json();
          if (data.player) {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        // Error checking auth, redirect to login
        router.push('/login?redirect=/register');
      }
    };
    checkAuth();
  }, [router]);

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
    setLoading(true);
    try {
      // Get player ID
      const playerResponse = await fetch('/api/players/me');
      const playerData = await playerResponse.json();

      if (!playerData.player) {
        toast.error('Player not found');
        return;
      }

      const paymentResponse = await fetch('/api/players/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerId: playerData.player.id }),
      });

      const paymentData = await paymentResponse.json();

      if (paymentResponse.ok) {
        toast.success('Payment successful! Registration complete.');
        router.push('/dashboard');
      } else {
        toast.error(paymentData.error || 'Payment failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
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
            <Button
              type="button"
              onClick={handlePayment}
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Processing Payment...' : 'Pay Now'}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Player Registration</CardTitle>
            <CardDescription className="text-center">
              Step {currentStep} of 4
            </CardDescription>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 4) * 100}%` }}
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


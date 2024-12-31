'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Mail, CheckCircle} from 'lucide-react';
import { RootState } from '../../../../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { sendOtp, verifyOtp } from '@/services/auth';
import { getUserProfileFromCookie } from '../../../../../actions/getUserProfileFromCookie';
import { setUserInfo } from '../../../../../redux/slices/userSlice';

const DEFAULT_EMAIL = 'admin@gmail.com';

export default function VerifyEmail() {
  const [email, setEmail] = useState(DEFAULT_EMAIL);
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('');
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const handleSendOtp = async(e: React.FormEvent) => {
    e.preventDefault();
    
    setError('');
    if (email !== user.email) {
      setError('Not your account email. Please use the correct email address.');
      return;
    }
    // Pretend to call API to send OTP 
    try {
      setLoading(true);
      await sendOtp();
      setStep(2);
    } catch (error) {
      setError('Failed to send OTP. Please try again.');
      console.log(error);
    } finally {
      setLoading(false);
    }

  };

  const handleVerifyOtp = async(e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await verifyOtp(otp);
      const userProfile = await getUserProfileFromCookie()
      dispatch(setUserInfo(userProfile));
      setStep(3);
      setError('');
      setOtp('');
    } catch (error) {
      console.log(error);
      setError('Incorrect OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-2">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              s <= step
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {s}
          </div>
          {s < 3 && (
            <div
              className={`h-1 w-12 ${
                s < step
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                  : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className = "py-4">
        {renderStepIndicator()}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              disabled={loading}  
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <Mail className="mr-2 h-4 w-4" />
              Send OTP
            </Button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="text-sm font-medium text-gray-700">
                Enter OTP
              </Label>
              <InputOTP 
                maxLength={6} 
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={otp}
                onChange={setOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-blue-600 hover:to-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Verify OTP
            </Button>
          </form>
        )}
        {step === 3 && (
          <Alert className="bg-green-100 border-green-500">
            <AlertDescription className="text-green-700 flex items-center">
              <CheckCircle className="mr-2 h-4 w-4" />
              Email verified successfully!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}


import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, User, Mail, CheckCircle } from 'lucide-react';

interface LoginFormProps {
  onLogin: (pno: string, password: string) => Promise<void>;
  onSignUp: (pno: string, password: string, email: string, name: string) => Promise<string>;
  isLoading: boolean;
}

const LoginForm = ({ onLogin, onSignUp, isLoading }: LoginFormProps) => {
  const [pno, setPno] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (isSignUp) {
      // Sign up validation
      if (!pno || !password || !email || !name || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }

      try {
        const message = await onSignUp(pno, password, email, name);
        setSuccessMessage(message);
        // Reset form and switch to login
        setPno('');
        setPassword('');
        setEmail('');
        setName('');
        setConfirmPassword('');
        // Auto switch to login after successful signup
        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMessage('');
        }, 2000);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Sign up failed');
      }

    } else {
      // Sign in validation
      if (!pno || !password) {
        setError('Please fill in all fields');
        return;
      }

      try {
        await onLogin(pno, password);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Login failed');
        // Clear form fields on invalid credentials to allow easy re-entry
        setPno('');
        setPassword('');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccessMessage('');
    setPno('');
    setPassword('');
    setEmail('');
    setName('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <img
                src="public/images/hvfr.png"
                alt="Heavy Vehicles Factory Logo"
                className="h-16 w-16 object-contain"
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">HVF e-Leave Portal</h1>
          <p className="text-gray-600">Heavy Vehicles Factory, Avadi</p>
          <div className="text-sm text-gray-500 mt-2">
            <div>हेवी व्हीकल्स फैक्ट्री, अवाडी</div>
            <div>கனரக வாகன தொழிற்சாலை, ஆவடி</div>
          </div>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-center">
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center">
              {isSignUp
                ? 'Create your account to access the portal'
                : 'Enter your personal number and password'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="pno">Personal Number</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="pno"
                    type="text"
                    placeholder="Enter your personal number"
                    value={pno}
                    onChange={(e) => setPno(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading
                  ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                  : (isSignUp ? 'Sign Up' : 'Sign In')
                }
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-blue-600 hover:text-blue-700 underline"
                disabled={isLoading}
              >
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"
                }
              </button>
            </div>

            {!isSignUp && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Demo Credentials:</h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Admin: PNO: 1001, Password: admin123</div>
                  <div>Employee: PNO: 2001, Password: emp123</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;

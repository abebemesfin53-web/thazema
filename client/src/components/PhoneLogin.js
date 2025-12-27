import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './PhoneLogin.css';

const PhoneLogin = ({ onSwitchToEmail }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginWithPhone, verifyOTP } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await loginWithPhone(phone);
      console.log('OTP sent successfully:', result);
      setStep('otp');
    } catch (err) {
      console.error('OTP Error:', err);
      if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the application is running.');
      } else {
        setError(err.response?.data?.error || 'Failed to send OTP. Please check if the server is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyOTP(phone, otp);
      console.log('OTP verified successfully:', result);
      // Navigation handled by AuthContext
    } catch (err) {
      console.error('OTP Verification Error:', err);
      if (err.response?.status === 400) {
        setError('Invalid or expired OTP. Please check the terminal for the correct code or request a new one.');
      } else if (err.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please ensure the application is running.');
      } else {
        setError(err.response?.data?.error || 'Invalid OTP. Check the terminal for the correct code.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatPhoneNumber = (value) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as +251 XXX XXX XXX
    if (digits.startsWith('251')) {
      const formatted = digits.replace(/(\d{3})(\d{3})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
      return formatted;
    } else if (digits.startsWith('0')) {
      // Convert 09XX to +251 9XX
      const withoutZero = digits.substring(1);
      const formatted = `+251 ${withoutZero.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`;
      return formatted;
    }
    return `+251 ${digits.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhone(formatted);
  };

  if (step === 'otp') {
    return (
      <div className="phone-login-container">
        <div className="phone-login-card">
          <h1 className="auth-title">Verify OTP</h1>
          <p className="auth-subtitle">
            Enter the 6-digit code sent to<br />
            <strong>{phone}</strong>
          </p>
          
          <form onSubmit={handleVerifyOTP} className="auth-form">
            {error && <div className="error-message">{error}</div>}
            
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              maxLength="6"
              className="auth-input otp-input"
              autoComplete="one-time-code"
            />
            
            <button type="submit" disabled={loading || otp.length !== 6} className="auth-button">
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
          </form>
          
          <div className="otp-help">
            <p><strong>📱 Where is my OTP?</strong></p>
            <p>Check the terminal/command prompt where you started the app.</p>
            <p>Look for: <code>📱 OTP for {phone}: XXXXXX</code></p>
            <p>Enter the 6-digit number shown there.</p>
            <p><strong>⚠️ OTP Not Working?</strong></p>
            <p>Try <strong>Email Login</strong> instead - it's more reliable!</p>
          </div>
          
          <div className="auth-actions">
            <button onClick={() => setStep('phone')} className="link-button">
              Change Phone Number
            </button>
            <button onClick={onSwitchToEmail} className="link-button">
              Use Email Instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="phone-login-container">
      <div className="phone-login-card">
        <h1 className="auth-title">Thazema</h1>
        <p className="auth-subtitle">Enter your phone number</p>
        
        <form onSubmit={handleSendOTP} className="auth-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="phone-input-container">
            <div className="country-code">
              <img src="/flag-ethiopia.png" alt="ET" className="flag-icon" />
              <span>+251</span>
            </div>
            <input
              type="tel"
              placeholder="9XX XXX XXX"
              value={phone.replace('+251 ', '')}
              onChange={handlePhoneChange}
              required
              className="auth-input phone-input"
              autoComplete="tel"
            />
          </div>
          
          <button type="submit" disabled={loading || phone.length < 13} className="auth-button">
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
        
        <div className="auth-actions">
          <button onClick={onSwitchToEmail} className="link-button">
            Use Email Instead
          </button>
        </div>
        
        <div className="admin-contact">
          <p>Administrator Contact:</p>
          <p><strong>Abebe Mesfin</strong></p>
          <p>📞 +251 914 319 514</p>
          <div className="troubleshooting-note">
            <p><strong>OTP Not Working?</strong></p>
            <p><strong>Quick Fix: Use Email Login!</strong></p>
            <p>Email: abebemesfin53@gmail.com</p>
            <p>Password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneLogin;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

export default function Login() {
    const navigate = useNavigate();
    const { login, isAuthenticated, setupMode, checkAuthStatus } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSetupMode, setIsSetupMode] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        checkAuthStatus().then(status => {
            if (status?.setup_required) {
                setIsSetupMode(true);
            }
        });
    }, [checkAuthStatus]);

    // Only redirect to home if authenticated and NOT in setup mode and NOT currently submitting
    useEffect(() => {
        if (isAuthenticated && !setupMode && !isSubmitting) {
            navigate('/');
        }
    }, [isAuthenticated, setupMode, isSubmitting, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        setIsSubmitting(true);

        const result = await login(username, password);

        if (result.success) {
            if (result.setupMode) {
                // Redirect to admin setup page
                navigate('/admin/setup');
            } else {
                navigate('/');
            }
        } else {
            setError(result.error);
            setIsSubmitting(false);
        }

        setIsLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="login-icon">
                        <LogIn size={32} />
                    </div>
                    <h1>Admin Panel</h1>
                    <p>Kelurahan Cakung Barat</p>
                </div>

                {isSetupMode && (
                    <div className="setup-notice">
                        <AlertCircle size={20} />
                        <div>
                            <strong>Setup Mode</strong>
                            <p>Belum ada admin. Gunakan <code>admin</code> / <code>admin123</code> untuk login pertama kali.</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Masukkan username"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Masukkan password"
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-login"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="loading-spinner"></span>
                        ) : (
                            <>
                                <LogIn size={18} />
                                Masuk
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

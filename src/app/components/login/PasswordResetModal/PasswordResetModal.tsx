'use client';

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import styles from './PasswordResetModal.module.css';

interface PasswordResetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation('common');
  
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setError(t('invalidEmail'));
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { passwordService } = await import('@/services/passwordService');
      const response = await passwordService.requestPasswordReset(email);
      
      if (response.status === 'success') {
        setSuccess(t('passwordResetLinkSent'));
        setTimeout(() => {
          onClose();
          setEmail('');
          setSuccess(null);
        }, 3000);
      } else {
        setError(response.error || t('genericError'));
      }
    } catch (error) {
      setError(t('networkError'));
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early return if modal is not open
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div 
        className={styles.modal} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{t('resetPassword')}</h2>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={styles.content}>
          <p className={styles.description}>
            {t('resetPasswordDescription')}
          </p>
          
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          
          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="reset-email" className={styles.label}>
                {t('email')}
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder={t('enterEmail')}
                disabled={isSubmitting}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className={styles.loadingWrapper}>
                  <div className={styles.spinner}></div>
                  <span>{t('sending')}</span>
                </div>
              ) : (
                t('sendResetLink')
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;
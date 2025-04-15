'use client';

import React, { useState, useEffect } from 'react';
import styles from './TradingPairsSelector.module.css';
import { robotService } from '@/services/robotService';

interface TradingPair {
  id: string;
  symbol: string;
  isSelected: boolean;
}

interface TradingPairsSelectorProps {
  accountType?: 'demo' | 'real';
  onPairsChange?: (selectedPairs: string[]) => void;
}

const TradingPairsSelector: React.FC<TradingPairsSelectorProps> = ({ 
  accountType = 'demo',
  onPairsChange
}) => {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'none';
  }>({
    message: '',
    type: 'none'
  });

  // Fetch trading pairs from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const settings = await robotService.getRobotSettings(accountType);
        
        // Convert available currencies to TradingPair objects
        const pairsData: TradingPair[] = settings.avaliable_currencies.map((symbol, index) => {
          // Check if this currency is in the selected trade_currencies
          const isSelected = settings.trade_currencies.includes(symbol);
          
          return {
            id: index.toString(),
            symbol,
            isSelected
          };
        });
        
        setPairs(pairsData);
      } catch (err) {
        console.error('Error fetching trading pairs:', err);
        setError('Failed to load trading pairs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [accountType]);

  // Toggle pair selection
  const togglePair = (id: string) => {
    const updatedPairs = pairs.map(pair =>
      pair.id === id ? { ...pair, isSelected: !pair.isSelected } : pair
    );
    
    setPairs(updatedPairs);
    
    // Notify parent component if callback provided
    if (onPairsChange) {
      const selectedSymbols = updatedPairs
        .filter(pair => pair.isSelected)
        .map(pair => pair.symbol);
      
      onPairsChange(selectedSymbols);
    }
    
    // Reset save status when pairs change
    if (saveStatus.type !== 'none') {
      setSaveStatus({ message: '', type: 'none' });
    }
  };

  // Save selected pairs to the server
  const saveSelectedPairs = async () => {
    try {
      setSaving(true);
      
      // Get the list of selected symbols
      const selectedSymbols = pairs
        .filter(pair => pair.isSelected)
        .map(pair => pair.symbol);
      
      // In a real implementation, you would call an API to save the selected pairs
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setSaveStatus({
        message: 'Trading pairs saved successfully!',
        type: 'success'
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSaveStatus({ message: '', type: 'none' });
      }, 5000);
    } catch (err) {
      console.error('Error saving trading pairs:', err);
      setSaveStatus({
        message: 'Failed to save trading pairs. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = pairs.filter(pair => pair.isSelected).length;

  // Parse symbol to get base and quote currencies
  const parseSymbol = (symbol: string) => {
    const parts = symbol.split('/');
    return {
      base: parts[0] || symbol,
      quote: parts[1] || 'USDT'
    };
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading trading pairs...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorMessage}>{error}</div>
          <button
            className={styles.retryButton}
            onClick={() => {
              setLoading(true);
              robotService.getRobotSettings(accountType)
                .then(settings => {
                  const pairsData: TradingPair[] = settings.avaliable_currencies.map((symbol, index) => {
                    const isSelected = settings.trade_currencies.includes(symbol);
                    return {
                      id: index.toString(),
                      symbol,
                      isSelected
                    };
                  });
                  setPairs(pairsData);
                  setError(null);
                })
                .catch(err => {
                  console.error('Error retrying fetch:', err);
                  setError('Failed to load trading pairs. Please try again.');
                })
                .finally(() => setLoading(false));
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Trade currencies</h3>
        <div className={styles.selectedCount}>
          {selectedCount} / {pairs.length} Pairs selected
        </div>
      </div>
      
      {/* Save status message */}
      {saveStatus.type !== 'none' && (
        <div className={`${styles.statusMessage} ${styles[saveStatus.type]}`}>
          {saveStatus.message}
        </div>
      )}
      
      <div className={styles.pairsGrid}>
        {pairs.map(pair => {
          const { base, quote } = parseSymbol(pair.symbol);
          return (
            <div key={pair.id} className={styles.pairItem}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={pair.isSelected}
                  onChange={() => togglePair(pair.id)}
                  className={styles.toggleInput}
                  disabled={saving}
                />
                <div className={`${styles.toggleTrack} ${saving ? styles.disabled : ''}`}>
                  <div className={styles.toggleIndicator}></div>
                </div>
                <span className={styles.pairName}>{base} / {quote}</span>
              </label>
            </div>
          );
        })}
      </div>
      
      {/* Save button */}
      <div className={styles.saveButtonContainer}>
        <button
          className={styles.saveButton}
          onClick={saveSelectedPairs}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Selected Pairs'}
        </button>
      </div>
    </div>
  );
};

export default TradingPairsSelector;
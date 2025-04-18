'use client';

import React, { useState, useEffect } from 'react';
import styles from './TradingPairsSelector.module.css';
import { robotService } from '@/services/robotService';

interface TradingPair {
  id: string;
  symbol: string;
  isSelected: boolean;
}

interface RobotSettings {
  leverage: number;
  minTradeAmount: number;
  maxTradeAmount: number;
  pairs: 'all' | string[];
  autoSettings?: any;
}

interface TradingPairsSelectorProps {
  accountType?: 'demo' | 'real';
  onSettingsChange?: (settings: RobotSettings) => void;
}

const LEVERAGE_OPTIONS = [3, 5, 20, 50, 100];

// Default auto settings values
const AUTO_SETTINGS: Omit<RobotSettings, 'autoSettings'> = {
  leverage: 20,
  minTradeAmount: 25,
  maxTradeAmount: 25,
  pairs: 'all', 
};

const TradingPairsSelector: React.FC<TradingPairsSelectorProps> = ({ 
  accountType = 'demo',
  onSettingsChange
}) => {
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [useAllPairs, setUseAllPairs] = useState(false);
  const [useAutoSettings, setUseAutoSettings] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState<RobotSettings>({
    leverage: 20,
    minTradeAmount: 25,
    maxTradeAmount: 250,
    pairs: [],
    autoSettings: false
  });
  
  const [saveStatus, setSaveStatus] = useState<{
    message: string;
    type: 'success' | 'error' | 'none';
  }>({
    message: '',
    type: 'none'
  });

  // Fetch trading pairs and current settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const robotSettings = await robotService.getRobotSettings(accountType);
        
        // Check if all pairs are selected
        const isAllPairs = robotSettings.trade_currencies === 'all';
        setUseAllPairs(isAllPairs);
        
        // Convert available currencies to TradingPair objects
        const pairsData: TradingPair[] = robotSettings.avaliable_currencies.map((symbol, index) => {
          // If "all" is selected, mark all as selected
          // Otherwise check if this currency is in the selected trade_currencies
          const isSelected = isAllPairs || 
            (Array.isArray(robotSettings.trade_currencies) && 
             robotSettings.trade_currencies.includes(symbol));
          
          return {
            id: index.toString(),
            symbol,
            isSelected
          };
        });
        
        setPairs(pairsData);
        
        // Initialize settings from API response
        // For now we're using default values as the API doesn't return these
        // In a real implementation, these would come from the API
        setSettings({
          leverage: 20,
          minTradeAmount: 25,
          maxTradeAmount: 250,
          pairs: isAllPairs ? 'all' : (Array.isArray(robotSettings.trade_currencies) ? 
            robotSettings.trade_currencies : []),
          autoSettings: false
        });
      } catch (err) {
        console.error('Error fetching trading pairs:', err);
        setError('Failed to load trading settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [accountType]);

  // Toggle pair selection
  const togglePair = (id: string) => {
    // If all pairs mode is on or auto settings is enabled, do nothing
    if (useAllPairs || useAutoSettings) return;
    
    const updatedPairs = pairs.map(pair =>
      pair.id === id ? { ...pair, isSelected: !pair.isSelected } : pair
    );
    
    setPairs(updatedPairs);
    
    // Update settings with selected pairs
    const selectedSymbols = updatedPairs
      .filter(pair => pair.isSelected)
      .map(pair => pair.symbol);
    
    updateSettings('pairs', selectedSymbols);
    
    // Reset save status when pairs change
    if (saveStatus.type !== 'none') {
      setSaveStatus({ message: '', type: 'none' });
    }
  };

  // Toggle between "all pairs" and selected pairs
  const toggleAllPairs = () => {
    // If auto settings is enabled, do nothing
    if (useAutoSettings) return;
    
    const newUseAllPairs = !useAllPairs;
    setUseAllPairs(newUseAllPairs);
    
    // If switching to "all", update all pairs to selected
    if (newUseAllPairs) {
      setPairs(pairs.map(pair => ({ ...pair, isSelected: true })));
      updateSettings('pairs', 'all');
    } else {
      // If switching from "all" to selection, keep all currently selected
      const selectedSymbols = pairs.map(pair => pair.symbol);
      updateSettings('pairs', selectedSymbols);
    }
    
    // Reset save status
    if (saveStatus.type !== 'none') {
      setSaveStatus({ message: '', type: 'none' });
    }
  };

  // Toggle auto settings mode
  const toggleAutoSettings = () => {
    const newUseAutoSettings = !useAutoSettings;
    setUseAutoSettings(newUseAutoSettings);
    
    if (newUseAutoSettings) {
      // Apply auto settings
      setUseAllPairs(true);
      setPairs(pairs.map(pair => ({ ...pair, isSelected: true })));
      
      // Store current settings temporarily
      const previousSettings = { ...settings };
      
      // Update settings with auto values
      setSettings({
        ...AUTO_SETTINGS,
        autoSettings: true
      });
      
      // Notify parent component if callback provided
      if (onSettingsChange) {
        onSettingsChange({
          ...AUTO_SETTINGS,
          autoSettings: true
        });
      }
    } else {
      // Revert to regular settings - we just turn off auto mode
      updateSettings('autoSettings', false);
    }
    
    // Reset save status
    if (saveStatus.type !== 'none') {
      setSaveStatus({ message: '', type: 'none' });
    }
  };

  // Update settings
  const updateSettings = (key: keyof RobotSettings, value: any) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      
      // Notify parent component if callback provided
      if (onSettingsChange) {
        onSettingsChange(updated);
      }
      
      return updated;
    });
  };

  // Validate settings before saving
  const validateSettings = (): string | null => {
    // If auto settings is enabled, skip validation
    if (useAutoSettings) {
      return null;
    }
    
    if (settings.minTradeAmount < 5 || settings.minTradeAmount > 10000) {
      return 'Minimum trade amount must be between 5 and 10000 USDT';
    }
    
    if (settings.maxTradeAmount < 25 || settings.maxTradeAmount > 10000) {
      return 'Maximum trade amount must be between 25 and 10000 USDT';
    }
    
    if (settings.minTradeAmount >= settings.maxTradeAmount) {
      return 'Minimum trade amount must be less than maximum trade amount';
    }
    
    if (!useAllPairs && Array.isArray(settings.pairs) && settings.pairs.length === 0) {
      return 'Please select at least one trading pair';
    }
    
    return null;
  };

  // Save settings to the server
  const saveSettings = async () => {
    // Validate settings
    const validationError = validateSettings();
    if (validationError) {
      setSaveStatus({
        message: validationError,
        type: 'error'
      });
      return;
    }
    
    try {
      setSaving(true);
      
      // Prepare request payload
      const payload = {
        robot_type: accountType,
        leverage: settings.leverage,
        minTradeAmount: settings.minTradeAmount,
        maxTradeAmount: settings.maxTradeAmount,
        pairs: settings.pairs,
        autoSettings: settings.autoSettings
      };
      
      console.log('Saving settings:', payload);
      
      // Call the API to save settings
      const response = await robotService.saveRobotSettings(payload);
      
      if (response.status === 'err') {
        throw new Error(response.msg || 'Failed to save settings');
      }
      
      // Show success message
      setSaveStatus({
        message: 'Trading settings saved successfully!',
        type: 'success'
      });
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setSaveStatus({ message: '', type: 'none' });
      }, 5000);
    } catch (err) {
      console.error('Error saving trading settings:', err);
      setSaveStatus({
        message: 'Failed to save trading settings. Please try again.',
        type: 'error'
      });
    } finally {
      setSaving(false);
    }
  };

  const selectedCount = useAllPairs ? pairs.length : pairs.filter(pair => pair.isSelected).length;

  const parseSymbol = (symbol: string) => {
    const lower = symbol.toLowerCase();
  
    if (lower.endsWith('usdt')) {
      const base = lower.slice(0, -4).toUpperCase();
      return {
        base,
        quote: 'USDT'
      };
    }
  
    // fallback на случай чего-то нестандартного
    return {
      base: symbol.toUpperCase(),
      quote: ''
    };
  };
  

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <span>Loading trading settings...</span>
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
                .then(robotSettings => {
                  const isAllPairs = robotSettings.trade_currencies === 'all';
                  setUseAllPairs(isAllPairs);
                  
                  const pairsData: TradingPair[] = robotSettings.avaliable_currencies.map((symbol, index) => {
                    const isSelected = isAllPairs || 
                      (Array.isArray(robotSettings.trade_currencies) && 
                       robotSettings.trade_currencies.includes(symbol));
                    
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
                  setError('Failed to load trading settings. Please try again.');
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
        <h3 className={styles.title}>Robot Settings</h3>
      </div>
      
      {/* Save status message */}
      {saveStatus.type !== 'none' && (
        <div className={`${styles.statusMessage} ${styles[saveStatus.type]}`}>
          {saveStatus.message}
        </div>
      )}
      
      {/* Auto Settings toggle */}
      <div className={styles.settingsSection}>
        <div className={styles.autoSettingsContainer}>
          <label className={styles.autoSettingsToggle}>
            <input
              type="checkbox"
              checked={useAutoSettings}
              onChange={toggleAutoSettings}
              className={styles.toggleInput}
              disabled={saving}
            />
            <div className={`${styles.toggleTrack} ${saving ? styles.disabled : ''} ${useAutoSettings ? styles.active : ''}`}>
              <div className={styles.toggleIndicator}></div>
            </div>
            <span className={styles.autoToggleLabel}>Auto Settings</span>
          </label>
          
          {useAutoSettings && (
            <div className={styles.autoSettingsInfo}>
              <p>Auto settings mode is enabled. The robot will use optimized parameters:</p>
              <ul className={styles.autoSettingsList}>
                <li>All trading pairs are selected</li>
                <li>Leverage: 20x</li>
                <li>Min/Max trade amount: 25 USDT</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      {/* Leverage section */}
      <div className={`${styles.settingsSection} ${useAutoSettings ? styles.disabledSection : ''}`}>
        <h4 className={styles.sectionTitle}>Leverage</h4>
        <div className={styles.leverageOptions}>
          {LEVERAGE_OPTIONS.map(option => (
            <button
              key={option}
              className={`${styles.leverageButton} ${
                (useAutoSettings ? AUTO_SETTINGS.leverage : settings.leverage) === option 
                  ? styles.activeLeverage 
                  : ''
              }`}
              onClick={() => updateSettings('leverage', option)}
              disabled={saving || useAutoSettings}
            >
              {option}x
            </button>
          ))}
        </div>
      </div>
      
      {/* Trade amounts section */}
      <div className={`${styles.settingsSection} ${useAutoSettings ? styles.disabledSection : ''}`}>
        <h4 className={styles.sectionTitle}>Trade Amounts (USDT)</h4>
        <div className={styles.amountsContainer}>
          <div className={styles.amountField}>
            <label className={styles.amountLabel}>Minimum (5-10,000)</label>
            <input
              type="number"
              min="5"
              max="10000"
              value={useAutoSettings ? AUTO_SETTINGS.minTradeAmount : settings.minTradeAmount}
              onChange={(e) => updateSettings('minTradeAmount', parseFloat(e.target.value) || 5)}
              className={styles.amountInput}
              disabled={saving || useAutoSettings}
            />
          </div>
          <div className={styles.amountField}>
            <label className={styles.amountLabel}>Maximum (25-10,000)</label>
            <input
              type="number"
              min="25"
              max="10000"
              value={useAutoSettings ? AUTO_SETTINGS.maxTradeAmount : settings.maxTradeAmount}
              onChange={(e) => updateSettings('maxTradeAmount', parseFloat(e.target.value) || 25)}
              className={styles.amountInput}
              disabled={saving || useAutoSettings}
            />
          </div>
        </div>
      </div>
      
      {/* Trading pairs section */}
      <div className={`${styles.settingsSection} ${useAutoSettings ? styles.disabledSection : ''}`}>
        <div className={styles.pairsHeader}>
          <h4 className={styles.sectionTitle}>Trading Pairs</h4>
          <div className={styles.selectedCount}>
            {useAutoSettings ? pairs.length : selectedCount} / {pairs.length} Pairs selected
          </div>
        </div>
        
        {/* All pairs toggle */}
        <label className={`${styles.allPairsToggle} ${useAutoSettings ? styles.disabled : ''}`}>
          <input
            type="checkbox"
            checked={useAutoSettings || useAllPairs}
            onChange={toggleAllPairs}
            className={styles.toggleInput}
            disabled={saving || useAutoSettings}
          />
          <div className={`${styles.toggleTrack} ${(saving || useAutoSettings) ? styles.disabled : ''} ${(useAutoSettings || useAllPairs) ? styles.active : ''}`}>
            <div className={styles.toggleIndicator}></div>
          </div>
          <span className={styles.toggleLabel}>Use all available pairs</span>
        </label>
        
        {/* Pairs grid */}
        <div className={styles.pairsGrid}>
          {pairs.map(pair => {
            const { base, quote } = parseSymbol(pair.symbol);
            return (
              <div key={pair.id} className={styles.pairItem}>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    checked={useAutoSettings || useAllPairs || pair.isSelected}
                    onChange={() => togglePair(pair.id)}
                    className={styles.toggleInput}
                    disabled={saving || useAutoSettings || useAllPairs}
                  />
                  <div className={`${styles.toggleTrack} ${(saving || useAutoSettings || useAllPairs) ? styles.disabled : ''} ${(useAutoSettings || useAllPairs || pair.isSelected) ? styles.active : ''}`}>
                    <div className={styles.toggleIndicator}></div>
                  </div>
                  <span className={styles.pairName}>{base}/{quote}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Save button */}
      <div className={styles.saveButtonContainer}>
        <button
          className={styles.saveButton}
          onClick={saveSettings}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default TradingPairsSelector;
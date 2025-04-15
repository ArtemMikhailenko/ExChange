'use client';

import { useTheme } from '@/app/context/ThemeContext';
import styles from './NetworkSelector.module.css';
import { useTranslation } from '@/hooks/useTranslation';

interface Network {
  id: string;
  name: string;
  full_name: string;
  crypto_id: string;
  fee: string;
  estimated_arrival_time: string;
  min_withdraw: string;
}

const networksByCrypto = {
  usdt: [
    { 
      id: 'trc20', 
      name: 'TRC20',
      full_name: 'Tron (TRC20)',
      crypto_id: 'usdt',
      fee: '1 USDT',
      estimated_arrival_time: '5-10 minutes',
      min_withdraw: '10 USDT'
    },
    { 
      id: 'erc20', 
      name: 'ERC20',
      full_name: 'Ethereum (ERC20)',
      crypto_id: 'usdt',
      fee: '10-20 USDT',
      estimated_arrival_time: '10-30 minutes',
      min_withdraw: '20 USDT'
    },
    { 
      id: 'bep20', 
      name: 'BEP20 (BSC)',
      full_name: 'Binance Smart Chain (BEP20)',
      crypto_id: 'usdt',
      fee: '0.5 USDT',
      estimated_arrival_time: '5-15 minutes',
      min_withdraw: '5 USDT'
    }
  ],
  btc: [
    { 
      id: 'btc', 
      name: 'BTC',
      full_name: 'Bitcoin Network',
      crypto_id: 'btc',
      fee: '0.0005 BTC',
      estimated_arrival_time: '10-60 minutes',
      min_withdraw: '0.0001 BTC'
    },
    { 
      id: 'lightning', 
      name: 'Lightning',
      full_name: 'Lightning Network',
      crypto_id: 'btc',
      fee: '0.00001 BTC',
      estimated_arrival_time: '1-5 minutes',
      min_withdraw: '0.00001 BTC'
    }
  ],
  eth: [
    { 
      id: 'eth', 
      name: 'ETH',
      full_name: 'Ethereum Network',
      crypto_id: 'eth',
      fee: '0.001 ETH',
      estimated_arrival_time: '5-20 minutes',
      min_withdraw: '0.01 ETH'
    },
    { 
      id: 'arbitrum', 
      name: 'Arbitrum',
      full_name: 'Arbitrum Network',
      crypto_id: 'eth',
      fee: '0.0001 ETH',
      estimated_arrival_time: '1-5 minutes',
      min_withdraw: '0.001 ETH'
    }
  ],
  sol: [
    { 
      id: 'sol', 
      name: 'SOL',
      full_name: 'Solana Network',
      crypto_id: 'sol',
      fee: '0.01 SOL',
      estimated_arrival_time: '1-3 minutes',
      min_withdraw: '0.1 SOL'
    }
  ],
  usdc: [
    { 
      id: 'erc20', 
      name: 'ERC20',
      full_name: 'Ethereum (ERC20)',
      crypto_id: 'usdc',
      fee: '10-20 USDC',
      estimated_arrival_time: '10-30 minutes',
      min_withdraw: '20 USDC'
    },
    { 
      id: 'solana', 
      name: 'Solana',
      full_name: 'Solana Network',
      crypto_id: 'usdc',
      fee: '0.01 USDC',
      estimated_arrival_time: '1-3 minutes',
      min_withdraw: '1 USDC'
    }
  ]
};

interface NetworkSelectorProps {
  onSelect: (network: Network) => void;
  crypto: any; // Replace with appropriate type
}

export default function NetworkSelector({ onSelect, crypto }: NetworkSelectorProps) {
  const { t, lang } = useTranslation();
  const { theme } = useTheme();
  
  if (!crypto) return null;
  
  // @ts-ignore
  const availableNetworks = networksByCrypto[crypto.id] || [];

  return (
    <div className={styles.container}>
      <p className={theme === 'dark' ? styles.descriptionDark : styles.descriptionLight}>
        {t('selectNetworkWithdrawDescription')}
      </p>
      
      <div className={styles.networkList}>
        {availableNetworks.map((network: any) => (
          <div 
            key={network.id}
            onClick={() => onSelect(network)}
            className={theme === 'dark' ? styles.networkItemDark : styles.networkItemLight}
          >
            <div className={styles.networkContent}>
              <div className={styles.networkInfo}>
                <h3 className={styles.networkName}>{network.full_name}</h3>
                <div className={theme === 'dark' ? styles.networkDetailsDark : styles.networkDetailsLight}>
                  <p>{t('fee')}: {network.fee}</p>
                  <p>{t('estimatedArrival')}: {network.estimated_arrival_time}</p>
                  <p>{t('minWithdraw')}: {network.min_withdraw}</p>
                </div>
              </div>
              <div className={theme === 'dark' ? styles.radioButtonDark : styles.radioButtonLight}>
                {/* Radio button will be filled when selected */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
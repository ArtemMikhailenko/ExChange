// 'use client';

// import { useState } from 'react';
// import { useTheme } from '@/app/context/ThemeContext';

// import styles from './WithdrawPage.module.css';
// import CryptoSelector from '../../components/withdraw/CryptoSelector/CryptoSelector';
// import NetworkSelector from '../../components/withdraw/NetworkSelector/NetworkSelector';
// import WithdrawDetails from '../../components/withdraw/WithdrawDetails/WithdrawDetails';
// import WithdrawHistory from '../../components/withdraw/WithdrawHistory/WithdrawHistory';
// import FAQSection from '../../components/withdraw/FAQSection/FAQSection';
// import WithdrawHeader from '../../components/withdraw/WithdrawHeader/WithdrawHeader';
// import Link from 'next/link';
// import { useTranslation } from '@/hooks/useTranslation';

// export default function WithdrawPage() {
//   const { t, lang } = useTranslation();
//   const { theme } = useTheme();
//   const [selectedCrypto, setSelectedCrypto] = useState(null);
//   const [selectedNetwork, setSelectedNetwork] = useState(null);
//   const [currentStep, setCurrentStep] = useState(1);

//   // Move to next step when a crypto is selected
//   const handleCryptoSelect = (crypto: any) => {
//     setSelectedCrypto(crypto);
//     setCurrentStep(2);
//   };

//   // Move to next step when a network is selected
//   const handleNetworkSelect = (network: any) => {
//     setSelectedNetwork(network);
//     setCurrentStep(3);
//   };

//   return (
//     <div className={styles.withdraw}>
//       <div className={theme === 'dark' ? styles.containerDark : styles.containerLight}>
//         <div className={styles.tabs}>
//           <Link 
//             href="/deposit"
//             className={theme === 'dark' ? styles.inactiveTabDark : styles.inactiveTabLight}
//           >
//             <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M9.18056 2.50333H10.8389V7.50333H13.3L10 10.8033L6.70001 7.50333H9.18056V2.50333ZM3.3389 5.80333H5.00001V4.14499H2.51945C2.2713 4.14499 2.06667 4.22647 1.90556 4.38944C1.7426 4.55055 1.66112 4.75518 1.66112 5.00333L1.68056 16.7228C1.68056 16.9302 1.76204 17.1126 1.92501 17.27C2.08612 17.4255 2.2713 17.5033 2.48056 17.5033H17.5C17.7352 17.5033 17.9333 17.4218 18.0944 17.2589C18.2574 17.0959 18.3389 16.8978 18.3389 16.6644V4.98388C18.3389 4.7487 18.2574 4.55055 18.0944 4.38944C17.9333 4.22647 17.7352 4.14499 17.5 4.14499H15.0195V5.82277H16.6611V12.4839H3.3389V5.80333ZM16.6611 14.1644V15.8228H3.3389V14.1644H16.6611Z" fill="currentColor" fill-opacity="0.4" />
//             </svg>
//             {t('deposit')}
//           </Link>
          
//           <Link 
//             href="/withdraw"
//             className={theme === 'dark' ? styles.activeTabDark : styles.activeTabLight}
//           >
//             <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//               <path d="M8.18056 8.8033H9.83889V3.8033H12.3L9.00001 0.503296L5.70001 3.8033H8.18056V8.8033ZM2.3389 3.8033H4.00001V2.14496H1.51945C1.2713 2.14496 1.06667 2.22644 0.905562 2.38941C0.742599 2.55052 0.661118 2.75515 0.661118 3.0033L0.680562 14.7227C0.680562 14.9301 0.762043 15.1126 0.925006 15.27C1.08612 15.4255 1.2713 15.5033 1.48056 15.5033H16.5C16.7352 15.5033 16.9333 15.4218 17.0944 15.2589C17.2574 15.0959 17.3389 14.8977 17.3389 14.6644V2.98385C17.3389 2.74867 17.2574 2.55052 17.0944 2.38941C16.9333 2.22644 16.7352 2.14496 16.5 2.14496H14.0195V3.82274H15.6611V10.4839H2.3389V3.8033ZM15.6611 12.1644V13.8227H2.3389V12.1644H15.6611Z" fill="currentColor" />
//             </svg>
//             {t('withdraw')}
//           </Link>
//         </div>
//         <div className={styles.wrapper}>
//           <WithdrawHeader />
          
//           <div className={styles.mainContent}>
//             {/* Main withdraw form section */}
//             <div className={styles.withdrawFormSection}>
//               <div className={theme === 'dark' ? styles.formBoxDark : styles.formBoxLight}>
//                 {/* Step 1: Select Crypto */}
//                 <div className={styles.stepContainer}>
//                   <div className={styles.stepHeader}>
//                     <div className={styles.stepNumber}>
//                       1
//                     </div>
//                     <h2 className={styles.stepTitle}>{t('selectCrypto')}</h2>
//                   </div>
//                   <CryptoSelector onSelect={handleCryptoSelect} />
//                 </div>

//                 {/* Step 2: Select Network */}
//                 <div className={`${styles.stepContainer} ${currentStep < 2 ? styles.disabledStep : ''}`}>
//                   <div className={styles.stepHeader}>
//                     <div className={`${styles.stepNumber} ${currentStep < 2 ? styles.inactiveStep : ''}`}>
//                       2
//                     </div>
//                     <h2 className={styles.stepTitle}>{t('selectNetwork')}</h2>
//                   </div>
//                   {currentStep >= 2 && <NetworkSelector onSelect={handleNetworkSelect} crypto={selectedCrypto} />}
//                 </div>

//                 {/* Step 3: Withdraw Details */}
//                 <div className={`${styles.stepContainer} ${currentStep < 3 ? styles.disabledStep : ''}`}>
//                   <div className={styles.stepHeader}>
//                     <div className={`${styles.stepNumber} ${currentStep < 3 ? styles.inactiveStep : ''}`}>
//                       3
//                     </div>
//                     <h2 className={styles.stepTitle}>{t('withdrawDetails')}</h2>
//                   </div>
//                   {currentStep >= 3 && <WithdrawDetails crypto={selectedCrypto} network={selectedNetwork} />}
//                 </div>
//               </div>
//             </div>
            
//             {/* FAQ Section */}
//             <div className={styles.faqSection}>
//               <FAQSection />
//             </div>
//           </div>
          
//         </div>
        
//       </div>
//       <div className={styles.historySection}>
//         <WithdrawHistory />
//       </div>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useRef, memo } from 'react';

function CryptoScreenerWidget() {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = document.getElementById('tradingview-crypto-screener');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'tradingview-crypto-screener';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: '600',
      defaultColumn: 'overview',
      defaultScreen: 'crypto',
      market: 'crypto',
      showToolbar: true,
      locale: 'en',
      colorTheme: 'dark',
      autosize: true,
      container_id: 'tradingview_cryptoscreener'
    });

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      const el = document.getElementById('tradingview-crypto-screener');
      if (el) el.remove();
    };
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ width: '100%' }}>
      <div id="tradingview_cryptoscreener" ref={container} style={{ height: '600px', width: '100%' }} />
    </div>
  );
}

export default memo(CryptoScreenerWidget);

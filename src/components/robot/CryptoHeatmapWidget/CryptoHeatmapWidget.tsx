'use client';

import React, { useEffect, useRef, memo } from 'react';

function CryptoHeatmapWidget() {
  const container = useRef(null);

  useEffect(() => {
    // Remove any existing scripts to prevent duplicates
    const existingScript = document.getElementById('tradingview-heatmap-script');
    if (existingScript) {
      existingScript.remove();
    }

    // Create a new script element
    const script = document.createElement('script');
    script.id = 'tradingview-heatmap-script';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "dataSource": "Crypto",
      "blockSize": "market_cap_calc",
      "blockColor": "change",
      "locale": "en",
      "symbolUrl": "",
      "colorTheme": "dark",
      "hasTopBar": false,
      "isDataSetEnabled": false,
      "isZoomEnabled": true,
      "hasSymbolTooltip": true,
      "width": "100%",
      "height": "100%"
    });

    // Add the script to the container
    if (container.current) {
      //@ts-ignore
      container.current.appendChild(script);
    }

    // Cleanup function
    return () => {
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" style={{ height: "600px", width: "100%" }}>
      <div ref={container} style={{ height: "100%", width: "100%" }} />
    </div>
  );
}

export default memo(CryptoHeatmapWidget);
// react-qr-code.d.ts
declare module 'react-qr-code' {
    import * as React from 'react';
    interface QRCodeProps {
      value: string;
      size?: number;
      level?: 'L' | 'M' | 'Q' | 'H';
      bgColor?: string;
      fgColor?: string;
      style?: React.CSSProperties;
      className?: string;
    }
    const QRCode: React.FC<QRCodeProps>;
    export default QRCode;
  }
  
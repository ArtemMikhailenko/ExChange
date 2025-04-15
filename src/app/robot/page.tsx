// src/app/robo-trading/page.tsx
'use client';

import React, { Suspense } from 'react';
import RoboTrading from '../../components/robot/RoboTrading/RoboTrading';



export default function RoboTradingPage() {
  return (
    <Suspense fallback={null}> 
    <RoboTrading />
    </Suspense>
    
  )
 
}
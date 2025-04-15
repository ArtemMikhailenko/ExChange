// src/services/robotService.ts

import { getAuthToken } from "@/utils/auth";

const API_BASE_URL = 'https://apiexchange.ymca.one';

export type KeyType = 'standart' | 'premium' | 'vip';

export interface RobotStatistics {
  total_assets: number;
  total_realized_pnp: number;
}

export interface TradeHistoryParams {
  type: 'demo' | 'real';
  page: number;
  max_on_page: number;
}

export interface RobotSettings {
  robot_key: string | null;
  trade_currencies: string[];
  avaliable_currencies: string[];
}

export interface Trade {
  id: number;
  type: string;
  status: string;
  investment: number;
  profit: number;
  start_date: string;
  end_date: string;
  // Additional properties for UI
  icon?: string;
}

export interface BuyKeyResponse {
  status: string;
  msg: string;
  key?: string;
  key_type?: KeyType;
}

interface TradeHistoryResponse {
  status: string;
  trades: Trade[];
  pages: number;
}

// Helper function to get authentication headers
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Base fetch function with error handling and auth
const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultOptions: RequestInit = {
      headers: getAuthHeaders(),
      credentials: 'include',
    };

    const response = await fetch(url, { ...defaultOptions, ...options });

    // Handle HTTP errors
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error (${response.status}):`, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Parse JSON response
    const data = await response.json();

    // Handle API errors
    if (data.status === false || data.status === 'err') {
      console.error('API returned error status:', data);
      throw new Error(data.err || data.msg || 'API returned error status');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export async function fetchRobotStatistics(): Promise<RobotStatistics> {
  try {
    const result = await fetchAPI('/api/statistics/robot', {
      method: 'POST',
    });

    return {
      total_assets: result.total_assets || 0,
      total_realized_pnp: result.total_realized_pnp || 0
    };
  } catch (error) {
    console.error('Error fetching robot statistics:', error);
    // Return default values in case of error
    return {
      total_assets: 0,
      total_realized_pnp: 0
    };
  }
}

export async function fetchTradeHistory(params: TradeHistoryParams): Promise<TradeHistoryResponse> {
  try {
    const data = await fetchAPI('/api/statistics/trades', {
      method: 'POST',
      body: JSON.stringify({
        robot_type: params.type,
        page: params.page,
        max_on_page: params.max_on_page
      })
    });

    // Process trade data for UI
    const processedTrades = data.trades.map((trade: Trade) => {
      // Assign icon based on some logic
      const icons = ['btc', 'eth', 'ltc', 'bnb', 'trx'];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      
      return {
        ...trade,
        icon: randomIcon 
      };
    });

    return {
      status: data.status,
      trades: processedTrades,
      pages: data.pages
    };
  } catch (error) {
    console.error('Error fetching trade history:', error);
    return {
      status: 'err',
      trades: [],
      pages: 0
    };
  }
}

export async function toggleRobotState(currentState: boolean, accountType: 'demo' | 'real'): Promise<boolean> {
  try {
    // The robot action is the opposite of current state
    const robotAction = currentState ? 'stop' : 'start';
    
    const data = await fetchAPI('/api/robot/toggle', {
      method: 'POST',
      body: JSON.stringify({
        robot: robotAction,
        account_type: accountType
      })
    });

    // The new state is the opposite of the current state
    return !currentState;
  } catch (error) {
    console.error('Error toggling robot state:', error);
    // Return original state on error (no change)
    return currentState;
  }
}

export async function activateRobotKey(key: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = await fetchAPI('/api/robot/activateKey', {
      method: 'POST',
      body: JSON.stringify({ key })
    });

    return {
      success: data.status === 'success',
      message: data.msg || 'Robot key activated successfully!'
    };
  } catch (error) {
    console.error('Error activating robot key:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred.'
    };
  }
}

export async function buyAndActivateKey(keyType: KeyType): Promise<BuyKeyResponse> {
  try {
    const data = await fetchAPI('/api/robot/buyActivateKey', {
      method: 'POST',
      body: JSON.stringify({ key_type: keyType })
    });

    return data as BuyKeyResponse;
  } catch (error) {
    console.error('Error buying and activating key:', error);
    return {
      status: 'err',
      msg: error instanceof Error ? error.message : 'An unexpected error occurred.'
    };
  }
}

export async function getRobotSettings(type: 'demo' | 'real'): Promise<RobotSettings> {
  try {
    const data = await fetchAPI('/api/robot/get/settings', {
      method: 'POST',
      body: JSON.stringify({ type })
    });

    return data.settings as RobotSettings;
  } catch (error) {
    console.error('Error fetching robot settings:', error);
    // Return default values on error
    return {
      robot_key: null,
      trade_currencies: [],
      avaliable_currencies: []
    };
  }
}

// Export all functions in a service object
export const robotService = {
  fetchRobotStatistics,
  fetchTradeHistory,
  toggleRobotState,
  activateRobotKey,
  getRobotSettings,
  buyAndActivateKey
};
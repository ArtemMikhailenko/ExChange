// src/services/robotService.ts
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

// Base fetch function with proper credentials handling
const fetchWithCredentials = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // THIS IS CRUCIAL - ensures cookies are sent with request
    // Don't override existing headers, just add Content-Type if not present
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    // Log the error for debugging
    console.error(`API Error (${response.status}):`, response.statusText);
    try {
      // Try to parse error response as JSON
      const errorData = await response.json();
      console.error('Error details:', errorData);
      throw new Error(errorData.err || 'API request failed');
    } catch (e) {
      // If can't parse as JSON, use status text
      throw new Error(`API error: ${response.status} - ${response.statusText}`);
    }
  }
  
  return response.json();
};

export async function fetchRobotStatistics(): Promise<RobotStatistics> {
  try {
    const result = await fetchWithCredentials(`${API_BASE_URL}/api/statistics/robot`, {
      method: 'POST',
    });

    if (result.status === false) {
      throw new Error(result.err || 'Failed to fetch robot statistics');
    }

    return {
      total_assets: result.total_assets || 0,
      total_realized_pnp: result.total_realized_pnp || 0
    };
  } catch (error) {
    console.error('Error fetching robot statistics:', error);
    throw error;
  }
}

export async function fetchTradeHistory(params: TradeHistoryParams): Promise<TradeHistoryResponse> {
  try {
    const data = await fetchWithCredentials(`${API_BASE_URL}/api/statistics/trades`, {
      method: 'POST',
      body: JSON.stringify({
        robot_type: params.type,
        page: params.page,
        max_on_page: params.max_on_page
      })
    });

    if (data.status === false) {
      throw new Error(data.err || 'Failed to fetch trade history');
    }

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
    throw error;
  }
}

export async function toggleRobotState(currentState: boolean, accountType: 'demo' | 'real'): Promise<boolean> {
  try {
    // The robot action is the opposite of current state
    const robotAction = currentState ? 'stop' : 'start';
    
    // Log request parameters for debugging
    console.log('Toggling robot state with params:', {
      robot: robotAction,
      account_type: accountType
    });
    
    const data = await fetchWithCredentials(`${API_BASE_URL}/api/robot/toggle`, {
      method: 'POST',
      body: JSON.stringify({
        robot: robotAction,
        account_type: accountType
      })
    });

    // Log response for debugging
    console.log('Toggle robot response:', data);

    if (data.status === false) {
      throw new Error(data.err || 'Failed to toggle robot state');
    }

    // The new state is the opposite of the current state
    return !currentState;
  } catch (error) {
    console.error('Error toggling robot state:', error);
    throw error;
  }
}

export async function activateRobotKey(key: string): Promise<{ success: boolean; message: string }> {
  try {
    const data = await fetchWithCredentials(`${API_BASE_URL}/api/robot/activateKey`, {
      method: 'POST',
      body: JSON.stringify({ key })
    });

    return {
      success: data.status !== false,
      message: data.msg || (data.status === false ? data.err : 'Robot key activated successfully!')
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
    const data = await fetchWithCredentials(`${API_BASE_URL}/api/robot/buyActivateKey`, {
      method: 'POST',
      body: JSON.stringify({ key_type: keyType })
    });

    if (data.status === false) {
      throw new Error(data.err || 'Failed to buy and activate key');
    }

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
    const data = await fetchWithCredentials(`${API_BASE_URL}/api/robot/get/settings`, {
      method: 'POST',
      body: JSON.stringify({ type })
    });

    if (data.status === false) {
      throw new Error(data.err || 'Failed to fetch robot settings');
    }

    return data.settings as RobotSettings;
  } catch (error) {
    console.error('Error fetching robot settings:', error);
    throw error;
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
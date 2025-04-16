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
  trade_currencies: string[] | 'all';
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

export interface SaveRobotSettingsParams {
  robot_type: 'demo' | 'real';
  leverage: number;
  minTradeAmount: number;
  maxTradeAmount: number;
  pairs: string[] | 'all';
}

interface SaveRobotSettingsResponse {
  status: string;
  settings?: {
    robot_key: string | null;
    trade_currencies: string[] | 'all';
  };
  err?: string;
  msg?: string;
}

interface TradeHistoryResponse {
  status: string;
  trades: Trade[];
  pages: number;
}

interface RobotStatusResponse {
  status: string;
  robot_status: boolean;
  account_type: 'demo' | 'real';
  msg?: string;
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
      throw new Error(errorData.err || errorData.msg || 'API request failed');
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

    if (result.status === "err") {
      throw new Error(result.msg || 'Failed to fetch robot statistics');
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

export async function fetchRobotStatus(accountType: 'demo' | 'real'): Promise<boolean> {
  try {
    const data = await fetchWithCredentials(`${API_BASE_URL}/api/robot/status`, {
      method: 'POST',
      body: JSON.stringify({
        account_type: accountType
      })
    });

    if (data.status === "err") {
      throw new Error(data.msg || 'Failed to fetch robot status');
    }

    return data.robot_status || false;
  } catch (error) {
    console.error('Error fetching robot status:', error);
    // Return false (stopped) as a safe default in case of error
    return false;
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

    if (data.status === "err") {
      throw new Error(data.msg || 'Failed to fetch trade history');
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

    if (data.status === "err") {
      throw new Error(data.msg || 'Failed to toggle robot state');
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
      success: data.status !== "err",
      message: data.msg || (data.status === "err" ? data.msg : 'Robot key activated successfully!')
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

    if (data.status === "err") {
      throw new Error(data.msg || 'Failed to buy and activate key');
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
      body: JSON.stringify({ robot_type: type })
    });

    if (data.status === "err") {
      throw new Error(data.msg || 'Failed to fetch robot settings');
    }

    return data.settings as RobotSettings;
  } catch (error) {
    console.error('Error fetching robot settings:', error);
    throw error;
  }
}

export async function saveRobotSettings(params: SaveRobotSettingsParams): Promise<SaveRobotSettingsResponse> {
  try {
    // Validate parameters according to API spec
    if (![3, 5, 20, 50, 100].includes(params.leverage)) {
      throw new Error('Leverage must be one of: 3, 5, 20, 50, 100');
    }
    
    if (params.minTradeAmount < 5 || params.minTradeAmount > 10000) {
      throw new Error('Minimum trade amount must be between 5 and 10000');
    }
    
    if (params.maxTradeAmount < 25 || params.maxTradeAmount > 10000) {
      throw new Error('Maximum trade amount must be between 25 and 10000');
    }
    
    if (params.minTradeAmount >= params.maxTradeAmount) {
      throw new Error('Minimum trade amount must be less than maximum trade amount');
    }
    
    // Make the API request
    const response = await fetchWithCredentials(`${API_BASE_URL}/api/robot/set/settings`, {
      method: 'POST',
      body: JSON.stringify({
        robot_type: params.robot_type,
        leverage: params.leverage,
        minTradeAmount: params.minTradeAmount,
        maxTradeAmount: params.maxTradeAmount,
        pairs: params.pairs
      })
    });
    
    // Handle API response
    if (response.status === "err") {
      return {
        status: 'err',
        msg: response.msg || 'Failed to save robot settings'
      };
    }
    
    return {
      status: 'success',
      settings: response.settings
    };
  } catch (error) {
    console.error('Error saving robot settings:', error);
    return {
      status: 'err',
      err: error instanceof Error ? error.message : 'An unexpected error occurred'
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
  buyAndActivateKey,
  saveRobotSettings,
  fetchRobotStatus
};
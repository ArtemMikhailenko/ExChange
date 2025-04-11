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

export async function fetchRobotStatistics(): Promise<RobotStatistics> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/statistics/robot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const result = await response.json();

    if (result.status !== 'success') {
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

export async function fetchTradeHistory(params: TradeHistoryParams): Promise<TradeHistoryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/statistics/trades`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        robot_type: params.type,
        page: params.page,
        max_on_page: params.max_on_page
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.msg || 'Failed to fetch trade history');
    }

    // Process trade data for UI
    const processedTrades = data.trades.map((trade: Trade) => {
      // Assign icon based on some logic (could be refined based on your actual data)
      const icons = ['btc', 'eth', 'ltc', 'bnb', 'trx'];
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      
      return {
        ...trade,
        icon: randomIcon // In production, you'd map this based on actual coin data
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

/**
 * Toggle robot operation state (start/stop)
 * @param currentState Current running state (true = running, false = stopped)
 * @param accountType The account type ('demo' or 'real')
 * @returns A Promise resolving to the new state
 */
export async function toggleRobotState(currentState: boolean, accountType: 'demo' | 'real'): Promise<boolean> {
  try {
    // The robot action is the opposite of current state
    const robotAction = currentState ? 'stop' : 'start';
    
    const response = await fetch(`${API_BASE_URL}/api/robot/toggle`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        robot: robotAction,
        account_type: accountType
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
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
    const response = await fetch(`${API_BASE_URL}/api/robot/activateKey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key })
    });

    const data = await response.json();

    if (data.status === 'success') {
      return {
        success: true,
        message: data.msg || 'Robot key activated successfully!'
      };
    } else {
      return {
        success: false,
        message: data.msg || 'Failed to activate robot key.'
      };
    }
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
    const response = await fetch(`${API_BASE_URL}/api/robot/buyActivateKey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ key_type: keyType })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
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
    const response = await fetch(`${API_BASE_URL}/api/robot/get/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.status !== 'success') {
      throw new Error(data.msg || 'Failed to fetch robot settings');
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
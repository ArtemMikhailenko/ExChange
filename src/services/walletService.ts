// src/services/walletService.ts

const API_BASE_URL = 'https://apiexchange.ymca.one';

interface WalletBalancesResponse {
  status: 'success' | 'err';
  balances?: { [key: string]: string };
  msg?: string;
}

/**
 * Fetches the user's wallet balances
 * @returns Promise with wallet balances
 */
export const getWalletBalances = async (): Promise<WalletBalancesResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/wallet/getBalances`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: WalletBalancesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching wallet balances:', error);
    return {
      status: 'err',
      msg: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Service for handling wallet operations
 */
export const walletService = {
  getBalances: getWalletBalances,
};

export default walletService;
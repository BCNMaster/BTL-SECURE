import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TokenInfo } from '../services/token';
import { ArrowUpDown, Settings } from 'lucide-react';

interface TokenListProps {
  tokens: TokenInfo[];
  onTokenSelect?: (token: TokenInfo) => void;
  onSend?: (token: TokenInfo) => void;
  onReceive?: (token: TokenInfo) => void;
}

export const TokenList: React.FC<TokenListProps> = ({ 
  tokens, 
  onTokenSelect,
  onSend,
  onReceive 
}) => {
  const formatBalance = (balance: string, price?: number) => {
    const numBalance = parseFloat(balance);
    const value = price ? numBalance * price : 0;
    return {
      balance: numBalance.toLocaleString(undefined, { maximumFractionDigits: 8 }),
      value: value.toLocaleString(undefined, { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    };
  };

  return (
    <div className="space-y-4">
      {tokens.map((token, index) => {
        const { balance, value } = formatBalance(token.balance, token.price);
        
        return (
          <Card
            key={`${token.address}-${index}`}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-lg">{token.symbol}</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {token.network}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{token.address}</p>
                  <div className="mt-2">
                    <p className="font-semibold text-xl">{balance} {token.symbol}</p>
                    <p className="text-sm text-gray-600">{value}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => onSend?.(token)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                  <button
                    onClick={() => onReceive?.(token)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Receive</span>
                  </button>
                </div>
              </div>

              {token.price && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Price</span>
                    <span>${token.price.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>24h Change</span>
                    <span className="text-green-500">+2.5%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TokenList;
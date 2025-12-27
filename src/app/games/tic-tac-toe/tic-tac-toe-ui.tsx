"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Award, RotateCcw, X, Circle, User, Bot } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

type Player = 'X' | 'O';
type Square = Player | null;

const calculateWinner = (squares: Square[]): Player | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const findBestMove = (squares: Square[]): number => {
    // Basic AI:
    // 1. Win if possible
    // 2. Block opponent from winning
    // 3. Take center
    // 4. Take a corner
    // 5. Take a side
  
    // Check for winning moves for 'O'
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const tempSquares = squares.slice();
        tempSquares[i] = 'O';
        if (calculateWinner(tempSquares) === 'O') {
          return i;
        }
      }
    }
  
    // Check for blocking moves for 'X'
    for (let i = 0; i < 9; i++) {
      if (!squares[i]) {
        const tempSquares = squares.slice();
        tempSquares[i] = 'X';
        if (calculateWinner(tempSquares) === 'X') {
          return i;
        }
      }
    }
  
    // Take the center if available
    if (!squares[4]) {
      return 4;
    }
  
    // Take a random corner
    const corners = [0, 2, 6, 8].filter(i => !squares[i]);
    if (corners.length > 0) {
      return corners[Math.floor(Math.random() * corners.length)];
    }
  
    // Take a random side
    const sides = [1, 3, 5, 7].filter(i => !squares[i]);
    if (sides.length > 0) {
      return sides[Math.floor(Math.random() * sides.length)];
    }
    
    // Fallback for any remaining empty square
    const emptySquares = squares.map((s, i) => s === null ? i : null).filter(i => i !== null) as number[];
    return emptySquares[0];
};
  

const SquareComponent = ({ value, onClick }: { value: Square, onClick: () => void }) => (
  <Button
    variant="outline"
    className="h-24 w-24 rounded-lg flex items-center justify-center text-6xl font-bold"
    onClick={onClick}
    aria-label={`Square ${value || 'empty'}`}
  >
    {value === 'X' && <X className="h-16 w-16 text-red-500" />}
    {value === 'O' && <Circle className="h-14 w-14 text-blue-500" />}
  </Button>
);

export function TicTacToeUI() {
  const [squares, setSquares] = useState<Square[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<Player | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameMode, setGameMode] = useState<'pvp' | 'pva'>('pvp');

  const handleAIMove = useCallback((currentSquares: Square[]) => {
      const bestMove = findBestMove(currentSquares);
      const newSquares = currentSquares.slice();
      newSquares[bestMove] = 'O';
      setSquares(newSquares);
      setXIsNext(true);
  }, []);

  useEffect(() => {
    const calculatedWinner = calculateWinner(squares);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
    } else if (squares.every(Boolean)) {
      setIsDraw(true);
    } else if (gameMode === 'pva' && !xIsNext) {
        // AI's turn
        setTimeout(() => handleAIMove(squares), 500);
    }
  }, [squares, gameMode, xIsNext, handleAIMove]);

  const handleClick = (i: number) => {
    if (winner || squares[i] || (gameMode === 'pva' && !xIsNext)) {
      return;
    }
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
  };
  
  const handleModeChange = (mode: 'pvp' | 'pva') => {
      setGameMode(mode);
      resetGame();
  }

  let status;
  if (winner) {
    status = (
      <div className="flex items-center justify-center text-2xl font-bold text-primary">
        <Award className="mr-2 h-8 w-8" />
        Winner: {winner}
      </div>
    );
  } else if (isDraw) {
    status = <div className="text-2xl font-bold text-muted-foreground">It's a Draw!</div>;
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <Card className="shadow-2xl">
      <CardContent className="p-6 space-y-6">
        <RadioGroup defaultValue="pvp" onValueChange={handleModeChange} className="flex justify-center gap-4">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="pvp" id="pvp" />
                <Label htmlFor="pvp" className="flex items-center gap-2"><User /> Player vs Player</Label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="pva" id="pva" />
                <Label htmlFor="pva" className="flex items-center gap-2"><Bot /> Player vs AI</Label>
            </div>
        </RadioGroup>
        <div className="text-xl font-semibold text-center mb-4">{status}</div>
        <div className="grid grid-cols-3 gap-2">
          {squares.map((square, i) => (
            <SquareComponent key={i} value={square} onClick={() => handleClick(i)} />
          ))}
        </div>
        <Button onClick={resetGame} className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          New Game
        </Button>
      </CardContent>
    </Card>
  );
}

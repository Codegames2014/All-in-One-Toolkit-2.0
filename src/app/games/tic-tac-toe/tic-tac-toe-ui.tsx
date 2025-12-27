"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Award, RotateCcw, X, Circle, User, Bot, Users } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// --- AI Logic ---

// Minimax algorithm for unbeatable AI
const minimax = (newSquares: Square[], player: Player): { score: number, index?: number } => {
    const availSpots = newSquares.map((s, i) => s === null ? i : null).filter(i => i !== null) as number[];

    const winner = calculateWinner(newSquares);
    if (winner === 'X') return { score: -10 };
    if (winner === 'O') return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves: { index: number, score: number }[] = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move: { index: number, score: number } = { index: availSpots[i], score: 0 };
        newSquares[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newSquares, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newSquares, 'O');
            move.score = result.score;
        }

        newSquares[availSpots[i]] = null;
        moves.push(move);
    }

    let bestMove = -1;
    let bestScore = player === 'O' ? -10000 : 10000;

    for (let i = 0; i < moves.length; i++) {
        if (player === 'O') {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        } else {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

const findBestMove = (squares: Square[], difficulty: 'easy' | 'medium' | 'unbeatable'): number => {
    const emptySquares = squares.map((s, i) => s === null ? i : null).filter(i => i !== null) as number[];
    
    // Difficulty logic
    if (difficulty === 'easy' && Math.random() > 0.5) {
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }
    
    if (difficulty === 'medium' && Math.random() > 0.2) {
        // Medium AI: Prioritize winning/blocking, otherwise random
        for (let i = 0; i < emptySquares.length; i++) {
            const index = emptySquares[i];
            const tempSquares = squares.slice();
            tempSquares[index] = 'O';
            if (calculateWinner(tempSquares) === 'O') return index;
        }
        for (let i = 0; i < emptySquares.length; i++) {
            const index = emptySquares[i];
            const tempSquares = squares.slice();
            tempSquares[index] = 'X';
            if (calculateWinner(tempSquares) === 'X') return index;
        }
        return emptySquares[Math.floor(Math.random() * emptySquares.length)];
    }

    // Unbeatable or fallback for Medium AI
    return minimax(squares, 'O').index!;
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
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'unbeatable'>('medium');

  const handleAIMove = useCallback((currentSquares: Square[]) => {
      const bestMove = findBestMove(currentSquares, aiDifficulty);
      const newSquares = currentSquares.slice();
      newSquares[bestMove] = 'O';
      setSquares(newSquares);
      setXIsNext(true);
  }, [aiDifficulty]);

  useEffect(() => {
    const calculatedWinner = calculateWinner(squares);
    if (calculatedWinner) {
      setWinner(calculatedWinner);
    } else if (squares.every(Boolean)) {
      setIsDraw(true);
    } else if (gameMode === 'pva' && !xIsNext) {
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
      <CardHeader>
        <CardTitle>Game Settings</CardTitle>
        <CardDescription>Choose your opponent and difficulty.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => handleModeChange('pvp')} variant={gameMode === 'pvp' ? 'default' : 'outline'} className="w-full sm:w-auto">
                <Users className="mr-2" /> Player vs Player
            </Button>
            <Button onClick={() => handleModeChange('pva')} variant={gameMode === 'pva' ? 'default' : 'outline'} className="w-full sm:w-auto">
                <Bot className="mr-2" /> Player vs AI
            </Button>
        </div>
        {gameMode === 'pva' && (
            <div className="space-y-2 max-w-sm mx-auto">
                <Label htmlFor="ai-difficulty">AI Difficulty</Label>
                <Select value={aiDifficulty} onValueChange={(v) => setAiDifficulty(v as any)}>
                    <SelectTrigger id="ai-difficulty">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="unbeatable">Unbeatable</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        )}
        <div className="text-xl font-semibold text-center pt-4 border-t">{status}</div>
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

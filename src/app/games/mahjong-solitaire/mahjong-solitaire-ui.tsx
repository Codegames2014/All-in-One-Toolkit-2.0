
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Award, RotateCcw, Shuffle, Lightbulb } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';

// Mahjong Unicode characters
const TILE_SET = '🀐🀑🀒🀓🀔🀕🀖🀗🀘🀙🀚🀛🀜🀝🀞🀟🀠🀡🀢🀣🀤🀥🀦🀧🀨🀩🀪🀫🀬🀭'.split('');
const SPECIAL_TILES = '🀄︎發白'.split(''); // Using a different 'empty' center tile for variety.
const SEASON_TILES = '春夏秋冬'.split('');
const FLOWER_TILES = '梅蘭菊竹'.split('');


const TOTAL_TILES = 144;

// Classic Turtle layout - 144 tiles
const TURTLE_LAYOUT = [
    // Layer 0 (Bottom)
    {x: 2, y: 7, z: 0}, {x: 4, y: 7, z: 0}, {x: 6, y: 7, z: 0}, {x: 8, y: 7, z: 0}, {x: 10, y: 7, z: 0}, {x: 12, y: 7, z: 0}, {x: 14, y: 7, z: 0}, {x: 16, y: 7, z: 0}, {x: 18, y: 7, z: 0}, {x: 20, y: 7, z: 0}, {x: 22, y: 7, z: 0}, {x: 24, y: 7, z: 0},
    {x: 2, y: 5, z: 0}, {x: 4, y: 5, z: 0}, {x: 6, y: 5, z: 0}, {x: 8, y: 5, z: 0}, {x: 10, y: 5, z: 0}, {x: 12, y: 5, z: 0}, {x: 14, y: 5, z: 0}, {x: 16, y: 5, z: 0}, {x: 18, y: 5, z: 0}, {x: 20, y: 5, z: 0}, {x: 22, y: 5, z: 0}, {x: 24, y: 5, z: 0},
    {x: 0, y: 3, z: 0}, {x: 2, y: 3, z: 0}, {x: 4, y: 3, z: 0}, {x: 6, y: 3, z: 0}, {x: 8, y: 3, z: 0}, {x: 10, y: 3, z: 0}, {x: 12, y: 3, z: 0}, {x: 14, y: 3, z: 0}, {x: 16, y: 3, z: 0}, {x: 18, y: 3, z: 0}, {x: 20, y: 3, z: 0}, {x: 22, y: 3, z: 0}, {x: 24, y: 3, z: 0}, {x: 26, y: 3, z: 0},
    {x: 2, y: 1, z: 0}, {x: 4, y: 1, z: 0}, {x: 6, y: 1, z: 0}, {x: 8, y: 1, z: 0}, {x: 10, y: 1, z: 0}, {x: 12, y: 1, z: 0}, {x: 14, y: 1, z: 0}, {x: 16, y: 1, z: 0}, {x: 18, y: 1, z: 0}, {x: 20, y: 1, z: 0}, {x: 22, y: 1, z: 0}, {x: 24, y: 1, z: 0},
    // Layer 1
    {x: 6, y: 6, z: 1}, {x: 8, y: 6, z: 1}, {x: 10, y: 6, z: 1}, {x: 12, y: 6, z: 1}, {x: 14, y: 6, z: 1}, {x: 16, y: 6, z: 1},
    {x: 6, y: 4, z: 1}, {x: 8, y: 4, z: 1}, {x: 10, y: 4, z: 1}, {x: 12, y: 4, z: 1}, {x: 14, y: 4, z: 1}, {x: 16, y: 4, z: 1},
    {x: 6, y: 2, z: 1}, {x: 8, y: 2, z: 1}, {x: 10, y: 2, z: 1}, {x: 12, y: 2, z: 1}, {x: 14, y: 2, z: 1}, {x: 16, y: 2, z: 1},
    // Layer 2
    {x: 8, y: 5, z: 2}, {x: 10, y: 5, z: 2}, {x: 12, y: 5, z: 2}, {x: 14, y: 5, z: 2},
    {x: 8, y: 3, z: 2}, {x: 10, y: 3, z: 2}, {x: 12, y: 3, z: 2}, {x: 14, y: 3, z: 2},
    // Layer 3
    {x: 10, y: 4, z: 3}, {x: 12, y: 4, z: 3},
    // Layer 4 (Top)
    {x: 11, y: 4.5, z: 4},
    // Wings
    {x: 28, y: 3, z: 0},
    {x: -2, y: 3, z: 0}
];


interface Tile {
  id: number;
  symbol: string;
  group: 'standard' | 'season' | 'flower';
  x: number;
  y: number;
  z: number;
}

const shuffle = (array: any[]) => array.sort(() => Math.random() - 0.5);

export function MahjongSolitaireUI() {
    const [tiles, setTiles] = useState<Tile[]>([]);
    const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
    const [hint, setHint] = useState<number[] | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [gamesStarted, setGamesStarted] = useState(0);

    const isTileBlocked = useCallback((tile: Tile, currentTiles: Tile[]): boolean => {
        const onTop = currentTiles.some(t => t.z > tile.z && Math.abs(t.x - tile.x) < 2 && Math.abs(t.y - tile.y) < 2);
        if (onTop) return true;
        
        const isBlockedOnLeft = currentTiles.some(t => t.z === tile.z && t.x === tile.x - 2 && Math.abs(t.y - tile.y) < 2);
        const isBlockedOnRight = currentTiles.some(t => t.z === tile.z && t.x === tile.x + 2 && Math.abs(t.y - tile.y) < 2);

        return isBlockedOnLeft && isBlockedOnRight;
    }, []);
    
    const findHint = useCallback(() => {
        const openTiles = tiles.filter(t => !isTileBlocked(t, tiles));
        const pairs = new Map<string, Tile[]>();
        const seasonTiles: Tile[] = [];
        const flowerTiles: Tile[] = [];

        for(const tile of openTiles) {
            if(tile.group === 'season') {
                seasonTiles.push(tile);
            } else if (tile.group === 'flower') {
                flowerTiles.push(tile);
            } else {
                if(!pairs.has(tile.symbol)) pairs.set(tile.symbol, []);
                pairs.get(tile.symbol)!.push(tile);
            }
        }
        
        if (seasonTiles.length >= 2) {
            setHint([seasonTiles[0].id, seasonTiles[1].id]);
            setTimeout(() => setHint(null), 1000);
            return;
        }
        if (flowerTiles.length >= 2) {
            setHint([flowerTiles[0].id, flowerTiles[1].id]);
            setTimeout(() => setHint(null), 1000);
            return;
        }

        for(const group of pairs.values()){
            if(group.length >= 2){
                setHint([group[0].id, group[1].id]);
                setTimeout(() => setHint(null), 1000);
                return;
            }
        }
        setHint(null);
    }, [tiles, isTileBlocked]);
    
    const initializeGame = useCallback(() => {
        let allSymbols: {symbol: string, group: Tile['group']}[] = [];
        const standardTiles = [...TILE_SET, ...SPECIAL_TILES];

        for(let i=0; i < 4; i++) {
            allSymbols.push(...standardTiles.map(s => ({symbol: s, group: 'standard' as const})));
            allSymbols.push({symbol: SEASON_TILES[i], group: 'season' as const});
            allSymbols.push({symbol: FLOWER_TILES[i], group: 'flower' as const});
        }
        
        allSymbols = shuffle(allSymbols);

        const newTiles = TURTLE_LAYOUT.map((pos, index) => ({
            id: index,
            ...allSymbols[index],
            ...pos
        }));

        setTiles(newTiles);
        setSelectedTile(null);
        setGameOver(false);
        setHint(null);
        setGamesStarted(c => c + 1);
    }, []);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);
    
    const handleTileClick = (tile: Tile) => {
        if (isTileBlocked(tile, tiles) || tile.id === selectedTile?.id) {
            setSelectedTile(null);
            return;
        };
        setHint(null);

        if (selectedTile) {
            const isMatch = (selectedTile.group === tile.group) && (selectedTile.group !== 'standard' || selectedTile.symbol === tile.symbol);
            
            if (isMatch) {
                setTiles(t => t.filter(t => t.id !== selectedTile.id && t.id !== tile.id));
                setSelectedTile(null);
            } else {
                setSelectedTile(tile);
            }
        } else {
            setSelectedTile(tile);
        }
    };
    
    useEffect(() => {
        if(tiles.length === 0 && gamesStarted > 1) {
            setGameOver(true);
        }
    }, [tiles, gamesStarted]);
    
    const boardWidth = Math.max(...TURTLE_LAYOUT.map(t => t.x)) + 4;
    const boardHeight = Math.max(...TURTLE_LAYOUT.map(t => t.y)) + 6;

    return (
        <Card className="shadow-2xl overflow-auto">
            <CardContent className="p-4 md:p-6 space-y-4">
                 <div className="flex justify-between items-center bg-muted p-2 rounded-lg">
                    <div className="text-lg font-bold">Tiles Left: {tiles.length}</div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={findHint}><Lightbulb className="mr-2"/>Hint</Button>
                        <Button onClick={initializeGame}><RotateCcw className="mr-2"/>New Game</Button>
                    </div>
                </div>
                 <div className="relative mx-auto" style={{ width: `${boardWidth * 12}px`, height: `${boardHeight * 10}px`}}>
                    {tiles.sort((a,b) => a.z - b.z || a.y - b.y || a.x - b.x).map(tile => {
                        const isBlocked = isTileBlocked(tile, tiles);
                        return (
                            <div 
                                key={tile.id}
                                className={cn(
                                    "absolute w-8 h-10 rounded text-center text-xl flex items-center justify-center font-sans transition-all duration-200 border-b-4 border-r-4",
                                    "bg-[#fcf7e9] border-[#cec7b6]",
                                    !isBlocked && "cursor-pointer hover:bg-yellow-200",
                                    selectedTile?.id === tile.id && "ring-2 ring-blue-500",
                                    hint?.includes(tile.id) && "animate-pulse ring-2 ring-green-500",
                                    isBlocked && "brightness-[85%]"
                                )}
                                style={{
                                    left: tile.x * 6,
                                    top: tile.y * 6,
                                    zIndex: tile.z * 100 + tile.y,
                                    transform: `translate(${tile.z*3}px, -${tile.z*3}px)`
                                }}
                                onClick={() => handleTileClick(tile)}
                            >
                                <span className="drop-shadow-sm">{tile.symbol}</span>
                            </div>
                        )
                    })}
                </div>
                 <Dialog open={gameOver} onOpenChange={(isOpen) => !isOpen && setGameOver(false)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-center text-center">
                               <Award className="w-12 h-12 text-yellow-500 mr-4" />
                               You Won!
                            </DialogTitle>
                            <DialogDescription className="text-xl text-center py-4">
                                Congratulations, you've cleared the board!
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button onClick={initializeGame} className="w-full">Play Again</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
}

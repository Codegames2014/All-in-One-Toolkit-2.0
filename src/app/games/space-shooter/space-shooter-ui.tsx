"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export function SpaceShooterUI() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<() => void>();

  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const state = {
      ship: { x: canvas.width / 2, y: canvas.height - 50, width: 30, height: 20 },
      bullets: [] as { x: number, y: number, width: number, height: number }[],
      enemies: [] as { x: number, y: number, width: number, height: number }[],
      keys: { ArrowLeft: false, ArrowRight: false, Space: false },
      score: 0,
      gameOver: false,
      enemySpeed: 2,
      enemySpawnRate: 100, // frames per spawn
      frameCount: 0,
    };

    const SHIP_SPEED = 5;
    const BULLET_SPEED = 7;
    const ENEMY_WIDTH = 30;
    const ENEMY_HEIGHT = 20;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key.startsWith('Arrow')) e.preventDefault();
      if (e.key === ' ') state.keys.Space = true;
      if (state.keys.hasOwnProperty(e.key)) state.keys[e.key as keyof typeof state.keys] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') state.keys.Space = false;
      if (state.keys.hasOwnProperty(e.key)) state.keys[e.key as keyof typeof state.keys] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function update() {
      if (state.gameOver || !canvas || !ctx) return;

      const { ship, bullets, enemies, keys } = state;
      
      // Update ship position
      if (keys.ArrowLeft && ship.x > 0) {
        ship.x -= SHIP_SPEED;
      }
      if (keys.ArrowRight && ship.x < canvas.width - ship.width) {
        ship.x += SHIP_SPEED;
      }

      // Shoot
      if (keys.Space) {
        bullets.push({ x: ship.x + ship.width / 2 - 2.5, y: ship.y, width: 5, height: 10 });
        keys.Space = false; // Single shot per press
      }

      // Update bullets
      state.bullets = bullets.map(b => ({ ...b, y: b.y - BULLET_SPEED })).filter(b => b.y + b.height > 0);

      // Spawn enemies
      state.frameCount++;
      if (state.frameCount % state.enemySpawnRate === 0) {
        const x = Math.random() * (canvas.width - ENEMY_WIDTH);
        enemies.push({ x, y: -ENEMY_HEIGHT, width: ENEMY_WIDTH, height: ENEMY_HEIGHT });
        if(state.enemySpawnRate > 20) state.enemySpawnRate--; // Increase spawn rate
      }
      
      // Update enemies and check collisions
      const newEnemies: typeof enemies = [];
      const newBullets: typeof bullets = [];

      enemies.forEach(enemy => {
        enemy.y += state.enemySpeed;
        let enemyDestroyed = false;

        bullets.forEach(bullet => {
            // Bullet-enemy collision
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                enemyDestroyed = true;
                state.score += 10;
            } else {
                newBullets.push(bullet);
            }
        });

        if (!enemyDestroyed) {
            if (enemy.y < canvas.height) {
                newEnemies.push(enemy);
            }
            // Ship-enemy collision
            if (ship.x < enemy.x + enemy.width &&
                ship.x + ship.width > enemy.x &&
                ship.y < enemy.y + enemy.height &&
                ship.y + ship.height > enemy.y) {
                state.gameOver = true;
            }
        }
      });
      state.enemies = newEnemies;
      state.bullets = newBullets;
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw ship
      ctx.fillStyle = '#0f0';
      ctx.fillRect(state.ship.x, state.ship.y, state.ship.width, state.ship.height);

      // Draw bullets
      ctx.fillStyle = '#f00';
      state.bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

      // Draw enemies
      ctx.fillStyle = '#00f';
      state.enemies.forEach(e => ctx.fillRect(e.x, e.y, e.width, e.height));
      
      // Draw score
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${state.score}`, 10, 30);
      
      if (state.gameOver) {
          ctx.font = '50px Arial';
          ctx.textAlign = 'center';
          ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
      }
    }

    function loop() {
      update();
      draw();
      animationFrameId = requestAnimationFrame(loop);
    }
    
    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    gameLoopRef.current = startGame();
    return () => gameLoopRef.current?.();
  }, [startGame]);

  return (
    <Card className="shadow-2xl overflow-hidden">
        <CardContent className="p-2 md:p-4 bg-black">
            <canvas ref={canvasRef} width="800" height="600" className="w-full h-auto rounded-lg"></canvas>
            <div className="mt-4 text-center">
              <Button onClick={startGame} className="w-full"><RotateCcw className="mr-2"/>Restart Game</Button>
            </div>
        </CardContent>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import './App.css';

// Color constants for inline styles (as specified)
const COLORS = {
  primary: '#1976d2',   // Blue
  accent: '#ff4081',    // Pink
  secondary: '#ffffff', // White
};

/**
 * PUBLIC_INTERFACE
 * The main Tic Tac Toe application component.
 * Handles game state, rendering, and user interaction.
 */
function App() {
  // Represents the 3x3 Tic Tac Toe board; null is empty, 'X', 'O' otherwise
  const [board, setBoard] = useState(Array(9).fill(null));
  // 'X' starts first
  const [xIsNext, setXIsNext] = useState(true);
  // winner: null (still playing), 'X'/'O' (winner), or 'draw'
  const [winner, setWinner] = useState(null);

  // Whenever the board changes, check for a winner or draw
  useEffect(() => {
    const result = calculateWinner(board);
    if (result) {
      setWinner(result);
    } else if (board.every((cell) => cell !== null)) {
      setWinner('draw');
    }
  }, [board]);

  /**
   * PUBLIC_INTERFACE
   * Handles a click on a board cell.
   * @param {number} idx - The board cell index (0-8).
   */
  function handleCellClick(idx) {
    if (winner || board[idx]) return; // Prevent move if game is over or cell is not empty
    const newBoard = board.slice();
    newBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  }

  /**
   * PUBLIC_INTERFACE
   * Starts a new game by resetting the board and state.
   */
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  }

  // Compute status to display above the board
  let statusText = '';
  if (winner === 'draw') {
    statusText = "It's a draw!";
  } else if (winner) {
    statusText = `Winner: ${winner}`;
  } else {
    statusText = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  // Style helpers for modern, light-themed design with required colors
  const appContainerStyle = {
    minHeight: '100vh',
    background: COLORS.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Segoe UI, Arial, sans-serif',
  };

  const panelStyle = {
    background: '#f9fafd',
    borderRadius: 20,
    boxShadow: '0 4px 32px rgba(25, 118, 210, 0.07)',
    padding: '40px 32px 32px 32px',
    minWidth: 330,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: `1.5px solid ${COLORS.primary}15`
  };

  const statusStyle = {
    marginBottom: 28,
    fontSize: 22,
    fontWeight: 500,
    color: winner ? COLORS.accent : COLORS.primary,
    minHeight: 32,
    textAlign: 'center',
    transition: 'color 0.18s',
    letterSpacing: '0.025em',
  };

  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 60px)',
    gridTemplateRows: 'repeat(3, 60px)',
    gap: 0,
    background: COLORS.primary,
    borderRadius: 14,
    boxShadow: '0 2px 10px rgba(25, 118, 210, 0.05)',
    marginBottom: 28,
    userSelect: 'none',
    border: `2.5px solid ${COLORS.primary}`,
  };

  const cellStyle = (idx) => ({
    width: 60,
    height: 60,
    background: COLORS.secondary,
    color: board[idx] === 'X' ? COLORS.primary : (board[idx] === 'O' ? COLORS.accent : '#b0b5ba'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 34,
    fontWeight: 700,
    borderRight: (idx % 3 !== 2) ? `2px solid ${COLORS.primary}22` : "none",
    borderBottom: (idx < 6) ? `2px solid ${COLORS.primary}22` : "none",
    cursor: winner || board[idx] ? 'default' : 'pointer',
    transition: 'background 0.25s, color 0.17s',
    borderTopLeftRadius: idx === 0 ? 12 : 0,
    borderTopRightRadius: idx === 2 ? 12 : 0,
    borderBottomLeftRadius: idx === 6 ? 12 : 0,
    borderBottomRightRadius: idx === 8 ? 12 : 0,
  });

  const restartBtnStyle = {
    marginTop: 12,
    padding: '10px 30px',
    fontSize: 16,
    borderRadius: 8,
    border: 'none',
    background: COLORS.accent,
    color: COLORS.secondary,
    fontWeight: 600,
    boxShadow: '0 1px 5px #1976d22a',
    cursor: 'pointer',
    letterSpacing: '0.03em',
    transition: 'background 0.18s, transform 0.15s',
    outline: 'none',
  };

  return (
    <div style={appContainerStyle}>
      <div style={panelStyle}>
        <div style={statusStyle} aria-live="polite">
          {statusText}
        </div>
        <div style={boardStyle} role="grid" aria-label="Tic Tac Toe board">
          {board.map((cell, idx) => (
            <div
              key={idx}
              style={cellStyle(idx)}
              onClick={() => handleCellClick(idx)}
              role="button"
              tabIndex={winner || board[idx] ? -1 : 0}
              aria-label={`Row ${Math.floor(idx / 3) + 1} Column ${idx % 3 + 1}${board[idx] ? `, ${board[idx]}` : ''}`}
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && !board[idx] && !winner) {
                  handleCellClick(idx);
                }
              }}
            >
              {cell}
            </div>
          ))}
        </div>
        <button
          onClick={handleRestart}
          style={restartBtnStyle}
          aria-label="Restart game"
          disabled={board.every((c) => c === null) && !winner}
        >
          Restart
        </button>
      </div>
    </div>
  );
}

/**
 * PUBLIC_INTERFACE
 * Checks the board for a winner. Returns 'X', 'O', or null.
 * @param {Array} squares - The game board state.
 * @returns {'X' | 'O' | null}
 */
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8], // rows
    [0,3,6], [1,4,7], [2,5,8], // columns
    [0,4,8], [2,4,6],          // diagonals
  ];
  for (let [a,b,c] of lines) {
    if (
      squares[a] && 
      squares[a] === squares[b] && 
      squares[a] === squares[c]
    ) {
      return squares[a];
    }
  }
  return null;
}

export default App;

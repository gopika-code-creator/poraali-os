import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Minus, Square, Copy, X } from 'lucide-react';
import { sounds } from '../utils/sound';

export interface Win95WindowProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isFocused: boolean;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize?: () => void;
  onClose: () => void;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  children: React.ReactNode;
  className?: string;
  canClose?: boolean;
}

export const Win95Window: React.FC<Win95WindowProps> = ({
  id,
  title,
  icon,
  isOpen,
  isMinimized,
  isFocused,
  onFocus,
  onMinimize,
  onClose,
  defaultPosition = { x: 50, y: 40 },
  defaultSize = { width: 620, height: 480 },
  minWidth = 320,
  minHeight = 240,
  children,
  className = '',
  canClose = true
}) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isMaximized, setIsMaximized] = useState(false);
  const [preMaxState, setPreMaxState] = useState<{ position: { x: number; y: number }; size: { width: number; height: number } }>({
    position: defaultPosition,
    size: defaultSize
  });

  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 });

  const isResizingRef = useRef(false);
  const resizeDirectionRef = useRef<string>('');
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0, posX: 0, posY: 0 });

  // Handle window dragging from titlebar
  const handleTitleBarMouseDown = (e: React.MouseEvent) => {
    // Only drag on primary mouse button
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest('button')) return;

    onFocus();
    if (isMaximized) return; // Cannot drag while maximized

    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = moveEvent.clientX - dragStartRef.current.x;
      const dy = moveEvent.clientY - dragStartRef.current.y;

      const newX = Math.max(0, Math.min(window.innerWidth - 80, dragStartRef.current.posX + dx));
      const newY = Math.max(0, Math.min(window.innerHeight - 80, dragStartRef.current.posY + dy));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Handle resize from edges or corners
  const handleResizeMouseDown = (direction: string) => (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.preventDefault();

    onFocus();
    if (isMaximized) return;

    isResizingRef.current = true;
    resizeDirectionRef.current = direction;
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
      posX: position.x,
      posY: position.y
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isResizingRef.current) return;

      const dx = moveEvent.clientX - resizeStartRef.current.x;
      const dy = moveEvent.clientY - resizeStartRef.current.y;
      const dir = resizeDirectionRef.current;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newPosX = resizeStartRef.current.posX;
      let newPosY = resizeStartRef.current.posY;

      if (dir.includes('e')) {
        newWidth = Math.max(minWidth, resizeStartRef.current.width + dx);
      }
      if (dir.includes('s')) {
        newHeight = Math.max(minHeight, resizeStartRef.current.height + dy);
      }
      if (dir.includes('w')) {
        const potentialWidth = resizeStartRef.current.width - dx;
        if (potentialWidth >= minWidth) {
          newWidth = potentialWidth;
          newPosX = resizeStartRef.current.posX + dx;
        }
      }
      if (dir.includes('n')) {
        const potentialHeight = resizeStartRef.current.height - dy;
        if (potentialHeight >= minHeight) {
          newHeight = potentialHeight;
          newPosY = resizeStartRef.current.posY + dy;
        }
      }

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newPosX, y: newPosY });
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleToggleMaximize = () => {
    sounds.playKeyClick();
    if (isMaximized) {
      setIsMaximized(false);
      setPosition(preMaxState.position);
      setSize(preMaxState.size);
    } else {
      setPreMaxState({ position, size });
      setIsMaximized(true);
    }
  };

  if (!isOpen || isMinimized) return null;

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        position: 'fixed',
        top: 36,
        left: 0,
        right: 0,
        bottom: 36,
        width: '100%',
        height: 'calc(100% - 72px)',
        zIndex: isFocused ? 35 : 25
      }
    : {
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        maxWidth: 'calc(100vw - 16px)',
        maxHeight: 'calc(100vh - 80px)',
        zIndex: isFocused ? 35 : 25
      };

  return (
    <div
      onMouseDown={onFocus}
      style={windowStyle}
      className={`win95-box flex flex-col shadow-2xl overflow-hidden select-none font-mono text-xs ${className}`}
    >
      {/* Title Bar - Drag Handle */}
      <div
        onMouseDown={handleTitleBarMouseDown}
        onDoubleClick={handleToggleMaximize}
        className={`flex-shrink-0 px-2 py-1 flex items-center justify-between font-bold text-xs cursor-move select-none ${
          isFocused ? 'win95-titlebar' : 'bg-[#808080] text-[#dcdcdc]'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden truncate">
          {icon}
          <span className="truncate">{title}</span>
        </div>

        {/* Window Control Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
          {/* Minimize Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sounds.playKeyClick();
              onMinimize();
            }}
            title="Minimize"
            className="win95-btn w-4 h-4 p-0 flex items-center justify-center font-bold text-[10px] text-gray-900 cursor-pointer active:translate-y-0.5"
          >
            <Minus size={10} strokeWidth={3} />
          </button>

          {/* Maximize / Restore Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleMaximize();
            }}
            title={isMaximized ? 'Restore Down' : 'Maximize'}
            className="win95-btn w-4 h-4 p-0 flex items-center justify-center font-bold text-[10px] text-gray-900 cursor-pointer active:translate-y-0.5"
          >
            {isMaximized ? <Copy size={9} strokeWidth={2.5} /> : <Square size={9} strokeWidth={2.5} />}
          </button>

          {/* Close Button */}
          {canClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                sounds.playKeyClick();
                onClose();
              }}
              title="Close"
              className="win95-btn w-4 h-4 p-0 flex items-center justify-center font-bold text-[10px] text-gray-900 cursor-pointer active:translate-y-0.5"
            >
              <X size={11} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>

      {/* Window Body */}
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col bg-[#c0c0c0]">
        {children}
      </div>

      {/* Resizing Edge Handles (Active only when not maximized) */}
      {!isMaximized && (
        <>
          {/* Edges */}
          <div
            onMouseDown={handleResizeMouseDown('n')}
            className="absolute top-0 left-2 right-2 h-1.5 cursor-n-resize z-50"
          />
          <div
            onMouseDown={handleResizeMouseDown('s')}
            className="absolute bottom-0 left-2 right-2 h-1.5 cursor-s-resize z-50"
          />
          <div
            onMouseDown={handleResizeMouseDown('w')}
            className="absolute left-0 top-2 bottom-2 w-1.5 cursor-w-resize z-50"
          />
          <div
            onMouseDown={handleResizeMouseDown('e')}
            className="absolute right-0 top-2 bottom-2 w-1.5 cursor-e-resize z-50"
          />

          {/* Corners */}
          <div
            onMouseDown={handleResizeMouseDown('nw')}
            className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize z-50"
          />
          <div
            onMouseDown={handleResizeMouseDown('ne')}
            className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize z-50"
          />
          <div
            onMouseDown={handleResizeMouseDown('sw')}
            className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize z-50"
          />
          <div
            onMouseDown={handleResizeMouseDown('se')}
            className="absolute bottom-0 right-0 w-3.5 h-3.5 cursor-se-resize z-50 bg-transparent flex items-end justify-end p-0.5"
          >
            {/* Windows 95 textured resize grip in bottom-right */}
            <div className="w-2 h-2 border-r-2 border-b-2 border-gray-600 pointer-events-none" />
          </div>
        </>
      )}
    </div>
  );
};

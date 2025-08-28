import React, { useState, useMemo, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ZoomIn, ZoomOut, Maximize2, Minimize2, BarChart3, Layers, Grid3x3 } from 'lucide-react';

interface LCS3DVisualizerProps {
  dpTable: number[][][] | number[][];
  strings: string[];
  theme: string;
  lcsResult: string;
}

interface ViewState {
  rotation: { x: number; y: number; z: number };
  zoom: number;
  translation: { x: number; y: number };
  layerSlice: number;
  viewMode: '3d' | 'layers' | 'projection';
}

const LCS3DVisualizer: React.FC<LCS3DVisualizerProps> = ({
  dpTable,
  strings,
  theme,
  lcsResult
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewState, setViewState] = useState<ViewState>({
    rotation: { x: -20, y: 25, z: 0 },
    zoom: 1,
    translation: { x: 0, y: 0 },
    layerSlice: 0,
    viewMode: '3d'
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Normalize the table to a consistent format
  const normalizedTable = useMemo((): number[][] | number[][][] => {
    if (!dpTable || (Array.isArray(dpTable) && dpTable.length === 0)) {
      return [];
    }
    
    // If it's already a 2D table, return as-is
    if (Array.isArray(dpTable) && Array.isArray(dpTable[0]) && typeof dpTable[0][0] === 'number') {
      return dpTable as number[][];
    }
    
    // If it's a 3D table, return the first slice
    if (Array.isArray(dpTable) && Array.isArray(dpTable[0]) && Array.isArray(dpTable[0][0])) {
      return (dpTable as number[][][])[0] || [];
    }
    
    return [];
  }, [dpTable]);

  const dimensions = useMemo(() => {
    if (strings.length === 2) {
      const table2D = normalizedTable as number[][];
      return [
        table2D.length || (strings[0].length + 1), 
        table2D[0]?.length || (strings[1].length + 1), 
        1
      ];
    }
    if (strings.length === 3) {
      const table3D = normalizedTable as number[][][];
      if (Array.isArray(table3D) && Array.isArray(table3D[0]) && Array.isArray(table3D[0][0])) {
        return [table3D.length, table3D[0].length, table3D[0][0].length];
      }
      return [strings[0]?.length + 1 || 1, strings[1]?.length + 1 || 1, strings[2]?.length + 1 || 1];
    }
    return [strings[0]?.length + 1 || 1, strings[1]?.length + 1 || 1, 1];
  }, [strings, normalizedTable]);

  // Mouse interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    
    const deltaX = e.clientX - lastMousePos.current.x;
    const deltaY = e.clientY - lastMousePos.current.y;
    
    setViewState(prev => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        y: prev.rotation.y + deltaX * 0.5,
        x: Math.max(-90, Math.min(90, prev.rotation.x - deltaY * 0.5))
      }
    }));
    
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Wheel handler for zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setViewState(prev => ({
      ...prev,
      zoom: Math.max(0.3, Math.min(3, prev.zoom * delta))
    }));
  };

  // Generate cube positions for 3D visualization
  const generateCubePositions = () => {
    const cubes: Array<{
      position: [number, number, number];
      value: number;
      isHighlighted: boolean;
      isInPath: boolean;
      coords: [number, number, number];
    }> = [];

    if (strings.length === 2) {
      // 2D visualization as flat cubes
      const table2D = normalizedTable as number[][];
      for (let i = 0; i < dimensions[0]; i++) {
        for (let j = 0; j < dimensions[1]; j++) {
          const value = table2D[i]?.[j] || 0;
          cubes.push({
            position: [i * 40 - (dimensions[0] * 20), j * 40 - (dimensions[1] * 20), 0],
            value,
            isHighlighted: false,
            isInPath: false,
            coords: [i, j, 0]
          });
        }
      }
    } else if (strings.length === 3) {
      // True 3D visualization
      const table3D = normalizedTable as number[][][];
      for (let i = 0; i < dimensions[0]; i++) {
        for (let j = 0; j < dimensions[1]; j++) {
          for (let k = 0; k < dimensions[2]; k++) {
            const value = table3D[i]?.[j]?.[k] || 0;
            cubes.push({
              position: [
                i * 50 - (dimensions[0] * 25),
                j * 50 - (dimensions[1] * 25),
                k * 50 - (dimensions[2] * 25)
              ],
              value,
              isHighlighted: false,
              isInPath: false,
              coords: [i, j, k]
            });
          }
        }
      }
    }

    return cubes;
  };

  const cubes = generateCubePositions();

  const LayerView: React.FC = () => (
    <div className="space-y-4">
      {/* Layer selector */}
      <div className="flex items-center justify-between">
        <h4 className={`text-sm font-semibold ${
          theme === 'dark' ? 'text-white' : 'text-slate-900'
        }`}>
          Layer View - {strings.length === 3 ? `Layer ${viewState.layerSlice + 1}` : '2D View'}
        </h4>
        {strings.length === 3 && (
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max={dimensions[2] - 1}
              value={viewState.layerSlice}
              onChange={(e) => setViewState(prev => ({ ...prev, layerSlice: parseInt(e.target.value) }))}
              className="w-24"
            />
            <span className={`text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              {viewState.layerSlice + 1}/{dimensions[2]}
            </span>
          </div>
        )}
      </div>

      {/* 2D Grid for current layer */}
      <div className="overflow-auto">
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className={`p-2 border text-xs ${
                  theme === 'dark' ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-900'
                }`}></th>
                {(strings[1] || '').split('').map((char, idx) => (
                  <th key={idx} className={`p-2 border text-center text-xs font-mono ${
                    theme === 'dark' ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-900'
                  }`}>
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(strings[0] || '').split('').map((char1, i) => (
                <tr key={i}>
                  <th className={`p-2 border text-center text-xs font-mono ${
                    theme === 'dark' ? 'border-slate-600 text-white' : 'border-slate-300 text-slate-900'
                  }`}>
                    {char1}
                  </th>
                  {(strings[1] || '').split('').map((_, j) => {
                    let value = 0;
                    if (strings.length === 3) {
                      const table3D = normalizedTable as number[][][];
                      value = table3D[i + 1]?.[j + 1]?.[viewState.layerSlice] || 0;
                    } else {
                      const table2D = normalizedTable as number[][];
                      value = table2D[i + 1]?.[j + 1] || 0;
                    }
                    
                    return (
                      <td key={j} className={`p-2 border text-center text-xs font-mono ${
                        theme === 'dark' ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-300 bg-white text-slate-900'
                      }`}>
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const Cube3D: React.FC<{ cube: any; index: number }> = ({ cube, index }) => {
    const [x, y, z] = cube.position;
    const scale = viewState.zoom;
    const opacity = cube.value === 0 ? 0.3 : Math.min(1, 0.4 + cube.value * 0.15);
    
    // Apply 3D transformation
    const transform = `
      perspective(1000px)
      rotateX(${viewState.rotation.x}deg)
      rotateY(${viewState.rotation.y}deg)
      rotateZ(${viewState.rotation.z}deg)
      scale3d(${scale}, ${scale}, ${scale})
      translate3d(${x + viewState.translation.x}px, ${y + viewState.translation.y}px, ${z}px)
    `;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity, scale: 1 }}
        transition={{ delay: index * 0.01, duration: 0.3 }}
        className={`absolute w-8 h-8 border-2 rounded-md flex items-center justify-center text-xs font-mono ${
          cube.value > 0
            ? theme === 'dark'
              ? 'bg-blue-600/70 border-blue-400 text-white'
              : 'bg-blue-100 border-blue-500 text-blue-800'
            : theme === 'dark'
              ? 'bg-slate-700/50 border-slate-500 text-slate-400'
              : 'bg-slate-100/50 border-slate-300 text-slate-600'
        }`}
        style={{
          transform,
          transformStyle: 'preserve-3d',
          zIndex: 1000 - Math.round(z)
        }}
      >
        {cube.value}
      </motion.div>
    );
  };

  return (
    <div className={`rounded-2xl backdrop-blur-sm ${
      theme === 'dark' ? 'bg-slate-800/60' : 'bg-white/80'
    } shadow-lg border border-slate-200/20`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200/20">
        <div>
          <h3 className={`text-base font-semibold flex items-center ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            <Grid3x3 className="h-4 w-4 mr-2" />
            {strings.length === 2 ? '2D Matrix' : strings.length === 3 ? '3D Cube' : 'Multi-String'} Visualization
          </h3>
          <p className={`text-xs mt-1 ${
            theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {strings.length} strings • {dimensions.join(' × ')} matrix
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* View mode selector */}
          <div className="flex rounded-lg overflow-hidden border border-slate-200/20">
            {[
              { mode: '3d' as const, icon: Grid3x3, label: '3D' },
              { mode: 'layers' as const, icon: Layers, label: 'Layers' },
              { mode: 'projection' as const, icon: BarChart3, label: 'Chart' }
            ].map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewState(prev => ({ ...prev, viewMode: mode }))}
                className={`px-2 py-1 text-xs flex items-center space-x-1 transition-all ${
                  viewState.viewMode === mode
                    ? theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-2 rounded-lg transition-all ${
              theme === 'dark'
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Visualization Area */}
      <div className={`${
        isExpanded ? 'h-[70vh]' : 'h-96'
      } overflow-hidden relative`}>
        {viewState.viewMode === 'layers' ? (
          <div className="p-4">
            <LayerView />
          </div>
        ) : viewState.viewMode === '3d' ? (
          <div
            ref={containerRef}
            className="w-full h-full relative overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ perspective: '1000px' }}
          >
            {/* 3D Cubes */}
            <div className="absolute inset-0 flex items-center justify-center">
              {cubes.map((cube, index) => (
                <Cube3D key={index} cube={cube} index={index} />
              ))}
            </div>

            {/* 3D Controls */}
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button
                onClick={() => setViewState(prev => ({ ...prev, zoom: Math.min(3, prev.zoom * 1.2) }))}
                className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-700/80 text-white' : 'bg-white/80 text-slate-700'
                } shadow-md hover:scale-105 transition-all`}
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewState(prev => ({ ...prev, zoom: Math.max(0.3, prev.zoom * 0.8) }))}
                className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-700/80 text-white' : 'bg-white/80 text-slate-700'
                } shadow-md hover:scale-105 transition-all`}
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewState(prev => ({ ...prev, rotation: { x: -20, y: 25, z: 0 }, zoom: 1, translation: { x: 0, y: 0 } }))}
                className={`p-2 rounded-lg ${
                  theme === 'dark' ? 'bg-slate-700/80 text-white' : 'bg-white/80 text-slate-700'
                } shadow-md hover:scale-105 transition-all`}
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Axis labels */}
            <div className="absolute bottom-4 left-4 text-xs space-y-1">
              <div className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                X: {strings[0] || 'String 1'}
              </div>
              <div className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Y: {strings[1] || 'String 2'}
              </div>
              {strings.length >= 3 && (
                <div className={`${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Z: {strings[2] || 'String 3'}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Projection/Chart view
          <div className="p-4 flex items-center justify-center h-full">
            <div className={`text-center ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Statistical projection view coming soon...</p>
            </div>
          </div>
        )}
      </div>

      {/* LCS Result Display */}
      {lcsResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`m-4 p-4 rounded-xl ${
            theme === 'dark' ? 'bg-gradient-to-r from-slate-700/80 to-slate-600/80' : 'bg-gradient-to-r from-blue-50 to-green-50'
          } border ${theme === 'dark' ? 'border-slate-500' : 'border-slate-200'}`}
        >
          <h4 className={`text-sm font-semibold mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            🎯 Longest Common Subsequence ({strings.length} strings)
          </h4>
          
          <div className={`p-3 rounded-lg text-center mb-3 ${
            theme === 'dark' ? 'bg-slate-800 border border-slate-600' : 'bg-white border border-slate-200'
          }`}>
            <div className={`text-lg font-mono font-bold tracking-wider ${
              theme === 'dark' ? 'text-green-400' : 'text-green-600'
            }`}>
              {lcsResult || 'No common subsequence'}
            </div>
            <div className={`text-xs mt-1 ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Length: {lcsResult.length}
            </div>
          </div>

          {/* String highlighting */}
          <div className="grid gap-3">
            {strings.map((str, idx) => (
              <div key={idx}>
                <label className={`block text-xs font-medium mb-2 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  String {idx + 1}: {str}
                </label>
                <div className="flex flex-wrap gap-1">
                  {str.split('').map((char, charIdx) => (
                    <span
                      key={charIdx}
                      className={`px-2 py-1 rounded text-xs font-mono ${
                        lcsResult.includes(char)
                          ? theme === 'dark'
                            ? 'bg-green-900/50 text-green-300 border border-green-600'
                            : 'bg-green-100 text-green-700 border border-green-300'
                          : theme === 'dark'
                            ? 'bg-slate-700 text-slate-400 border border-slate-600'
                            : 'bg-slate-100 text-slate-600 border border-slate-300'
                      }`}
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LCS3DVisualizer;

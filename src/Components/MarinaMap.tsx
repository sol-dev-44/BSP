import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SlipProps {
  id: string;
  x: number;
  y: number;
  highlighted?: boolean;
}

interface BuildingProps {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  icon?: string;
}

const MarinaMap: React.FC = () => {
  const [hoveredSlip, setHoveredSlip] = useState<string | null>(null);
  
  const Slip: React.FC<SlipProps> = ({ id, x, y, highlighted }) => (
    <motion.g
      onMouseEnter={() => setHoveredSlip(id)}
      onMouseLeave={() => setHoveredSlip(null)}
      style={{ cursor: 'pointer' }}
    >
      <motion.rect
        x={x}
        y={y}
        width={30}
        height={25}
        fill={highlighted ? '#FFD700' : hoveredSlip === id ? '#E3F2FD' : '#FFFFFF'}
        stroke={highlighted ? '#FF8C00' : '#607D8B'}
        strokeWidth={highlighted ? 3 : 2}
        rx={3}
        animate={highlighted ? {
          scale: [1, 1.1, 1],
          transition: { duration: 2, repeat: Infinity }
        } : {}}
      />
      <text
        x={x + 15}
        y={y + 16}
        textAnchor="middle"
        fontSize="10"
        fontWeight={highlighted ? 'bold' : 'normal'}
        fill={highlighted ? '#D84315' : '#37474F'}
      >
        {id}
      </text>
    </motion.g>
  );

  const Building: React.FC<BuildingProps> = ({ name, x, y, width, height, color, icon }) => (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        stroke="#37474F"
        strokeWidth={2}
        rx={5}
      />
      {icon && (
        <text x={x + width/2} y={y + height/2 - 10} textAnchor="middle" fontSize="24">
          {icon}
        </text>
      )}
      <text
        x={x + width/2}
        y={y + height/2 + 10}
        textAnchor="middle"
        fontSize="12"
        fontWeight="bold"
        fill="white"
      >
        {name}
      </text>
    </motion.g>
  );

  const WaterEffect: React.FC = () => (
    <defs>
      <pattern id="water" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <motion.rect
          width="100"
          height="100"
          fill="#1E88E5"
          animate={{
            x: [0, 50],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.path
          d="M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z"
          fill="#2196F3"
          opacity="0.5"
          animate={{
            d: [
              "M0,50 Q25,40 50,50 T100,50 L100,100 L0,100 Z",
              "M0,50 Q25,60 50,50 T100,50 L100,100 L0,100 Z"
            ]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </pattern>
    </defs>
  );

  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-7xl w-full">
        <h1 className="text-3xl font-bold text-blue-900 mb-4 text-center">Marina Map - Big Sky Parasail</h1>
        
        <svg viewBox="0 0 1400 900" className="w-full h-full">
          <WaterEffect />
          
          {/* Water background */}
          <rect width="1400" height="900" fill="url(#water)" />
          
          {/* Compass */}
          <g transform="translate(50, 50)">
            <circle cx="0" cy="0" r="40" fill="white" stroke="#1565C0" strokeWidth="3" />
            <path d="M 0,-30 L 10,10 L 0,0 L -10,10 Z" fill="#D32F2F" />
            <text x="0" y="5" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#1565C0">N</text>
            <text x="0" y="25" textAnchor="middle" fontSize="10" fill="#1565C0">FAR WEST</text>
          </g>
          
          {/* Piers - wooden brown */}
          <g id="piers">
            {/* Pier A - horizontal at bottom */}
            <rect x="300" y="650" width="250" height="15" fill="#6D4C41" />
            
            {/* Pier B - L-shaped */}
            <rect x="50" y="450" width="15" height="200" fill="#6D4C41" />
            <rect x="50" y="580" width="400" height="15" fill="#6D4C41" />
            
            {/* Pier C - L-shaped upper */}
            <rect x="100" y="350" width="15" height="150" fill="#6D4C41" />
            <rect x="100" y="350" width="350" height="15" fill="#6D4C41" />
            
            {/* Pier D - vertical */}
            <rect x="550" y="200" width="15" height="450" fill="#6D4C41" />
            
            {/* Pier E-F sections - horizontal with verticals */}
            <rect x="650" y="500" width="200" height="15" fill="#6D4C41" />
            <rect x="700" y="300" width="15" height="200" fill="#6D4C41" />
            <rect x="780" y="300" width="15" height="200" fill="#6D4C41" />
            
            {/* Pier G - vertical on right */}
            <rect x="1000" y="200" width="15" height="400" fill="#6D4C41" />
            <rect x="900" y="200" width="115" height="15" fill="#6D4C41" />
            
            {/* Pier P - bottom */}
            <rect x="550" y="750" width="300" height="15" fill="#6D4C41" />
          </g>
          
          {/* Slips */}
          <g id="slips">
            {/* A Section */}
            <Slip id="A1" x={460} y={620} />
            <Slip id="A2" x={420} y={620} />
            <Slip id="A3" x={380} y={620} />
            <Slip id="A4" x={340} y={620} />
            <Slip id="A5" x={300} y={620} />
            <Slip id="A6" x={260} y={620} />
            
            {/* B Section - two rows */}
            {/* Bottom row */}
            <Slip id="B1" x={70} y={550} />
            <Slip id="B2" x={110} y={550} />
            <Slip id="B3" x={150} y={550} />
            <Slip id="B4" x={190} y={550} />
            <Slip id="B5" x={230} y={550} />
            <Slip id="B6" x={270} y={550} />
            <Slip id="B7" x={310} y={550} />
            <Slip id="B8" x={350} y={550} />
            <Slip id="B9" x={390} y={550} />
            <Slip id="B10" x={430} y={550} />
            
            {/* Top row */}
            <Slip id="B12" x={70} y={600} />
            <Slip id="B13" x={110} y={600} />
            <Slip id="B14" x={150} y={600} />
            <Slip id="B15" x={190} y={600} />
            <Slip id="B16" x={230} y={600} />
            <Slip id="B17" x={270} y={600} />
            <Slip id="B18" x={310} y={600} />
            <Slip id="B19" x={350} y={600} />
            <Slip id="B20" x={390} y={600} />
            <Slip id="B21" x={430} y={600} />
            
            {/* C Section - two rows */}
            <Slip id="C1" x={120} y={380} />
            <Slip id="C2" x={160} y={380} />
            <Slip id="C3" x={200} y={380} />
            <Slip id="C4" x={240} y={380} />
            <Slip id="C5" x={280} y={380} />
            <Slip id="C6" x={320} y={380} />
            <Slip id="C7" x={360} y={380} />
            <Slip id="C8" x={400} y={380} />
            <Slip id="C9" x={440} y={380} />
            
            <Slip id="C10" x={120} y={320} />
            <Slip id="C11" x={160} y={320} />
            <Slip id="C12" x={200} y={320} />
            <Slip id="C13" x={240} y={320} />
            <Slip id="C14" x={280} y={320} />
            <Slip id="C15" x={320} y={320} />
            <Slip id="C16" x={360} y={320} />
            <Slip id="C17" x={400} y={320} />
            
            {/* D Section - vertical arrangement */}
            <Slip id="D1" x={570} y={620} />
            <Slip id="D2" x={570} y={590} />
            <Slip id="D3" x={570} y={560} />
            <Slip id="D4" x={570} y={530} />
            <Slip id="D5" x={570} y={500} />
            <Slip id="D6" x={570} y={470} />
            <Slip id="D7" x={570} y={440} />
            <Slip id="D8" x={570} y={410} />
            <Slip id="D9" x={570} y={380} />
            <Slip id="D10" x={570} y={350} />
            <Slip id="D11" x={570} y={320} />
            <Slip id="D12" x={570} y={290} />
            <Slip id="D13" x={570} y={260} />
            <Slip id="D14" x={570} y={230} />
            <Slip id="D15" x={570} y={200} />
            
            <Slip id="D16" x={520} y={470} />
            <Slip id="D17" x={520} y={440} />
            <Slip id="D18" x={520} y={410} />
            
            {/* E Section */}
            <Slip id="E1" x={670} y={470} />
            <Slip id="E2" x={670} y={440} />
            <Slip id="E3" x={670} y={410} />
            <Slip id="E4" x={670} y={380} highlighted={true} />
            <Slip id="E5" x={670} y={350} />
            <Slip id="E6" x={670} y={320} />
            <Slip id="E7" x={670} y={290} />
            <Slip id="E8" x={670} y={260} />
            
            {/* F Section - double column */}
            <Slip id="F1" x={750} y={470} />
            <Slip id="F2" x={750} y={440} />
            <Slip id="F3" x={750} y={410} />
            <Slip id="F4" x={750} y={380} />
            <Slip id="F5" x={750} y={350} />
            <Slip id="F6" x={750} y={320} />
            <Slip id="F7" x={750} y={290} />
            <Slip id="F8" x={750} y={260} />
            <Slip id="F9" x={750} y={230} />
            <Slip id="F10" x={750} y={200} />
            
            <Slip id="F11" x={810} y={470} />
            <Slip id="F12" x={810} y={440} />
            <Slip id="F13" x={810} y={410} />
            <Slip id="F14" x={810} y={380} />
            <Slip id="F15" x={810} y={350} />
            <Slip id="F16" x={810} y={320} />
            <Slip id="F17" x={810} y={290} />
            <Slip id="F18" x={810} y={260} />
            <Slip id="F19" x={810} y={230} />
            <Slip id="F20" x={810} y={200} />
            <Slip id="F21" x={810} y={170} />
            <Slip id="F22" x={810} y={140} />
            
            {/* G Section - double column */}
            <Slip id="G1" x={970} y={570} />
            <Slip id="G2" x={970} y={540} />
            <Slip id="G3" x={970} y={510} />
            <Slip id="G4" x={970} y={480} />
            <Slip id="G5" x={970} y={450} />
            <Slip id="G6" x={970} y={420} />
            <Slip id="G7" x={970} y={390} />
            <Slip id="G8" x={970} y={360} />
            <Slip id="G9" x={970} y={330} />
            <Slip id="G10" x={970} y={300} />
            <Slip id="G11" x={970} y={270} />
            <Slip id="G12" x={970} y={240} />
            <Slip id="G13" x={970} y={210} />
            
            <Slip id="G14" x={1030} y={570} />
            <Slip id="G15" x={1030} y={540} />
            <Slip id="G16" x={1030} y={510} />
            <Slip id="G17" x={1030} y={480} />
            <Slip id="G18" x={1030} y={450} />
            <Slip id="G19" x={1030} y={420} />
            <Slip id="G20" x={1030} y={390} />
            <Slip id="G21" x={1030} y={360} />
            <Slip id="G22" x={1030} y={330} />
            <Slip id="G23" x={1030} y={300} />
            <Slip id="G24" x={1030} y={270} />
            
            {/* P Section */}
            <Slip id="P1" x={570} y={720} />
            <Slip id="P2" x={610} y={720} />
            <Slip id="P3" x={650} y={720} />
            <Slip id="P4" x={690} y={720} />
            <Slip id="P5" x={730} y={720} />
            <Slip id="P6" x={770} y={720} />
            <Slip id="P7" x={810} y={720} />
          </g>
          
          {/* Buildings */}
          <g id="buildings">
            <Building name="Anchor Bar" x={750} y={600} width={140} height={80} color="#5D4037" icon="⚓" />
            <Building name="Restaurant" x={1100} y={650} width={160} height={100} color="#388E3C" icon="🍴" />
            <Building name="Harbor Grill" x={1100} y={730} width={160} height={40} color="#2E7D32" />
            <Building name="Convenience Store" x={200} y={700} width={140} height={80} color="#E65100" icon="🏪" />
            <Building name="Jetski Rentals" x={350} y={750} width={120} height={60} color="#C62828" icon="🚤" />
          </g>
          
          {/* Boat Ramp */}
          <g id="boat-ramp">
            <rect x={50} y={800} width={80} height={60} fill="#616161" stroke="#37474F" strokeWidth={2} rx={5} />
            <text x={90} y={835} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
              Boat Ramp
            </text>
          </g>
          
          {/* Trees */}
          <circle cx={1150} cy={620} r={25} fill="#4CAF50" />
          <circle cx={1200} cy={640} r={20} fill="#66BB6A" />
          
          {/* BSP Pointer */}
          <AnimatePresence>
            {hoveredSlip !== 'E4' && (
              <motion.g
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.rect
                  x={590}
                  y={340}
                  width={160}
                  height={30}
                  fill="#FFD700"
                  stroke="#FF8C00"
                  strokeWidth={2}
                  rx={15}
                  animate={{
                    y: [340, 330, 340],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <text x={670} y={359} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#D84315">
                  Big Sky Parasail HERE!
                </text>
                <polygon points="670,370 680,380 660,380" fill="#FFD700" stroke="#FF8C00" strokeWidth={2} />
              </motion.g>
            )}
          </AnimatePresence>
          
          {/* Legend */}
          <g transform="translate(1150, 50)">
            <rect x={0} y={0} width={200} height={150} fill="white" stroke="#1565C0" strokeWidth={2} rx={10} />
            <text x={100} y={25} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1565C0">
              Marina Legend
            </text>
            <rect x={20} y={40} width={20} height={15} fill="#FFD700" stroke="#FF8C00" strokeWidth={2} />
            <text x={50} y={52} fontSize="14" fill="#37474F">Big Sky Parasail (E4)</text>
            <rect x={20} y={65} width={20} height={15} fill="#FFFFFF" stroke="#607D8B" strokeWidth={2} />
            <text x={50} y={77} fontSize="14" fill="#37474F">Boat Slips</text>
            <rect x={20} y={90} width={20} height={15} fill="#6D4C41" />
            <text x={50} y={102} fontSize="14" fill="#37474F">Piers</text>
            <rect x={20} y={115} width={20} height={15} fill="#616161" />
            <text x={50} y={127} fontSize="14" fill="#37474F">Boat Ramp</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default MarinaMap;
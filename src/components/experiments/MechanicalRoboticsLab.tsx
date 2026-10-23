import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Sliders, Layers, Sparkles } from 'lucide-react';

export const MechanicalRoboticsLab: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [armAngle1, setArmAngle1] = useState<number>(45); // degrees
  const [armAngle2, setArmAngle2] = useState<number>(-30); // degrees
  const [gearRatio, setGearRatio] = useState<number>(2.5);
  const [loadTorqueNm, setLoadTorqueNm] = useState<number>(1.2);
  const [motorRpm, setMotorRpm] = useState<number>(60);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Forward Kinematics:
  // L1 = 110px, L2 = 90px
  // End-effector: x = L1*cos(th1) + L2*cos(th1 + th2), y = L1*sin(th1) + L2*sin(th1 + th2)
  const l1 = 110;
  const l2 = 90;
  const rad1 = (armAngle1 * Math.PI) / 180;
  const rad2 = ((armAngle1 + armAngle2) * Math.PI) / 180;
  const elbowX = l1 * Math.cos(rad1);
  const elbowY = -l1 * Math.sin(rad1);
  const endX = elbowX + l2 * Math.cos(rad2);
  const endY = elbowY - l2 * Math.sin(rad2);

  // Output Gear Speed & Torque
  // Speed_out = Motor_speed / GearRatio
  // Torque_out = Motor_Torque * GearRatio * efficiency (90%)
  const outputRpm = motorRpm / gearRatio;
  const motorTorqueRequired = (loadTorqueNm / (gearRatio * 0.9)).toFixed(2);
  const mechanicalPowerWatts = ((2 * Math.PI * motorRpm) / 60) * Number(motorTorqueRequired);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let gearAngle = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      if (isRunning) {
        gearAngle += (motorRpm / 60) * 0.1;
      }

      const width = canvas.width;
      const height = canvas.height;
      ctx.fillStyle = '#0a120e';
      ctx.fillRect(0, 0, width, height);

      // Section 1 (Left): 2-DOF Robotic Arm Forward Kinematics
      const armBaseX = 140;
      const armBaseY = height - 40;

      // Base mount
      ctx.fillStyle = '#1e3827';
      ctx.fillRect(armBaseX - 30, armBaseY, 60, 20);

      // Link 1
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(armBaseX, armBaseY);
      ctx.lineTo(armBaseX + elbowX, armBaseY + elbowY);
      ctx.stroke();

      // Elbow joint
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.arc(armBaseX + elbowX, armBaseY + elbowY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Link 2
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(armBaseX + elbowX, armBaseY + elbowY);
      ctx.lineTo(armBaseX + endX, armBaseY + endY);
      ctx.stroke();

      // End Effector Gripper
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(armBaseX + endX, armBaseY + endY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Target Coordinates text
      ctx.fillStyle = '#a7f3d0';
      ctx.font = '11px monospace';
      ctx.fillText(
        `End-Effector: [X: ${endX.toFixed(0)}, Y: ${(-endY).toFixed(0)}] mm`,
        20,
        30
      );

      // Section 2 (Right): Compound Gear Mesh & Torque Transmission
      const gear1X = width - 180;
      const gear1Y = height / 2;
      const r1 = 35;
      const r2 = r1 * gearRatio;
      const gear2X = gear1X + r1 + r2 - 4;
      const gear2Y = gear1Y;

      // Draw Driving Gear
      ctx.save();
      ctx.translate(gear1X, gear1Y);
      ctx.rotate(gearAngle);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r1, 0, Math.PI * 2);
      ctx.stroke();
      // Teeth
      for (let i = 0; i < 12; i++) {
        const a = (i * Math.PI) / 6;
        ctx.fillRect(Math.cos(a) * (r1 - 4), Math.sin(a) * (r1 - 4), 8, 8);
      }
      ctx.restore();

      // Draw Driven Gear
      ctx.save();
      ctx.translate(gear2X, gear2Y);
      ctx.rotate(-gearAngle / gearRatio);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, r2, 0, Math.PI * 2);
      ctx.stroke();
      // Teeth
      const numTeeth2 = Math.round(12 * gearRatio);
      for (let i = 0; i < numTeeth2; i++) {
        const a = (i * 2 * Math.PI) / numTeeth2;
        ctx.fillRect(Math.cos(a) * (r2 - 4), Math.sin(a) * (r2 - 4), 8, 8);
      }
      ctx.restore();

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px monospace';
      ctx.fillText(`Drive Gear (N1)`, gear1X - 35, gear1Y + r1 + 20);
      ctx.fillText(`Driven Gear (N2)`, gear2X - 35, gear2Y + r2 + 20);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [elbowX, elbowY, endX, endY, gearRatio, motorRpm, isRunning]);

  return (
    <div className="bg-[#101b15] border border-emerald-900/60 rounded-3xl p-5 md:p-6 space-y-5 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-emerald-950 pb-3">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
            Mechanical Engineering & Robotics
          </span>
          <h3 className="text-xl font-serif font-bold text-white">
            Robotic Kinematics & Gear Transmission Lab
          </h3>
          <p className="text-xs text-stone-300">
            2-DOF planar articulated arm forward kinematics paired with mechanical torque-speed trade-off solver.
          </p>
        </div>

        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-colors ${
            isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          <span>{isRunning ? 'Pause Mechanics' : 'Run Mechanics'}</span>
        </button>
      </div>

      <div className="relative rounded-2xl overflow-hidden border border-emerald-900/50 bg-[#060d09]">
        <canvas ref={canvasRef} width={640} height={260} className="w-full h-64 block" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Arm Joint 1 Angle ($\theta_1$):</span>
          <p className="text-base font-bold text-emerald-400 font-mono">{armAngle1}°</p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Arm Joint 2 Angle ($\theta_2$):</span>
          <p className="text-base font-bold text-sky-400 font-mono">{armAngle2}°</p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Output Shaft RPM:</span>
          <p className="text-base font-bold text-amber-400 font-mono">{outputRpm.toFixed(1)} RPM</p>
        </div>
        <div className="bg-[#121c17] p-3 rounded-2xl border border-emerald-950 space-y-1">
          <span className="text-stone-400">Motor Power Output:</span>
          <p className="text-base font-bold text-purple-400 font-mono">
            {mechanicalPowerWatts.toFixed(2)} W
          </p>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 text-xs">
        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Base Shoulder Joint ($\theta_1$):</span>
            <span className="text-emerald-400 font-mono font-bold">{armAngle1}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="120"
            value={armAngle1}
            onChange={e => setArmAngle1(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Elbow Articulation ($\theta_2$):</span>
            <span className="text-sky-400 font-mono font-bold">{armAngle2}°</span>
          </div>
          <input
            type="range"
            min="-90"
            max="90"
            value={armAngle2}
            onChange={e => setArmAngle2(Number(e.target.value))}
            className="w-full accent-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-stone-300">
            <span>Gear Ratio (N2/N1):</span>
            <span className="text-amber-400 font-mono font-bold">{gearRatio.toFixed(1)}:1</span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.5"
            value={gearRatio}
            onChange={e => setGearRatio(Number(e.target.value))}
            className="w-full accent-amber-500"
          />
        </div>
      </div>
    </div>
  );
};

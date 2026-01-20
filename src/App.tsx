import { useEffect, useReducer, useState } from 'react';
import { simulateTick } from '@/engine/simulationTick';
import { initialSimulationState } from '@/state/initialState';
import VendorTable from '@/components/VendorTable';
import IncidentTimeline from '@/components/IncidentTimeline';
import type { SimulationState } from '@/engine/types';
import { Shield, Activity, Database, CheckCircle, AlertTriangle } from 'lucide-react';

function reducer(
  state: SimulationState,
  action: { type: 'TICK' }
): SimulationState {
  if (action.type === 'TICK') {
    return simulateTick(state);
  }
  return state;
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialSimulationState);
  const [isSimulating, setIsSimulating] = useState(true);

  // Simulation timer
  useEffect(() => {
    if (!isSimulating) return;
    const id = setInterval(() => dispatch({ type: 'TICK' }), 3000);
    return () => clearInterval(id);
  }, [isSimulating]);

  // Calculate some live stats
  const totalVendors = state.vendors.length;
  const activeVendors = state.vendors.filter(v => v.status === 'active').length;
  const unresolvedIncidents = state.incidents.filter(i => i.severity).length; // or !resolved if you track resolved
  const complianceRate = Math.round(
    (state.vendors.filter(v => v.compliance.NIST && v.compliance.ISO27001).length / totalVendors) * 100
  );

  const riskScore = Math.round(
    100 -
    state.vendors.reduce((sum, v) => sum + v.securityRating, 0) / totalVendors
  );

  const getRiskLabel = (score: number) => {
    if (score < 25) return { label: 'Low', color: 'text-green-400' };
    if (score < 50) return { label: 'Medium', color: 'text-yellow-400' };
    if (score < 75) return { label: 'High', color: 'text-orange-400' };
    return { label: 'Critical', color: 'text-red-400' };
  };

  const riskLevel = getRiskLabel(riskScore);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="text-blue-400" /> Vendor Risk Platform
          </h1>
          <p className="text-gray-400">Real-time simulation of third-party vendor risk</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Overall Risk Score</p>
                <p className={`text-2xl font-bold ${riskLevel.color}`}>{riskScore}</p>
                <p className="text-xs text-gray-500">{riskLevel.label} Risk</p>
              </div>
              <AlertTriangle className={riskLevel.color.replace('text-', '')} size={32} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Vendors</p>
                <p className="text-2xl font-bold">{totalVendors}</p>
                <p className="text-xs text-gray-500">{activeVendors} healthy</p>
              </div>
              <Database className="text-blue-400" size={32} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unresolved Incidents</p>
                <p className="text-2xl font-bold text-red-400">{state.incidents.length}</p>
                <p className="text-xs text-gray-500">{unresolvedIncidents} unresolved</p>
              </div>
              <Activity className="text-red-400" size={32} />
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Compliance Rate</p>
                <p className="text-2xl font-bold text-green-400">{complianceRate}%</p>
                <p className="text-xs text-gray-500">NIST & ISO 27001</p>
              </div>
              <CheckCircle className="text-green-400" size={32} />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
              isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
          </button>
          <div className="text-sm">
            <span className="text-gray-400">Simulation Time: </span>
            <span className="font-mono text-blue-400">{Math.floor(state.time / 60)}m {state.time % 60}s</span>
          </div>
        </div>

        {/* Vendor Table */}
        <VendorTable vendors={state.vendors} />

        {/* Incident Timeline */}
        <IncidentTimeline incidents={state.incidents} vendors={state.vendors} maxItems={20} />
      </div>
    </div>
  );
}

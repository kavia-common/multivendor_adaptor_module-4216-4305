import React, { useState } from 'react';
import { configureMapping } from '../api/client';
import { useApiHandler } from '../api/hooks';
import { MappingConfigRequest } from '../api/types';

type Props = {
  onNotify?: (type: 'success'|'error'|'info', message: string) => void;
};

const ConfigureMapping: React.FC<Props> = ({ onNotify }) => {
  const [sourceModelId, setSourceModelId] = useState('');
  const [targetModelId, setTargetModelId] = useState('');
  const [rulesText, setRulesText] = useState('[]');
  const [busy, setBusy] = useState(false);
  const handle = useApiHandler(onNotify);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let mappingRules: any[] = [];
    try {
      const parsed = JSON.parse(rulesText);
      if (!Array.isArray(parsed)) throw new Error('mappingRules must be an array');
      mappingRules = parsed;
    } catch (err: any) {
      onNotify?.('error', `Invalid JSON for mappingRules: ${err.message}`);
      return;
    }
    const payload: MappingConfigRequest = { sourceModelId, targetModelId, mappingRules };
    setBusy(true);
    const res = await handle(() => configureMapping(payload));
    setBusy(false);
    if (res) {
      onNotify?.('success', res.message || 'Mapping configured.');
    }
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2 className="title">Configure Mapping</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700 }}>
        <input placeholder="Source Model ID" value={sourceModelId} onChange={(e)=>setSourceModelId(e.target.value)} />
        <input placeholder="Target Model ID" value={targetModelId} onChange={(e)=>setTargetModelId(e.target.value)} />
        <label>Mapping Rules (JSON array):</label>
        <textarea rows={10} value={rulesText} onChange={(e)=>setRulesText(e.target.value)} />
        <button className="theme-toggle" type="submit" disabled={busy}>{busy ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default ConfigureMapping;

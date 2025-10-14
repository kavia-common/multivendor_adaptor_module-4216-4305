import React, { useState } from 'react';
import { provisionService } from '../api/client';
import { useApiHandler } from '../api/hooks';
import { ServiceProvisionRequest } from '../api/types';

type Props = {
  onNotify?: (type: 'success'|'error'|'info', message: string) => void;
};

const ProvisionService: React.FC<Props> = ({ onNotify }) => {
  const [serviceType, setServiceType] = useState('');
  const [mappingId, setMappingId] = useState('');
  const [paramsText, setParamsText] = useState('{}');
  const [busy, setBusy] = useState(false);
  const handle = useApiHandler(onNotify);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let parameters: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(paramsText);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) throw new Error('parameters must be a JSON object');
      parameters = parsed;
    } catch (err: any) {
      onNotify?.('error', `Invalid JSON for parameters: ${err.message}`);
      return;
    }
    const payload: ServiceProvisionRequest = { serviceType, parameters, mappingId };
    setBusy(true);
    const res = await handle(() => provisionService(payload));
    setBusy(false);
    if (res) {
      onNotify?.('success', res.message || 'Service provisioned.');
    }
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2 className="title">Provision Service</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 700 }}>
        <input placeholder="Service Type" value={serviceType} onChange={(e)=>setServiceType(e.target.value)} />
        <input placeholder="Mapping ID" value={mappingId} onChange={(e)=>setMappingId(e.target.value)} />
        <label>Parameters (JSON object):</label>
        <textarea rows={10} value={paramsText} onChange={(e)=>setParamsText(e.target.value)} />
        <button className="theme-toggle" type="submit" disabled={busy}>{busy ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
};

export default ProvisionService;

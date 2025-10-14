import React, { useState } from 'react';
import { uploadModel } from '../api/client';
import { useApiHandler } from '../api/hooks';
import { ModelType } from '../api/types';

type Props = {
  onNotify?: (type: 'success'|'error'|'info', message: string) => void;
};

const UploadModel: React.FC<Props> = ({ onNotify }) => {
  const [modelType, setModelType] = useState<ModelType>('NB');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const handle = useApiHandler(onNotify);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      onNotify?.('error', 'Please select a file to upload.');
      return;
    }
    setBusy(true);
    const res = await handle(() => uploadModel(modelType, file));
    setBusy(false);
    if (res) {
      onNotify?.('success', res.message || 'Model uploaded.');
    }
  };

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2 className="title">Upload Model</h2>
      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 500 }}>
        <label>
          Model Type:
          <select value={modelType} onChange={(e)=>setModelType(e.target.value as ModelType)}>
            <option value="NB">NB</option>
            <option value="SB">SB</option>
          </select>
        </label>
        <label>
          File:
          <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        </label>
        <button className="theme-toggle" type="submit" disabled={busy}>{busy ? 'Uploading...' : 'Upload'}</button>
      </form>
    </div>
  );
};

export default UploadModel;

import React, { useEffect, useState } from 'react';
import { getAuditLogs } from '../api/client';
import { useApiHandler } from '../api/hooks';

type Props = {
  onNotify?: (type: 'success'|'error'|'info', message: string) => void;
};

const AuditLogs: React.FC<Props> = ({ onNotify }) => {
  const [data, setData] = useState<any>(null);
  const handle = useApiHandler(onNotify);

  useEffect(() => {
    (async () => {
      const res = await handle(() => getAuditLogs());
      if (res) setData(res.data ?? res);
    })();
  }, [handle]);

  return (
    <div className="container" style={{ padding: 24 }}>
      <h2 className="title">Audit Logs</h2>
      <pre style={{ textAlign: 'left', background: '#f5f5f5', padding: 12, borderRadius: 8 }}>
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default AuditLogs;

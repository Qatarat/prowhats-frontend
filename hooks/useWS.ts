"use client";

import { useEffect, useRef, useState } from "react";

type Env = "dev" | "stage" | "prod";


export function useWS(
  user_type: string,
  user_id: string | number,
  opts?: { env?: Env; reconnect?: boolean }
) {
  const env = opts?.env ?? "prod";
  const shouldReconnect = opts?.reconnect ?? true;

  const wsRef = useRef<WebSocket | null>(null);
  const [ready, setReady] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const retryRef = useRef(0);
  const closedByUser = useRef(false);

  useEffect(() => {
    closedByUser.current = false;

    const url = `${process.env.NEXT_PUBLIC_API_URL_SOCKET}/ws/${encodeURIComponent(
      user_type
    )}/${encodeURIComponent(String(user_id))}`;

    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      setReady(true);
      retryRef.current = 0;
    };

    ws.onmessage = (e) => {
      try {
        setMessages((m) => [JSON.parse(e.data), ...m]);
      } catch {
        // ignore non-JSON
      }
    };

    const tryReconnect = () => {
      setReady(false);
      if (!shouldReconnect || closedByUser.current) return;
      const delay = Math.min(5000, 1000 * (retryRef.current + 1)); // 1s, 2s, 3s, 4s, 5s
      retryRef.current += 1;
      setTimeout(() => {
        // re-run effect by changing a dep: use a counter? simpler—just new WS here:
        if (closedByUser.current) return;
        const w2 = new WebSocket(url);
        wsRef.current = w2;
        w2.onopen = ws.onopen;
        w2.onmessage = ws.onmessage;
        w2.onclose = ws.onclose;
        w2.onerror = ws.onerror;
      }, delay);
    };

    ws.onclose = tryReconnect;
    ws.onerror = tryReconnect;

    return () => {
      closedByUser.current = true;
      setReady(false);
      ws.close();
      wsRef.current = null;
    };
  }, [user_type, user_id, env, shouldReconnect]);

  const send = (data: any) => {
    const s = wsRef.current;
    if (!s || s.readyState !== WebSocket.OPEN) return false;
    s.send(JSON.stringify(data));
    return true;
    };

  return { ready, messages, send };
}

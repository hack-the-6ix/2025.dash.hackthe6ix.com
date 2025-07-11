'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export default function ModalPortal({ children }: { children: React.ReactNode }) {
  const [el, setEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    setEl(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  if (!el) return null;
  return createPortal(children, el);
}

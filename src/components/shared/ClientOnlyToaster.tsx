
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";

export function ClientOnlyToaster(): ReactNode {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <Toaster />;
}

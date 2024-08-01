import { useEffect, useState } from "react";

export const useIsClient = (): boolean => {
  const [client, setClient] = useState(false);

  useEffect(() => setClient(true), []);

  return client;
};

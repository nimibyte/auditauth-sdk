'use server';

import { auditauth } from "@/providers/auth";

const testAuthCall = async (path: string) => {
  const res = await auditauth.fetch(path)

  const data = await res.json()

  return data;
};

export { testAuthCall };

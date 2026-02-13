'use server';

import { auditauth } from "@/providers/auth";

const testAuthCall = async (path: string) => {
  const res = await auditauth.fetch(path)

  if (!res.ok) {
    console.log('testlog>>>>>authcall', res);
    return {
      error: await res.text(),
    };
  }


  const data = await res.json()
  return data;
};

export { testAuthCall };

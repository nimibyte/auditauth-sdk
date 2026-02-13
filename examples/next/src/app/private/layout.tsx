'use server'
import { AuditAuthGuard } from "@auditauth/next";

const ConsoleLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {

  return (
    <AuditAuthGuard>
      {children}
    </AuditAuthGuard>
  );
};

export default ConsoleLayout;


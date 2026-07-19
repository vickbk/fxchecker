import { ReactNode } from "react";
import { saveConversion } from "../actions";
import { LogCoversionAction } from "../types";

export const LogsProvider = ({
  logConversion,
  children,
}: {
  children: ReactNode;
  logConversion: LogCoversionAction;
}) => {
  const logAction = saveConversion.bind(null, logConversion) as unknown as (
    form: FormData,
  ) => void;

  return <form action={logAction}>{children}</form>;
};

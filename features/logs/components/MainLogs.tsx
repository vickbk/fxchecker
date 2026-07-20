import { Heading } from "@/shared/heading";
import {
  CurrencyCardContainer,
  SectionsWrapper,
  SignInInterceptor,
} from "@/shared/utils";
import { getLogs } from "../utils";
import { Actions } from "./Actions";
import { EmptyLogs } from "./EmptyLogs";
import { LogCard } from "./LogCard";
import { LogDelete } from "./LogDelete";

export const MainLogs = async (params: {
  searchParams: Promise<Record<string, string>>;
  SignInInterceptor: SignInInterceptor;
}) => {
  const [logs, searchParams] = await Promise.all([
    getLogs(),
    params.searchParams,
  ]);
  const count = logs.length;
  if (count === 0) return <EmptyLogs />;

  return (
    <>
      <SectionsWrapper sectionId="logs-header">
        <Heading id="logs-header">Conversion Log</Heading>
        <Actions count={count} {...params} />
        <CurrencyCardContainer>
          {logs.map(({ id, data, editTime }) => (
            <LogCard
              key={id}
              {...{ id, data: data!, editTime }}
              {...{ ...params, searchParams }}
            >
              <LogDelete SignInInterceptor={params.SignInInterceptor} />
            </LogCard>
          ))}
        </CurrencyCardContainer>
      </SectionsWrapper>
    </>
  );
};

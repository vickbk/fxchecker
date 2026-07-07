import { CurrencyCard } from "@/shared/utils";
import Image from "next/image";
import { CurrencyActions } from "./CurrencyActions";

export const CompareCurreny = () => {
  return (
    <CurrencyCard>
      <Image src="/flags/de.webpg" alt="DRC flag" width={100} height={100} />
      <dl>
        <dt>GBP</dt>
        <dd>British Pound</dd>
      </dl>
      <dl>
        <dt>765.43</dt>
        <dd>@ 0.76543</dd>
      </dl>

      <CurrencyActions />
    </CurrencyCard>
  );
};

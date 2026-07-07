import Image from "next/image";
import { CurrencyActions } from "./CurrencyActions";

export const CompareCurreny = () => {
  return (
    <li>
      <Image src="/flags/de.webpg" alt="DRC flag" />
      <dl>
        <dt>GBP</dt>
        <dd>British Pound</dd>
      </dl>
      <dl>
        <dt>765.43</dt>
        <dd>@ 0.76543</dd>
      </dl>

      <CurrencyActions />
    </li>
  );
};

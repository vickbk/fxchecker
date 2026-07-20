import { getRate } from "@/infra/api/frankfurter";

export async function loadConversionRate(
  _: unknown,
  { from, to }: Record<"from" | "to", string>,
) {
  "use server";
  const { rate } = await getRate(from, to);
  return rate;
}

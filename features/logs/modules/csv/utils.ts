import { SelectLog } from "./types";

const header =
  "Timestamp,Base Currency,Quote Currency,Exchange Rate,Input Amount,Conversion Result";
export function exportLogsToCSV(logs: SelectLog[]) {
  try {
    const content = logs.map(
      ({ editTime, data: { base, quote, rate, amount } }) =>
        [
          editTime,
          base,
          quote,
          rate,
          amount,
          Number((rate * amount).toFixed(4)),
        ].join(","),
    );

    const csvContent = new Blob([`${header}\n${content.join("\n")}`], {
      type: "text/csv;charset=utf-8;",
    });

    const [dateStamp] = new Date().toISOString().split(".");

    return {
      url: URL.createObjectURL(csvContent),
      name: `conversion_history_${dateStamp}.csv`,
    };
  } catch (error) {
    console.error("Failed to export logs to CSV:", error);
    return null;
  }
}

export function handleCSVExport(logs: SelectLog[]) {
  const file = exportLogsToCSV(logs);
  if (!file || !document) return;
  const anchor = document.createElement("a");
  anchor.href = file.url;
  anchor.download = file.name;
  anchor.style.display = "none";
  document.body.appendChild(anchor);

  anchor.click();

  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(file.url), 1000);
}

import dayjs from "https://cdn.jsdelivr.net/npm/dayjs@1/+esm";

export function formatDate(date, format = "D MMM YYYY") {
  if (!date) return '';

  return dayjs(date).format(format);
}

export function installGlobally() {
  const functions = [formatDate];
  for (const func of functions) {
    window[func.name] = func;
  }
}

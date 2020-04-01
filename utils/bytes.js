const bytesFilter = (bytes = 0, precision = 2) => {
  if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return "-";
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const number = bytes === 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + " " + units[number];
};

export default bytesFilter

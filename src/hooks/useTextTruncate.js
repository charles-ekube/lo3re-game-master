const useTextTruncate = () => {
  function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
      return text;
    } else {
      return text.substring(0, maxLength) + "...";
    }
  }

  function truncateNumber(number) {
    if (isNaN(number)) {
      return number;
    }

    const suffixes = ["", "k", "M", "B", "T"]; // Add more if needed
    const suffixNum = Math.floor(("" + number).length / 3);
    let shortValue = parseFloat(
      (suffixNum !== 0
        ? number / Math.pow(1000, suffixNum)
        : number
      ).toPrecision(2)
    );
    if (shortValue % 1 !== 0) {
      shortValue = shortValue.toFixed(1);
    }
    return shortValue + suffixes[suffixNum] + (shortValue ? "+" : "");
  }

  function formatMoney(number) {
    return number?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") || number;
  }

  return {
    truncateText,
    truncateNumber,
    formatMoney,
  };
};

export default useTextTruncate;

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
    // Convert number to string
    const numberString = number?.toFixed(2)?.toString();

    if (numberString) {
      // Split the number into parts before and after the decimal point
      const [integerPart, decimalPart] = numberString.split(".");

      // Format the integer part with commas
      const formattedIntegerPart = integerPart.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ","
      );

      // Combine the formatted integer part and the decimal part (if any)
      return decimalPart
        ? `${formattedIntegerPart}.${decimalPart}`
        : formattedIntegerPart;
    }

    return numberString;
  }

  function ensureHttps(url) {
    if (!url.startsWith("https://")) {
      return "https://" + url;
    }
    return url;
  }

  return {
    truncateText,
    truncateNumber,
    formatMoney,
    ensureHttps,
  };
};

export default useTextTruncate;

import { useState } from "react";

const useCopyToClipBoard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const coptToClipboard = async (text) => {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  };

  const handleCopyClick = (text) => {
    coptToClipboard(text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return { handleCopyClick, isCopied };
};

export default useCopyToClipBoard;

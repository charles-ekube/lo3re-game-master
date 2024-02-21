import React, { useEffect, useState } from "react";
import BankIcon from "../../../assets/images/icons/bank.png";
import http from "../../../utils/utils";
import cardStyles from "../../../assets/styles/cardStyles.module.css";

function shortenText(text, maxLength) {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength - 1) + "...";
  }
  return text;
}

const BankCard = ({ beneficiary, type, onClick }) => {
  const [supportedBanks, setSupportedBanks] = useState([]);
  const [supportedCryptos, setSupportedCryptos] = useState([]);

  // TODO: call w/rtk query
  const fetchBanks = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-banks`);
      const newArray = res?.data.map((cur) => ({
        ...cur,
        value: cur.code,
      }));

      setSupportedBanks(newArray);
      // console.log("banks", res);
      //   setRequestLoading(false);
    } catch (error) {
      console.log("fetch bank err", error);
      //   setRequestLoading(false);
    }
  };

  const fetchCryptos = async () => {
    // setRequestLoading(true);
    try {
      const res = await http.get(`wallets/supported-coins`);
      const newArray = res.map((crypto) => ({
        ...crypto,
        value: crypto.id,
        name: crypto.name.toUpperCase(),
        icon: crypto.logo_url,
      }));

      setSupportedCryptos(newArray);
    } catch (error) {
      console.log("fetch bank err", error);
    }
  };

  useEffect(() => {
    if (type === "bank") {
      fetchBanks();
    } else {
      fetchCryptos();
    }
  }, [type]);

  const returnCoin = (coin_id) => {
    const coin = supportedCryptos.filter((val) => val.id === coin_id);
    if (coin.length) {
      return coin[0];
    }

    return null;
  };

  const returnBankName = (bank_code) => {
    const bank = supportedBanks.filter((val) => val?.code === bank_code);
    if (bank.length) {
      return bank[0]?.name;
    }

    return null;
  };

  const coinInfo = returnCoin(beneficiary?.coin_id);
  const title =
    shortenText(beneficiary?.title, 13) ||
    shortenText(beneficiary?.account_name, 13);
  const titleRaw = beneficiary?.title || beneficiary?.account_name;
  const subLabel =
    type === "bank"
      ? returnBankName(beneficiary?.bank_code) || "Account number"
      : coinInfo?.name;
  const subtitle =
    type === "bank"
      ? beneficiary?.account_number
      : beneficiary?.network + " network";
  const icon = coinInfo?.logo_url || BankIcon;

  return (
    <>
      <div
        className={`flexRow justifyBetween ${cardStyles.bankCard}`}
        onClick={onClick}
      >
        <div className="flexRow gap-1">
          <div className={cardStyles.icon}>
            <img src={icon} alt="" />
          </div>
          <div className="FlexColumn justifyCenter">
            <p className={cardStyles.title} title={titleRaw}>
              {title}
            </p>
            <p className={cardStyles.subtitle}>
              <>
                <small>{subLabel}:</small> {subtitle}
              </>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BankCard;

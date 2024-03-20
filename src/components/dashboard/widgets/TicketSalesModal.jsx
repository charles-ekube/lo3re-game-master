import React, { useState } from "react";
import useTextTruncate from "../../../hooks/useTextTruncate";
import Pagination from "../../../utils/Pagination";
import { DateTime } from "luxon";
import lotteryStyles from "../../../assets/styles/lotteries.module.css";
import Text from "../../../utils/CustomText";
import Avatar from "../../../utils/Avatar";
import Modal from "../../../utils/Modal";
import useCopyToClipBoard from "../../../hooks/useCopyToClipboard";
import { LuCopy } from "react-icons/lu";
import { AiOutlineCheck } from "react-icons/ai";
import { IoIosArrowRoundBack } from "react-icons/io";

const MODAL_STEP_1 = 1;
const MODAL_STEP_2 = 2;

const TicketSalesModal = ({ isOpen, onClose, tickets }) => {
  const { handleCopyClick, isCopied } = useCopyToClipBoard();
  const [modalStep, setModalStep] = useState(MODAL_STEP_1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(undefined);

  const renderModalStep = () => {
    if (modalStep === MODAL_STEP_1) {
      return (
        <>
          {tickets?.length ? (
            <>
              <div className={`${lotteryStyles.ticketList}`}>
                {tickets?.map((ticket) => (
                  <TicketRows
                    ticket={ticket}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setModalStep(MODAL_STEP_2);
                    }}
                  />
                ))}
              </div>
              <Pagination
                limit={1}
                curPage={currentPage}
                totalItems={2}
                paginate={(num) => setCurrentPage(num)}
              />
            </>
          ) : (
            <p className="text-muted" style={{ marginBottom: "25px" }}>
              No purchased tickets yet
            </p>
          )}
        </>
      );
    } else if (modalStep === MODAL_STEP_2 && selectedTicket) {
      let dt = DateTime.fromSeconds(selectedTicket?.createdAt?._seconds);
      dt = dt.toFormat("MMM dd, yyyy");

      const ticketSelections = JSON.parse(selectedTicket?.selection);

      const statusClass = () => {
        let txt = "textWarning";

        if (selectedTicket?.status?.toLowerCase() === "won") {
          txt = "textSuccess";
        } else if (selectedTicket?.status?.toLowerCase() === "lost") {
          txt = "textDanger";
        }

        return txt;
      };

      return (
        <div className={lotteryStyles.modalStep2}>
          <div className="flexRow" style={{ height: "34px" }}>
            <IoIosArrowRoundBack
              size={34}
              className={"cursor-pointer"}
              onClick={() => setModalStep(MODAL_STEP_1)}
              style={{ marginBottom: "16px" }}
            />
          </div>
          <div className="flexColumn alignCenter" style={{ gap: "8px" }}>
            <Avatar
              name={"R"}
              className={lotteryStyles.ticketSaleAvatar}
              boxSize={"70px"}
            />
            <Text
              className={`satoshi-text mediumText capitalize fs18`}
              style={{ color: "rgba(16, 16, 16, 1)" }}
            >
              Raynera
            </Text>
          </div>
          <div className={`${lotteryStyles.ticketInfoContainer}`}>
            <p className="text-muted">Selected numbers</p>
            <div className="flexColumn alignCenter">
              {ticketSelections?.map((selection) => (
                <div className={`${lotteryStyles.luckyNumContainer}`}>
                  {selection?.map((num) => (
                    <span className={`${lotteryStyles.luckyNum}`}>{num}</span>
                  ))}
                </div>
              ))}
            </div>
            <div>
              <div
                className={`flexRow justifyBetween ${lotteryStyles.modalItemRow}`}
              >
                <p className="text-muted">Ticket No</p>
                <div className="flexRow alignCenter gap-1">
                  <p className="text-muted">{selectedTicket?.id}</p>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => handleCopyClick(selectedTicket?.id)}
                  >
                    {isCopied ? <AiOutlineCheck color="green" /> : <LuCopy />}
                  </div>
                </div>
              </div>
              <div
                className={`flexRow justifyBetween text-muted ${lotteryStyles.modalItemRow}`}
              >
                <p>Purchase date</p>
                <p className={"capitalize"}>{dt}</p>
              </div>
              <div
                className={`flexRow justifyBetween text-muted ${lotteryStyles.modalItemRow}`}
              >
                <p>Status</p>
                <p className={`${statusClass()} upper`}>
                  {selectedTicket?.status}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <Modal
      title={"Ticket sales"}
      isOpen={isOpen}
      onClose={onClose}
      modalClass={lotteryStyles.ticketSalesModal}
    >
      {renderModalStep()}
    </Modal>
  );
};

const TicketRows = ({ ticket, onClick }) => {
  const { truncateText } = useTextTruncate();
  let dt = DateTime.fromSeconds(ticket?.createdAt?._seconds);
  dt = dt.toFormat("MMM dd, yyyy");

  const statusClass = () => {
    let txt = "textWarning";

    if (ticket?.status?.toLowerCase() === "won") {
      txt = "textSuccess";
    } else if (ticket?.status?.toLowerCase() === "lost") {
      txt = "textDanger";
    }

    return txt;
  };

  return (
    <div
      className={`flexRow justifyBetween alignCenter ${lotteryStyles.ticketRow}`}
      onClick={onClick}
    >
      <div className="flexRow alignCenter" style={{ gap: "8px" }}>
        <Avatar
          name={"R"}
          className={lotteryStyles.ticketSaleAvatar}
          boxSize={"48px"}
        />
        <Text
          className={`satoshi-text mediumText capitalize ${lotteryStyles.modalTextResp}`}
          style={{ color: "rgba(16, 16, 16, 1)" }}
        >
          Raynera
        </Text>
      </div>
      <div>
        <div
          className={`mediumText ${lotteryStyles.modalTextResp} ${lotteryStyles.statusPill} ${lotteryStyles.ticketIdPill}`}
        >
          #{truncateText(ticket?.id, 8)}
        </div>
      </div>
      <div
        className={`flexColumn textRight ${lotteryStyles.modalTextResp}`}
        style={{ color: "#A6A6A6", gap: "4px" }}
      >
        <p className={`${statusClass()} upper`}>{ticket?.status}</p>
        <p className="mediumText">{dt}</p>
      </div>
    </div>
  );
};

export default TicketSalesModal;

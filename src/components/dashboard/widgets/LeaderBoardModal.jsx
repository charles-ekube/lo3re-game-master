import React, { useState } from "react";
import useTextTruncate from "../../../hooks/useTextTruncate";
import Pagination from "../../../utils/Pagination";
import { DateTime } from "luxon";
import lotteryStyles from "../../../assets/styles/lotteries.module.css";
// import Text from "../../../utils/CustomText";
import Avatar from "../../../utils/Avatar";
import Modal from "../../../utils/Modal";
// import useCopyToClipBoard from "../../../hooks/useCopyToClipboard";
// import { LuCopy } from "react-icons/lu";
// import { AiOutlineCheck } from "react-icons/ai";
// import { IoIosArrowRoundBack } from "react-icons/io";
import { useFetchProfileQuery } from "../../../redux/services/accountApi";

// const MODAL_STEP_1 = 1;
// const MODAL_STEP_2 = 2;

const LeaderBoardModal = ({ isOpen, onClose, items }) => {
  // const { handleCopyClick, isCopied } = useCopyToClipBoard();
  // const [modalStep, setModalStep] = useState(MODAL_STEP_1);
  const { formatMoney } = useTextTruncate();
  const [currentPage, setCurrentPage] = useState(1);
  // const [selectedTicket, setSelectedTicket] = useState(undefined);
  const { data: user } = useFetchProfileQuery();

  return (
    <Modal
      title={"Leaderboard"}
      isOpen={isOpen}
      onClose={onClose}
      modalClass={lotteryStyles.ticketSalesModal}
    >
      <>
        <div className={lotteryStyles.leaderboardContainer}>
          <div className={`${lotteryStyles.tableResponsive} hScroll`}>
            <table>
              <thead>
                <tr>
                  <td style={{ textAlign: "left" }}>Player name</td>
                  <td>Rank</td>
                  <td>Lottery no</td>
                  <td>Jackpot win</td>
                  <td></td>
                </tr>
              </thead>
              <tbody>
                {items?.map((val, idx) => {
                  let date = DateTime.fromSeconds(
                    val?.ticket?.createdAt?._seconds
                  );
                  date = date.toRelativeCalendar();

                  const results = val?.results;
                  const selections = results?.length
                    ? results[0]?.selection
                    : [];

                  return (
                    <tr
                      className={`${
                        val?.profile?.userId === user?.id
                          ? lotteryStyles.activeUser
                          : ""
                      }`}
                      key={`ld-${idx}`}
                    >
                      <td>
                        <div className={`flexRow alignCenter`}>
                          <Avatar
                            fontSize="20px"
                            name={val?.profile?.username}
                            className={lotteryStyles.tableAvatar}
                            onlyFirstLetter={true}
                            src={val?.profile?.photoUrl}
                            boxSize={"40px"}
                          />
                          <div>
                            <p className={lotteryStyles.leaderName}>
                              {val?.profile?.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{val?.friendlyRank}</td>
                      <td>
                        <p className={lotteryStyles.leaderLottoNumber}>
                          {selections?.map((num) => num + " ")}
                        </p>
                      </td>
                      <td>${formatMoney(val?.prizeAmount)}</td>
                      <td>{date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!items?.length ? (
              <div
                className="flexColumn justifyCenter alignCenter text-muted textCenter fs14"
                style={{ height: "120px" }}
              >
                Leaderboard is currently empty.
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <Pagination
          limit={1}
          curPage={currentPage}
          totalItems={2}
          paginate={(num) => setCurrentPage(num)}
          colorScheme={"dark"}
        />
      </>
    </Modal>
  );
};

export default LeaderBoardModal;

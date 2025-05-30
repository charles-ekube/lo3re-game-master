import React, { useState } from "react";
import NotificationStyles from "../../assets/styles/notification.module.css";
import TimelineItem from "../../components/dashboard/widgets/TimelineItem";
import ChatIcon from "../../assets/images/icons/messages-2.png";
import Pagination from "../../utils/Pagination";

export const Notification = () => {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      <section className="mainContainer no-aside">
        <div className={`mainContent`}>
          <div>
            <div className="flexRow justifyBetween">
              <h3>Notifications</h3>
            </div>
            <div>
              <h3 className={NotificationStyles.dateHeader}>August, 2024</h3>
              <div className={NotificationStyles.timeline}>
                <div
                  className={`${NotificationStyles.event} ${NotificationStyles.left}`}
                >
                  <div className={NotificationStyles.eventDate}>August 27</div>
                  <TimelineItem amount={30.0} title="deposit" />
                  <TimelineItem
                    title="Jackpot 1/Group"
                    subtitle={"Text preview goes..."}
                    img={ChatIcon}
                  />
                </div>

                <div
                  className={`${NotificationStyles.event} ${NotificationStyles.right}`}
                >
                  <div className={NotificationStyles.eventDate}>August 28</div>
                  <TimelineItem
                    title="Raynera"
                    subtitle={"Text preview goes..."}
                  />
                </div>
                <div
                  className={`${NotificationStyles.event} ${NotificationStyles.left}`}
                >
                  <div className={NotificationStyles.eventDate}>August 29</div>
                  <TimelineItem amount={30.0} title="withdraw" />
                </div>
                <div
                  className={`${NotificationStyles.event} ${NotificationStyles.right}`}
                >
                  <div className={NotificationStyles.eventDate}>August 30</div>
                  <TimelineItem amount={30.0} title="deposit" />
                </div>
                <div
                  className={`${NotificationStyles.event} ${NotificationStyles.left}`}
                >
                  <div className={NotificationStyles.eventDate}>August 31</div>
                  <TimelineItem
                    title="Jackpot 1/Group"
                    subtitle={"Text preview goes..."}
                    img={ChatIcon}
                  />
                </div>
              </div>

              <Pagination
                limit={1}
                curPage={currentPage}
                totalItems={3}
                paginate={(num) => setCurrentPage(num)}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

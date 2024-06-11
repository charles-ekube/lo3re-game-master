import React, { useEffect, useState } from "react";
import { CiBellOn, CiSearch } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import { FiMenu } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";
import {
  onValue,
  ref,
  query,
  orderByKey,
  limitToLast,
  // update,
  // onChildAdded,
  // endAt,
} from "firebase/database";
import { database } from "../../../firebase";
import { useFetchProfileQuery } from "../../../redux/services/accountApi";
import { toggleSidebar } from "../../../redux/features/generalSlice";
import Text from "../../../utils/CustomText";
import Avatar from "../../../utils/Avatar";
import NotificationItem from "./NotificationItem";
import useTextTruncate from "../../../hooks/useTextTruncate";
import { showError } from "../../../utils/Alert";

const TopNav = () => {
  const [notifications, setNotifications] = useState([]);
  const { truncateText } = useTextTruncate();
  // const [totalUnRead, setTotalUnRead] = useState(0);
  const [isScreenWidth1150, setIsScreenWidth1150] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const showSidebar = useSelector((state) => state.general.showSidebar);
  const { data: user } = useFetchProfileQuery();
  const dispatch = useDispatch();

  const handleResize = () => {
    if (window.innerWidth < 1150) {
      setIsScreenWidth1150(true);
    } else {
      setIsScreenWidth1150(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
  }, []);

  // fetch messages
  useEffect(() => {
    const notifRef = ref(database, `notifications/${user?.uid}/messages`);
    const notifQuery = query(notifRef, orderByKey(), limitToLast(10)); // Limiting to last 10

    const unsubscribe = onValue(
      notifQuery,
      (snapshot) => {
        if (snapshot.exists()) {
          const notificationData = snapshot.val();
          const filteredTransactions = Object.keys(notificationData)
            .map((key) => {
              const { subject, body, topic, timestamp, message } =
                notificationData[key] || {};
              return {
                id: key,
                title: subject,
                body,
                message,
                type: topic,
                time: timestamp, // Convert time to Date object
              };
            })
            .sort((a, b) => {
              if (!a.time && !b.time) return 0;
              if (!a.time) return 1;
              if (!b.time) return -1;

              const dateA = new Date(a.time);
              const dateB = new Date(b.time);

              return dateB - dateA;
            });
          setNotifications(filteredTransactions);
          console.log("notif", filteredTransactions);
        } else {
          console.log("no notif");
        }
      },
      (error) => {
        console.error(error);
        showError("Could not fetch notifications");
      }
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <nav className="topNavContainer">
        <section className="flexRow gap-1 w-70 alignCenter">
          <div>
            {isScreenWidth1150 && (
              <button
                onClick={() => dispatch(toggleSidebar(!showSidebar))}
                className={"btn btn-dark"}
              >
                <FiMenu />
              </button>
            )}
          </div>
          <div className="topNavSearchContainer">
            <CiSearch size={22} />
            <input placeholder="Search everything" />
          </div>
        </section>
        <section className={"topNavUserContainer"}>
          <div className="flexRow alignCenter" style={{ gap: "5px" }}>
            <Avatar
              name={user?.name ? user?.name : "User"}
              src={user?.picture}
            />
            <Text
              className={"satoshi-text f14 capitalize d-none-md"}
              style={{ color: "rgba(16, 16, 16, 1)" }}
            >
              {user?.name ? user?.name : "User"}
            </Text>
          </div>
          <div className="bell-icon" onClick={() => setShowNotification(true)}>
            <CiBellOn />
          </div>
        </section>
      </nav>

      {showNotification ? (
        <>
          <div className={`notification-dropdown`}>
            <div className="flexRow justifyBetween alignCenter">
              <h3 className="header-title">Notifications</h3>
              <FaTimes
                size={16}
                className="textDanger cursor-pointer"
                onClick={() => setShowNotification(false)}
              />
            </div>
            <div className="content">
              {!notifications?.length && (
                <p
                  className="textMuted textCenter"
                  style={{ marginBlock: "30px" }}
                >
                  You have no new notification
                </p>
              )}
              {notifications?.map((notification) => (
                <NotificationItem
                  title={truncateText(notification?.message, 35)}
                  date={notification?.time}
                />
              ))}
            </div>
          </div>
          <div
            className="notification-overlay"
            onClick={() => setShowNotification(false)}
          ></div>
        </>
      ) : (
        ""
      )}
    </>
  );
};;

export default TopNav;

import React, { useEffect, useRef } from "react";
import {
  getChatroom,
  setCurrentMessage,
  setUsername,
} from "../redux/reducers/messageSlice";
import { setHasNew, setIsOpen } from "../redux/reducers/notificationSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

const dateFormatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

type NotificationType = {
  _id: string;
  content: string;
  timestamp: string;
  username: string;
  chatuser: string;
};

function NotificationList() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector(
    (state) => state.notification.notification
  );
  const username = useAppSelector((state) => state.user.userInfo?.username);
  const listRef = useRef<HTMLDivElement>(null);

  const handleGetChatroom = async (chatname: string) => {
    if (username && username !== chatname) {
      dispatch(setUsername(chatname));
      dispatch(setCurrentMessage([]));
      dispatch(getChatroom([username, chatname]));
    }
  };

  useEffect(() => {
    dispatch(setHasNew(false));
    dispatch(setIsOpen(true));

    const closeNitification = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(".notification-button")) {
        return;
      }

      if (
        listRef!.current &&
        !listRef.current.contains(e.target as HTMLDivElement)
      ) {
        dispatch(setIsOpen(false));
      }
    };

    document.addEventListener("mousedown", closeNitification);

    return () => document.removeEventListener("mousedown", closeNitification);
  }, []);

  return (
    <div
      ref={listRef}
      className='bg-white w-72 h-60 absolute z-50 top-11 -left-48 rounded-md overflow-y-scroll shadow-xl border cursor-default flex-col'>
      {notification.map((item: NotificationType) => (
        <div
          key={item._id}
          className='w-full h-12 border-b border-b-blue-200 flex flex-col px-4 cursor-pointer'
          onClick={() =>
            handleGetChatroom(
              username === item.username ? item.chatuser : item.username
            )
          }>
          <div
            title={username === item.username ? item.chatuser : item.username}
            className='flex justify-between w-full'>
            <p className='text-blue-500 truncate'>
              {username === item.username ? item.chatuser : item.username}
            </p>
            <p
              className='text-xs whitespace-nowrap'
              title={`${dateFormatter.format(new Date(item.timestamp))}`}>
              {dateFormatter.format(new Date(item.timestamp))}
            </p>
          </div>
          <p
            className='truncate flex-shrink text-sm'
            title={JSON.parse(item.content).content}>
            {username === JSON.parse(item.content).send && (
              <span className='text-gray-400'>You : </span>
            )}
            {JSON.parse(item.content).content}
          </p>
        </div>
      ))}
    </div>
  );
}

export default NotificationList;

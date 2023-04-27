import React, { useEffect, useRef } from "react";
import { setIsOpen } from "../redux/reducers/notificationSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";

function NotificationList() {
  const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.notification);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeNitification = (e: MouseEvent) => {
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
      className='bg-white w-60 h-60 absolute z-50 top-11 -left-48 rounded-md overflow-y-scroll shadow-xl border cursor-default'></div>
  );
}

export default NotificationList;

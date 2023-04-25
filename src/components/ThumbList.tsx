import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { setCurrentThumb } from "../redux/reducers/articleSlice";
import { selectUser } from "../redux/reducers/userSlice";
import {
  getChatroom,
  setCurrentMessage,
  setUsername,
} from "../redux/reducers/messageSlice";

function ThumbList({ item }: any) {
  const thumbListRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  const closeFn = (e: MouseEvent) => {
    if (
      thumbListRef!.current &&
      !thumbListRef.current.contains(e.target as HTMLDivElement)
    ) {
      dispatch(setCurrentThumb(false));
    }
  };

  const handleGetChatroom = async (chatname: string) => {
    const myName = user.userInfo?.username!;

    if (myName !== chatname) {
      dispatch(setUsername(chatname));
      dispatch(setCurrentMessage([]));
      dispatch(getChatroom([myName, chatname]));
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeFn);

    return () => document.removeEventListener("mousedown", closeFn);
  }, []);

  return (
    <div
      ref={thumbListRef}
      className='absolute right-4 bottom-6 z-50 border py-2 bg-white shadow-xl h-40 overflow-y-scroll w-28 cursor-default'>
      {item.like.map((i: string) => (
        <p
          className='truncate px-2 hover:bg-blue-200 hover:text-blue-800 cursor-pointer'
          key={i}
          title={i}
          onClick={() => handleGetChatroom(i)}>
          {i}
        </p>
      ))}
    </div>
  );
}

export default ThumbList;

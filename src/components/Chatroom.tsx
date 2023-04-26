import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  createChatMessage,
  getChatroom,
  setCurrentMessage,
  setReset,
} from "../redux/reducers/messageSlice";
import { selectUser } from "../redux/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { socket } from "../socket";

const formatter = new Intl.DateTimeFormat("zh-TW", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function Chatroom() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState<any[]>([]);
  const message = useAppSelector((state) => state.message);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const dialogRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isExpand, setIsExpand] = useState(true);
  const chatroomComponentRef = useRef<HTMLDivElement>(null);
  const leftChatTriangle =
    "h-3 w-3 border-t-6 border-r-6 border-b-0 border-l-6 transform rotate-45 bg-orange-200 relative top-6 -left-1 z-0";
  const leftChatStyle =
    "inline-flex whitespace-pre-line break-all p-2 pl-3 rounded-md bg-orange-200 text-sm mr-8 relative";
  const rightChatStyle =
    "inline-flex whitespace-pre-line break-all p-2 pl-3 rounded-md bg-green-200 text-sm ml-8 relative";

  function closeIsExpand(e: MouseEvent) {
    if (!chatroomComponentRef.current?.contains(e.target as HTMLDivElement)) {
      setIsExpand(false);
    }
  }

  // const onChatMessage = useCallback(
  //   (value: any) => onChatMessageFn(value),
  //   [message.currentMessage]
  // );

  function onChatMessage(value: any) {
    const newMessage = JSON.parse(value);

    if (user.userInfo?.username !== newMessage.username) {
      dispatch(
        setCurrentMessage([...message.currentMessage, { ...newMessage }])
      );
    }
  }

  async function sendMessage(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter") {
      if (!e.shiftKey) {
        e.preventDefault();

        const content = textRef.current?.value.trim();

        if (content) {
          dispatch(createChatMessage(user.userInfo?.username!, content));
          setTimeout(() => {
            dialogRef.current?.scrollTo(0, dialogRef.current?.scrollHeight);
          }, 0);
          textRef.current!.value = "";
        }
      }
    }
  }

  useEffect(() => {
    if (message.chatuser.length > 1) {
      dispatch(getChatroom(message.chatuser));
    }
  }, []);

  useEffect(() => {
    socket.on("chatMessage", onChatMessage);

    return () => {
      socket.off("chatMessage", onChatMessage);
    };
  }, [message.currentMessage]);

  useEffect(() => {
    if (isExpand) {
      setTimeout(() => {
        dialogRef.current?.scrollTo(0, dialogRef.current?.scrollHeight);
      }, 0);
    }
  }, [isExpand, message.currentMessage]);

  return (
    <div
      ref={chatroomComponentRef}
      className='fixed right-0 bottom-0 w-72 z-50 lg:w-80 flex flex-col shadow-xl'>
      <img
        title='關閉聊天室'
        className='absolute top-1 z-50 w-6 right-2 cursor-pointer hover:bg-red-700'
        src='/src/assets/close.svg'
        onClick={() => {
          dispatch(setReset(""));
          localStorage.removeItem("potterSiteChatInfo");
        }}
      />
      <div
        onClick={() => setIsExpand((prev) => !prev)}
        className='bg-gray-400 w-full py-1 px-2 text-white textce cursor-pointer rounded-sm hover:bg-gray-500 active:bg-gray-400'>
        <p className='select-none truncate'>{message.username}</p>
      </div>
      {isExpand && (
        <div
          className='relative w-full h-60 border overflow-y-scroll bg-blue-300 py-2 px-4'
          ref={dialogRef}>
          {message.isLoading && (
            <img
              className='absolute flex w-24 top-0 left-0 right-0 bottom-0 h-24 z-50 m-auto animate-spin'
              src='/src/assets/reload.svg'
            />
          )}
          {message.currentMessage.map((item) => {
            return item.username !== message.username ? (
              <div
                key={`${item._id}`}
                className='dialog-item dialog-item__myself'>
                <p className={rightChatStyle}>
                  <span className='absolute -left-8 bottom-1 text-xs text-gray-500'>
                    {item.upload === 2 && (
                      <img
                        className='absolute w-3 -left-5 top-0'
                        src='/src/assets/upload-arrow.svg'
                      />
                    )}
                    {item.upload === undefined ? (
                      formatter.format(new Date(item.timestamp))
                    ) : item.upload === 2 ? (
                      <span className='relative -left-2'>上傳中</span>
                    ) : item.upload === 0 ? (
                      "失敗"
                    ) : (
                      formatter.format(new Date(item.timestamp))
                    )}
                  </span>
                  {item.content}
                </p>
              </div>
            ) : (
              <div key={item._id} className='dialog-item'>
                <div className={leftChatTriangle}></div>
                <p className={leftChatStyle}>
                  <span className='absolute -right-8 bottom-1 text-xs text-gray-500'>
                    {formatter.format(new Date(item.timestamp))}
                  </span>
                  {item.content}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {isExpand && (
        <textarea
          ref={textRef}
          className='border focus:outline-none px-2 py-1 text-sm resize-none'
          onKeyDown={sendMessage}
        />
      )}
    </div>
  );
}

export default Chatroom;

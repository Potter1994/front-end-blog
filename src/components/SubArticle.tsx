import React, { useEffect, useRef, useState } from "react";
import {
  deleteSubArtice,
  getSubArticles,
  updateSubArticle,
} from "../redux/reducers/articleSlice";
import {
  getChatroom,
  setCurrentMessage,
  setUsername,
} from "../redux/reducers/messageSlice";
import { selectUser } from "../redux/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
const formatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function SubArticle({ subArticle }: any) {
  const currentUsername = subArticle.user?.username;
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [isUpdate, setIsUpdate] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleUpdate = () => {
    const text = textRef.current!.value;
    const { articleId } = subArticle;

    if (!text.trim()) return;

    if (subArticle.text === text) {
      return setIsUpdate(false);
    }

    dispatch(updateSubArticle(articleId, text));
    setIsUpdate(false);
  };

  const handleDelete = () => {
    const articleId = location.pathname.replace("/article/", "");
    const subId = subArticle.articleId;
    dispatch(deleteSubArtice(subId, articleId));
  };

  const handleGetChatroom = async (chatname: string) => {
    const myName = user.userInfo?.username!;

    if (myName !== chatname) {
      dispatch(setUsername(chatname));
      dispatch(setCurrentMessage([]));
      dispatch(getChatroom([myName, chatname]));
    }
  };

  return (
    <>
      <div className='article-popup-dialog'>
        <div className='article-popup-dialog__item'>
          <div className='article-popup-dialog__userinfo'>
            <p
              className='article-popup-dialog__name truncate cursor-pointer'
              onClick={() => handleGetChatroom(subArticle?.user?.username)}>
              {subArticle?.user?.username}
            </p>
            <p className='article-popup-dialog__date'>
              {formatter.format(new Date(subArticle.create_time || null))}
            </p>
            {user.userInfo?.username === currentUsername ? (
              isUpdate ? (
                <div className='button-area-sub'>
                  <button
                    className='button button__sub button__complete'
                    onClick={handleUpdate}>
                    Complete
                  </button>
                  <button
                    className='button button__sub button__delete'
                    onClick={() => setIsUpdate(false)}>
                    Cancel
                  </button>
                </div>
              ) : (
                <div className='button-area-sub'>
                  <button
                    className='button button__sub'
                    onClick={() => setIsUpdate(true)}>
                    Update
                  </button>
                  <button
                    className='button button__sub button__delete'
                    onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              )
            ) : (
              <></>
            )}
          </div>

          {isUpdate ? (
            <textarea
              className='article-popup-dialog__message default__textarea'
              defaultValue={subArticle.text}
              ref={textRef}
            />
          ) : (
            <div className='article-popup-dialog__message'>
              {subArticle.text}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SubArticle;

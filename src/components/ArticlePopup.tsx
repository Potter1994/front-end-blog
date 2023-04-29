import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createSubArticle,
  deleteArtice,
  getSubArticles,
  setCurrentPopupThumb,
  updateArticle,
  updateThumb,
} from "../redux/reducers/articleSlice";
import {
  getChatroom,
  setCurrentMessage,
  setUsername,
} from "../redux/reducers/messageSlice";
import { selectUser } from "../redux/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Loading from "./Loading";
import SubArticle from "./SubArticle";
import ThumbList from "./ThumbList";
const formatter = new Intl.DateTimeFormat("zh-TW", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function ArticlePopup() {
  const article = useAppSelector((state) => state.article);
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const subTextRef = useRef<HTMLTextAreaElement>(null);
  const [isUpdate, setIsUpdate] = useState(false);
  const id = location.pathname.replace("/article/", "");
  const urlArticleId = Number(location.pathname.replace("/article/", ""));
  console.log(urlArticleId);
  const currentArticle = article.articles.find(
    (i) => i.articleId === urlArticleId
  );
  const subArticleArray = article.subArticles;

  const leaveMessage = async () => {
    const text = subTextRef.current!.value;

    if (!text.trim()) {
      return;
    }

    await dispatch(createSubArticle(text, id));
    subTextRef.current!.value = "";
  };

  const closePopup = (e: React.MouseEvent<EventTarget>) => {
    if (article.isLoading) return;

    !(e.target as HTMLDivElement).closest(".article-popup__wrapper") &&
      navigate(`/?page=${article.currentPage}`);
  };

  const handleDelete = async (id: string) => {
    const page =
      article.articles.length <= 1
        ? article.currentPage - 1
        : article.currentPage;

    await dispatch(deleteArtice(id, `${page}`, article.sortType));
    navigate(`/?page=${page}`);
  };

  const handleUpdate = async () => {
    const newTitle = titleRef.current?.value!;
    const newText = textRef.current?.value!;

    if (!newTitle?.trim() || !newText?.trim()) {
      return;
    }

    if (currentArticle.title !== newTitle || currentArticle.text !== newText) {
      dispatch(updateArticle(id, newTitle, newText));
    }

    setIsUpdate(false);
  };

  const handleToggleThumb = () => {
    dispatch(updateThumb(`${urlArticleId}`, user.userInfo?.username || ""));
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
    dispatch(getSubArticles(id));
  }, []);

  return (
    <div className='article-popup' onClick={(e) => closePopup(e)}>
      {article.isLoading && <Loading />}
      <div className='article-popup__wrapper relative'>
        <div
          className='close-icon absolute w-6 top-6 right-6 cursor-pointer hover:opacity-40 active:opacity-100'
          onClick={() => navigate(`/?page=${article.currentPage}`)}>
          <img src='/src/assets/close.svg' />
        </div>
        <div className='article-popup__userinfo'>
          <p
            className='article-popup__name cursor-pointer'
            onClick={() => handleGetChatroom(currentArticle?.user?.username)}>
            {currentArticle?.user?.username}
          </p>
          <p className='article-popup__date'>
            {formatter.format(new Date(currentArticle?.create_time || null))}
          </p>
        </div>
        {user.userInfo?.username === currentArticle?.user?.username ? (
          isUpdate ? (
            <div className='button-area mb-2'>
              <button
                className='article__button button__complete'
                onClick={handleUpdate}>
                Complete
              </button>
              <button
                className='article__button button__cancel'
                onClick={() => setIsUpdate(false)}>
                Cancel
              </button>
            </div>
          ) : (
            <div className='button-area'>
              <button className='button' onClick={() => setIsUpdate(true)}>
                Update
              </button>
              <button
                className='button button__delete'
                onClick={() => handleDelete(currentArticle?.articleId)}>
                Delete
              </button>
            </div>
          )
        ) : (
          <></>
        )}

        {isUpdate ? (
          <div className='article-popup__container'>
            <input
              className='default__input'
              defaultValue={currentArticle?.title}
              ref={titleRef}
            />
            <textarea
              className='default__textarea'
              defaultValue={currentArticle?.text}
              ref={textRef}
            />
          </div>
        ) : (
          <div className='article-popup__container'>
            <p className='article-popup__title' title={currentArticle?.title}>
              {currentArticle?.title}
            </p>
            <p className='article-popup__text' title={currentArticle?.text}>
              {currentArticle?.text}
            </p>
          </div>
        )}
        <div className='article-popup-bottom'>
          <div className='article-popup-bottom__wrapper relative'>
            <i
              className='article-popup-bottom__svg'
              onClick={handleToggleThumb}>
              <img
                src={`/src/assets/thumb-up${
                  currentArticle?.like?.includes(user.userInfo?.username)
                    ? "-clicked"
                    : ""
                }.svg`}
              />
            </i>
            {currentArticle &&
              currentArticle.articleId === article.currentPopupThumb && (
                <div className='absolute bottom-0 translate-y-48'>
                  <ThumbList item={currentArticle} />
                </div>
              )}
            <p
              className='article-popup-bottom__text cursor-pointer'
              onClick={() =>
                dispatch(setCurrentPopupThumb(currentArticle.articleId))
              }>
              {currentArticle?.like?.length || 0}
            </p>
            <i className='article-popup-bottom__svg'>
              <img src='/src/assets/message.svg' />
            </i>
            <p className='article-popup-bottom__text'>
              {currentArticle?.comment || 0}
            </p>
          </div>
          <div className='article-popup-message'>
            <textarea
              className='article-popup-message__textarea'
              placeholder='Leave Message ...'
              ref={subTextRef}></textarea>
            <button className='button' onClick={leaveMessage}>
              留言
            </button>
          </div>
          {subArticleArray.length > 0 && (
            <div className='article-popup-dialog'>
              {subArticleArray.map((subArticle) => (
                <SubArticle
                  key={subArticle.articleId}
                  subArticle={subArticle}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticlePopup;

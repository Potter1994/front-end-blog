import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createSubArticle,
  getSubArticles,
} from "../redux/reducers/articleSlice";
import { selectUser } from "../redux/reducers/userSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Loading from "./Loading";
import SubArticle from "./SubArticle";
// import {  } from '../redux/reducers/articleSlice';
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
  const updateArticle = [];
  const subTextRef = useRef<HTMLTextAreaElement>(null);
  const id = location.pathname.replace("/article/", "");
  const urlArticleId = Number(location.pathname.replace("/article/", ""));
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
      navigate("/");
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
          onClick={() => navigate("/")}>
          <img src='/src/assets/close.svg' />
        </div>
        <div className='article-popup__userinfo'>
          <p className='article-popup__name'>
            {currentArticle?.user?.username}
          </p>
          <p className='article-popup__date'>
            {formatter.format(new Date(currentArticle?.create_time || null))}
          </p>
        </div>
        <div className='article-popup__container'>
          <p className='article-popup__title'>{currentArticle?.title}</p>
          <p className='article-popup__text'>{currentArticle?.text}</p>
        </div>
        <div className='article-popup-bottom'>
          <div className='article-popup-bottom__wrapper'>
            <i className='article-popup-bottom__svg'>
              <img src='/src/assets/thumb-up.svg' />
            </i>
            <p className='article-popup-bottom__text'>
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

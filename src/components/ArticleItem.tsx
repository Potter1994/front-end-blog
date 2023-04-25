import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  deleteArtice,
  setCurrentThumb,
  updateArticle,
  updateThumb,
} from "../redux/reducers/articleSlice";
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

function ArticleItem({ item, userInfo }: any) {
  const [isUpdate, setIsUpdate] = useState(false);
  const { username } = userInfo || { username: null };
  const article = useAppSelector((state) => state.article);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const { articleId } = item;

  const handleClick = (e: React.MouseEvent<EventTarget>, id: number) => {
    if (isUpdate) {
      return;
    }

    const classNameArray = [".article-button-area", ".article-info__wrapper"];
    const isNeedReturn = classNameArray.some((className) =>
      (e.target as HTMLElement).closest(className)
    );

    if (isNeedReturn) return;

    navigate(`/article/${id}?page=${article.currentPage}`);
  };

  const handleDelete = async (id: string) => {
    const page =
      article.articles.length <= 1
        ? article.currentPage - 1
        : article.currentPage;

    await dispatch(deleteArtice(id, `${page}`, article.sortType));

    if (page !== article.currentPage) {
      navigate(`/?page=${page}`);
    }
  };

  const handleUpdate = async () => {
    const newTitle = titleRef.current?.value!;
    const newText = textRef.current?.value!;

    if (!newTitle?.trim() || !newText?.trim()) {
      return;
    }

    if (item.title !== newTitle || item.text !== newText) {
      dispatch(updateArticle(articleId, newTitle, newText));
    }

    setIsUpdate(false);
  };

  const handleToggleThumb = async () => {
    dispatch(updateThumb(articleId, username));
  };

  const clickThumbList = () => {
    const currentThumb =
      article.currentThumb === item.articleId ? null : item.articleId;

    dispatch(setCurrentThumb(Number(currentThumb)));
  };

  return (
    <div
      className={`article-item${isUpdate ? " default-click" : ""}`}
      onClick={(e) => handleClick(e, item.articleId)}>
      <div className='article-item-info'>
        <p className='article-item__name' title={item.user.username}>
          {item.user.username}
        </p>
        <p
          className='article-item__date'
          title={formatter.format(new Date(item.create_time))}>
          {formatter.format(new Date(item.create_time))}
        </p>
        {item.user?.username === username ? (
          isUpdate ? (
            <div className='article-button-area'>
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
            <div className='article-button-area'>
              <button
                className='article__button'
                onClick={() => setIsUpdate((prev) => !prev)}>
                Update
              </button>
              <button
                className='article__button button__cancel'
                onClick={() => handleDelete(item.articleId)}>
                Delete
              </button>
            </div>
          )
        ) : (
          <></>
        )}
      </div>

      {isUpdate ? (
        <div className='default'>
          <input
            className='default__input'
            defaultValue={item.title}
            ref={titleRef}
          />
          <textarea
            className='default__textarea'
            defaultValue={item.text}
            ref={textRef}></textarea>
        </div>
      ) : (
        <div className='article-item-content'>
          <p className='article-item-content__title' title={item.title}>
            {item.title}
          </p>
          <p className='article-item-content__content' title={item.text}>
            {item.text}
          </p>
        </div>
      )}

      <div className='article-info relative'>
        <div className='article-info__wrapper'>
          <i className='article__svg' onClick={handleToggleThumb}>
            <img
              src={`/src/assets/thumb-up${
                item.like.includes(username) ? "-clicked" : ""
              }.svg`}
            />
          </i>
          <p
            className='article-info__text article-info__text_pointer'
            onClick={clickThumbList}>
            {item.like.length}
          </p>
          {article.currentThumb === item.articleId && <ThumbList item={item} />}
        </div>
        <div className='article-info__wrapper'>
          <i className='article__svg article__svg_default'>
            <img src='/src/assets/message.svg' />
          </i>
          <p className='article-info__text cursor-pointer'>{item.comment}</p>
        </div>
      </div>
    </div>
  );
}

export default ArticleItem;

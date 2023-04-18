import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { deleteArtice } from "../redux/reducers/articleSlice";
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
  const { username } = userInfo || { username: null };
  const article = useAppSelector((state) => state.article);
  const [isUpdate, setIsUpdate] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const handleClick = (e: React.MouseEvent<EventTarget>, id: number) => {
    if (isUpdate) {
      return;
    }

    const classNameArray = [".article-button-area", ".article-info__wrapper"];
    const isNeedReturn = classNameArray.some((className) =>
      (e.target as HTMLElement).closest(className)
    );

    if (isNeedReturn) return;

    navigate(`/article/${id}`);
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
    // console.log()
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
        {item.user.username === username && (
          <div className='article-button-area'>
            <button
              className='article__button'
              onClick={() => setIsUpdate((prev) => !prev)}>
              Update
            </button>
            <button
              className='article__button'
              onClick={() => handleDelete(item.articleId)}>
              Delete
            </button>
          </div>
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
          <p className='article-item-content__title'>{item.title}</p>
          <p className='article-item-content__content'>{item.text}</p>
        </div>
      )}

      <div className='article-info'>
        <div className='article-info__wrapper'>
          <i className='article__svg'>
            <img src='/src/assets/thumb-up.svg' />
          </i>
          <p className='article-info__text'>{item.like.length}</p>
        </div>
        <div className='article-info__wrapper'>
          <i className='article__svg'>
            <img src='/src/assets/message.svg' />
          </i>
          <p className='article-info__text'>{item.comment}</p>
        </div>
      </div>
    </div>
  );
}

export default ArticleItem;

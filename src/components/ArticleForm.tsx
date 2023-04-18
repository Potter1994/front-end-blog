import React, { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { createArticle, getArticles } from "../redux/reducers/articleSlice";

function ArticleForm({ setIsArticleFormPopup }: any) {
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) => state.article);
  const titleRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const handleClick = async (e: React.MouseEvent<EventTarget>) => {
    const title = titleRef.current!.value.trim();
    const text = textRef.current!.value.trim();
    setErrorMessage("");

    if (!title) {
      return setErrorMessage("Title 不能為空白或空");
    }

    if (!text) {
      return setErrorMessage("Text 不能為空白或空");
    }

    await dispatch(createArticle(title, text));
    setIsArticleFormPopup(false);
    await dispatch(
      getArticles(`${article.currentPage}` || "1", article.sortType || "desc")
    );
  };

  return (
    <div className='article-popup-form'>
      <form
        className='article-popup-form__form'
        onSubmit={(e) => e.preventDefault()}>
        {errorMessage && (
          <p className='article-popup-form__error'>{errorMessage}</p>
        )}
        <label className='article-popup-form__label'>
          <p className='article-popup-form__title'>Title : </p>
          <input
            type='text'
            className='article-popup-form__input'
            ref={titleRef}
          />
        </label>
        <label className='article-popup-form__label'>
          <p className='article-popup-form__title'>Text : </p>
          <textarea
            name=''
            id=''
            className='article-popup-form__textarea'
            rows={20}
            placeholder='Type your text...'
            ref={textRef}></textarea>
        </label>
        <div className='article-popup-form-bottom'>
          <button
            className='article-popup-form__button button'
            onClick={(e) => handleClick(e)}>
            Create
          </button>
          <button
            className='article-popup-form__button button'
            onClick={() => setIsArticleFormPopup(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;

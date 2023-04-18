import React, { useCallback, useEffect, useState } from "react";
import { selectUser } from "../redux/reducers/userSlice";
import { getArticles } from "../redux/reducers/articleSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { axiosArticle } from "../utils/useAPI";
import { Link, Outlet, useLocation } from "react-router-dom";
import Loading from "../components/Loading";
import ArticleItem from "../components/ArticleItem";
import ArticleForm from "../components/ArticleForm";

function Home() {
  const [isArticleFormPopup, setIsArticleFormPopup] = useState(false);
  const dispatch = useAppDispatch();
  const article = useAppSelector((state) => state.article);
  const { articles } = article;
  const location = useLocation();
  const userInfo = useAppSelector(selectUser).userInfo;
  let userContent = null;

  useEffect(() => {
    const url = new URLSearchParams(location.search);
    const paramsObj: { [key: string]: string } = {};

    for (const [key, value] of url) {
      paramsObj[key] = value;
    }

    dispatch(getArticles(paramsObj.page || "1", paramsObj.sort || "desc"));
  }, [location.search]);

  if (userInfo) {
    const { username, token } = userInfo;

    userContent = (
      <div className='article-user'>
        <p className='article-user__title'>
          User :<span className='article-user__text'>{username}</span>
        </p>
        <button
          className='article-user__button'
          onClick={() => setIsArticleFormPopup(true)}>
          Create Article
        </button>
      </div>
    );
  }

  const pagination = () => {
    const totalPage = article.totalPage;
    const currentPage = article.currentPage;

    return new Array(totalPage)
      .fill(null)
      .map((i, index) => index + 1)
      .map((i) => (
        <Link
          key={i}
          to={`/?page=${i}`}
          className={`article-page${
            currentPage === i ? " article-page__active" : ""
          }`}>
          {i}
        </Link>
      ));
  };

  return (
    <div className='article'>
      {isArticleFormPopup && (
        <ArticleForm setIsArticleFormPopup={setIsArticleFormPopup} />
      )}
      {article.isLoading && <Loading />}
      <Outlet />
      {userContent}
      <nav className='article-page-nav'>Page : {pagination()}</nav>
      <div className='article-container'>
        {articles.map((item) => (
          <ArticleItem key={item.articleId} item={item} userInfo={userInfo} />
        ))}
      </div>
    </div>
  );
}

export default Home;

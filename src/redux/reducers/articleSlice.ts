import { axiosCreateArticle, axiosGetUpdateIdArticle, axiosCreateSubArticle, axiosUpdateArticle, axiosUpdateSubArticle, axiosThumbArticle } from './../../utils/useAPI';
import { createSlice } from '@reduxjs/toolkit';
import { AppDispatch, store } from '../store';
import { axiosArticle, axiosDeleteArticle, axiosGetSubArticle } from '../../utils/useAPI';

const initialState = {
  isLoading: false,
  currentPage: 1,
  articles: [] as any[],
  totalPage: null as (number | null),
  sortType: 'desc',
  subArticles: [] as any[],
  currentThumb: null as (number | null),
  currentPopupThumb: null as (number | null)
}

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setIsLoading: (state, action: { payload: boolean }) =>
      ({ ...state, isLoading: action.payload })
    ,
    setCurrentPage: (state, action: { payload: number }) => ({ ...state, currentPage: action.payload }),
    setArticles: (state, action) => ({ ...state, articles: action.payload }),
    setTotalPage: (state, action: { payload: number }) => ({ ...state, totalPage: action.payload }),
    setSortType: (state, action: { payload: string }) => ({ ...state, sortType: action.payload }),
    setSubArticles: (state, action) => ({ ...state, subArticles: action.payload }),
    setCurrentThumb: (state, action) => ({ ...state, currentThumb: action.payload }),
    setCurrentPopupThumb: (state, action) => ({ ...state, currentPopupThumb: action.payload }),
  }
});

export const { setIsLoading, setArticles, setCurrentPage, setTotalPage, setSortType, setSubArticles, setCurrentThumb, setCurrentPopupThumb } = articleSlice.actions;
export default articleSlice.reducer;

export const getArticles = (page: string, sort: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));

  try {
    const { data: { result, totalPage } } = await axiosArticle(page, sort);
    dispatch(setArticles(result));
    dispatch(setTotalPage(totalPage));
    dispatch(setCurrentPage(Number(page)));
    dispatch(setSortType(sort));
    dispatch(setIsLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false));
  }
}

export const getSubArticles = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));

  try {
    const { data: { result, totalSubArticle } } = await axiosGetSubArticle(id);
    dispatch(setSubArticles(result))
    dispatch(setIsLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false));
  }
}

export const deleteArtice = (id: string, page: string, sort: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));

  try {
    const result = await axiosDeleteArticle(id);
    const test = await dispatch(getArticles(page, sort));
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false));
  }
}

export const deleteSubArtice = (id: string, mainId: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));
  const changeCommentMainArticle = store.getState().article.articles.map((item) =>
    item.articleId === Number(mainId) ? ({ ...item, comment: item.comment - 1 }) : item
  );

  try {
    const result = await axiosDeleteArticle(id);
    await dispatch(getSubArticles(mainId));
    await dispatch(setArticles(changeCommentMainArticle));
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false));
  }
}

export const createArticle = (title: string, text: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));
  const { currentPage, sortType } = store.getState().article

  try {
    const result = await axiosCreateArticle(title, text);

    dispatch(setIsLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false));
  }
}

export const createSubArticle = (text: string, id: string) => async (dispatch: AppDispatch) => {
  const { currentPage, sortType } = store.getState().article;
  dispatch(setIsLoading(true));

  try {
    const result = await axiosCreateSubArticle(text, id);
    await Promise.all([dispatch(getSubArticles(id)), dispatch(getArticles(`${currentPage}`, sortType))]);
    dispatch(setIsLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false));
  }
}

export const updateArticle = (articleId: string, title: string, text: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));

  try {
    const { data: updateInfo } = await axiosUpdateArticle(articleId, title, text);

    if (updateInfo.result === '更新成功') {
      const { data: { result: newArticle } } = await axiosGetUpdateIdArticle(articleId);
      const articles = store.getState().article.articles.map(item => item.articleId === Number(articleId) ? (newArticle) : item);
      dispatch(setArticles([...articles]))
      dispatch(setIsLoading(false));

      return;
    }

    dispatch(setIsLoading(false));
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false));
  }
}

export const updateSubArticle = (articleId: string, text: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));

  try {
    const { data: updateInfo } = await axiosUpdateSubArticle(articleId, text);

    if (updateInfo.result === '更新成功') {
      const { data: { result: newArticle } } = await axiosGetUpdateIdArticle(articleId);
      const articles = store.getState().article.subArticles.map(item => item.articleId === articleId ? (newArticle) : item);

      dispatch(setSubArticles(articles));
      dispatch(setIsLoading(false));

      return;
    }

    dispatch(setIsLoading(false))
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false))
  }
}

export const updateThumb = (articleId: string, username: string) => async (dispatch: AppDispatch) => {

  if (!username) {
    return;
  }

  try {
    const result = await axiosThumbArticle(articleId, username);
    const articles = store.getState().article.articles.map(item => item.articleId === Number(articleId) ? { ...item, like: [...item.like] } : item);

    if (result.status === 201) {
      const index = articles.findIndex(item => item.articleId === Number(articleId));

      const likeArray = articles[index].like as any[];
      const likeIndex = likeArray.findIndex((i: any) => i === username);

      if (likeIndex === -1) {
        likeArray.push(username);
      } else {
        likeArray.splice(likeIndex, 1);
      }

      dispatch(setArticles(articles));
    }
  } catch (err) {
    console.log(err);
  }
}
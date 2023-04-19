import { axiosCreateArticle, axiosGetUpdateIdArticle, axiosCreateSubArticle, axiosUpdateArticle } from './../../utils/useAPI';
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
  }
});

export const { setIsLoading, setArticles, setCurrentPage, setTotalPage, setSortType, setSubArticles } = articleSlice.actions;
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

export const updateSubArticle = (articleId: string, title = "Sub", text: string) => async (dispatch: AppDispatch) => {
  dispatch(setIsLoading(true));

  try {
    const { data: updateInfo } = await axiosUpdateArticle(articleId, title, text);

    if (updateInfo.result === '更新成功') {
      const { data: { result: newArticle } } = await axiosGetUpdateIdArticle(articleId);
      const articles = store.getState().article.articles.map(item => item.articleId === articleId ? (newArticle) : item);
      dispatch(setArticles([...articles]))
      dispatch(setIsLoading(false));

      return;
    }

    dispatch(setIsLoading(false))
  } catch (err) {
    console.log(err);
    dispatch(setIsLoading(false))
  }
}
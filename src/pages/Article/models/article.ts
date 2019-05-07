import { fetchList } from '@/services/article';
import { routerRedux } from 'dva/router';
import _debug from 'debug';

const debug = _debug('app:models:article');

export default {
  namespace: 'article',
  state: {
    articleList: []
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/article/list') {
          dispatch({
            type: 'getArticleList',
            payload: {}
          });
        }
      });
    }
  },
  effects: {
    *getArticleList({ payload }, { call, put }) {
      const res = yield call(fetchList);
      debug(res);
      // debug('tagList', tagList)
      if (res.code === 0) {
        yield put({
          type: 'onChangeState',
          payload: {
            articleList: res.data
          }
        });
      }
    },
    *changeArticleType({ payload }, { put }) {
      yield put({
        type: 'createArticle/onChangeState',
        payload: {
          articleData: payload.articleData
        }
      });
      yield put(
        routerRedux.push(`/article/create?id=${payload.articleData._id}`)
      );
    }
  },

  reducers: {
    onChangeState(state, { payload }) {
      return {
        ...state,
        articleList: payload.articleList
      };
    }
  }
};

import { configureStore } from '@reduxjs/toolkit'

import postsReducer from '../features/posts/postsSlice'
import commentsReducer from '../features/comments/commentsSlice'
import likesReducer from '../features/likes/likesSlice'
import userReducer from '../features/user/userSlice'
import tokenReducer from '../features/login/tokenSlice'
import pageReducer from '../features/pageSlice'

export default configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    likes: likesReducer,
    user: userReducer,
    token: tokenReducer,
    page: pageReducer
  }
})

// export default (state={posts: []}, action) => {
//     console.log(action)
//     switch (action.type){
//         case 'fetchPosts':
//             return {...state, posts: action.data}
//         default: 
//             return state
//     }
// }
import React, {useState, useEffect} from "react"
import { StyleSheet, View, Text, TextInput } from "react-native"
import {changePage} from '../pageSlice'
import {useSelector,useDispatch} from 'react-redux'
import {fetchPostById} from '../posts/postByIdSlice'
import {fetchProfileById} from '../user/profileByIdSlice'

import Icon from 'react-native-vector-icons/AntDesign'

export const Comments = ({postComments, postId}) => {
    const dispatch = useDispatch()

    if (postComments.length === 0){
        return null
    } else if (postComments.length === 1){
        let readableDate = new Date(`${postComments[0].created_at}`).toDateString()
        return (
            <View key={postComments[0].id} style={styles.commentsContainer}>
                <Text style={styles.marginTop}><Text style={styles.bold}onPress={() => {
                        dispatch(fetchProfileById(postComments[0].user_id))
                        dispatch(changePage('profile'))
                    }}>{postComments[0].username}</Text> {postComments[0].comment} {readableDate}</Text>
            </View>
        )
    } else if (postComments.length === 2){
        const orderedComments = postComments
        .slice()
        .sort((a, b) => a.created_at.localeCompare(b.created_at))

        let content = orderedComments.map((comment, idx) => {
            let readableDate = new Date(`${comment.created_at}`).toDateString()
            return (
                <View key={idx} >
                    <Text style={styles.marginTop}><Text style={styles.bold} onPress={() => {
                        dispatch(fetchProfileById(comment.user_id))
                        dispatch(changePage('profile'))
                    }}>{comment.username}</Text> {comment.comment} {readableDate}</Text>
                </View>
            )
        })

        return (
            <View style={styles.commentsContainer}>
                {content}
            </View>
        )
    } else {
        const orderedComments = postComments
        .slice()
        .sort((a, b) => a.created_at.localeCompare(b.created_at))

        let readableDateFirst = new Date(`${orderedComments[0].created_at}`).toDateString()
        let readableDateLast = new Date(`${orderedComments[orderedComments.length - 1].created_at}`).toDateString()
        let commentFirst = <View key={orderedComments[0].id}>
                                <Text style={styles.marginTop}><Text style={styles.bold}>{orderedComments[0].username}</Text> {orderedComments[0].comment} {readableDateFirst}</Text>
                            </View>
        let commentLast = <View key={orderedComments[orderedComments.length - 1].id} style={styles.marginTop}>
                                <Text><Text style={styles.bold} onPress={() => {
                            dispatch(fetchProfileById(orderedComments[orderedComments.length - 1].user_id))
                            dispatch(changePage('profile'))
                        }}>{orderedComments[orderedComments.length - 1].username}</Text> {orderedComments[orderedComments.length - 1].comment} {readableDateLast}</Text>
                            </View>

        return (
            <View style={styles.commentsContainer}>
                {commentFirst}
                <View style={styles.center}>
                    <Icon name="ellipsis1" size={30} onPress={() => {
                        dispatch(fetchPostById(postId))
                        dispatch(changePage('post'))
                    }} />
                </View>
                {commentLast}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bold: {
        fontWeight:'bold'
    },
    commentsContainer: {
        marginLeft:7
    },
    marginTop: {
        marginTop:7
    },
    center: {
        alignItems:'center',
        marginBottom:-10
    }
})
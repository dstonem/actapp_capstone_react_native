import React, {useState, useEffect} from "react"
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity } from "react-native"
import {changePage} from '../pageSlice'
import {useSelector,useDispatch} from 'react-redux'
import {ProfilePosts} from './ProfilePosts'
import {fetchUser} from './userSlice'

const Profile = () => {
    const dispatch = useDispatch()
    const profileUser = useSelector(state => state.profileById.profileById)
    const currentUser = useSelector(state => state.user.user)
    const userStatus = useSelector(state => state.user.status)
    const token = useSelector(state => state.token)


    const profileByIdStatus = useSelector(state => state.profileById.status)
    const profileByIdError = useSelector(state => state.profileById.error)

    const posts = useSelector(state => state.posts.posts)

    useEffect(() => {
        if (userStatus === 'idle') {
                dispatch(fetchUser(token.token))
            }
    }, [userStatus, dispatch])

    let profilePosts = posts.filter(post=>post.user_id === profileUser.id ? true : false)
    const orderedPosts = profilePosts
        .slice()
        .sort((a, b) => b.date_posted.localeCompare(a.date_posted))

    let content

    if (profileByIdStatus === 'loading') {
        content = <Text >Loading...</Text>
    } else if (profileByIdStatus === 'succeeded' && userStatus === 'succeeded'){
        if (profileUser.id === currentUser.id){
            content = 
                <View>
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={()=>dispatch(changePage('changeprofilepic'))}>
                            <Image 
                                source={{uri: currentUser.profilepic}} 
                                style={styles.profilePic}
                            />
                        </TouchableOpacity>
                        <Text style={styles.username}>{profileUser.username}</Text>
                        <Text><Text style={styles.username}>{profileUser.points}</Text> points</Text>
                    </View>
                    <ProfilePosts posts={orderedPosts} />
                </View>
        } else {
            content = 
                <View>
                    <View style={styles.userInfo}>
                        <TouchableOpacity onPress={()=>dispatch(changePage('changeprofilepic'))}>
                            <Image 
                                source={{uri: profileUser.profilepic}} 
                                style={styles.profilePic}
                            />
                        </TouchableOpacity>
                        <Text style={styles.username}>{profileUser.username}</Text>
                        <Text style={styles.username}>{profileUser.points} points</Text>
                    </View>
                    <ProfilePosts posts={orderedPosts} />
                </View>
        }
        
    } else if (profileByIdStatus === 'failed'){
        content = <Text>{profileByIdError}</Text>
    }

    return (
        <View style={styles.main}>
            {content}
        </View>
    )
}

let width = Dimensions.get('window').width; //full width

const styles = StyleSheet.create({
    main: {
        marginTop:20,
        marginBottom:50
    },
    profilePic: {
        borderRadius:50,
        height: 100, 
        width: 100
    },
    userInfo: {
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        width:width
    },
    username: {
        fontWeight:'bold'
    },
    points: {
        fontWeight:'bold',
        color:'rgb(55,182,53)'
    },
    postImgContainer: {
        width:width,
        flex:1,
        flexDirection:'row',
        flexWrap:'wrap'
    },
    postImg: {
        width:width*0.3
    }
})

export default Profile
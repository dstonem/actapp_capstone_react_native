import * as React from 'react';
import { Button, Image, View, Platform, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import {useState,useEffect} from 'react'
import axios from 'axios'
import {useSelector,useDispatch} from 'react-redux'
import {changeStatus} from './postsSlice'
import {changePage} from '../pageSlice'

export default function AddImage() {

    const dispatch = useDispatch()

    const user = useSelector(state=>state.user.user)

    const [image,setImage] = useState(null)
    const [postText,setPostText] = useState(null)

    useEffect(() => {
        getPermissionAsync();
    }, [])

    const handleChange = (text) => {
        setPostText(text)
    }

    const getPermissionAsync = async () => {
        if (Platform.OS !== 'web') {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      };

    const  _pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                let localUri = result.uri;
                let filename = localUri.split('/').pop();
                // Infer the type of the image
                let match = /\.(\w+)$/.exec(filename);
                let type = match ? `image/${match[1]}` : `image`;
                result.filename = filename
                result.type = type
                setImage(result);
            }
            console.log(result);
            return result
        } catch (E) {
            console.log(E);
        }
    };

    const _uploadToDB = async () => {
            
            const img = JSON.stringify({ uri: image.uri, name: image.filename, type: image.type, text: postText })

            return await fetch(`http://localhost:3333/upload/${user.username}/${user.id}`, {
                method: 'POST',
                body: img,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button title="Pick an image from camera roll" onPress={_pickImage} />
            {image && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
            <TextInput onChangeText={handleChange} />
            {image && <Button title="Upload" onPress={
                ()=>{
                    _uploadToDB()
                    dispatch(changeStatus('idle'))
                    dispatch(changePage('feed'))
                }
            }/>}
        </View>
    )
}
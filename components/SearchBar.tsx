import { icons } from '@/constants/icons';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Image, TextInput, View } from 'react-native';

interface Props{
    placeholder: string,
    onPress?: () => void;
    value?: string,
    onChangeText?: (text: string) => void;
}
const SearchBar = ({placeholder, onPress, value, onChangeText}: Props) => {
  const { focus } = useLocalSearchParams();
  const inputRef = useRef<TextInput>(null);
  useEffect(() => {
      if (focus === "true" && inputRef.current) {
        // wait a tick so navigation finishes
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
    }, [focus]);
  return (
    <View className='flex-row items-center bg-dark-200 rounded-full px-5 py-4'>
      <Image source={icons.search} className='size-5' resizeMode='contain' tintColor="#ab8bff"/>
      <TextInput  ref={inputRef} onPress={onPress} placeholder={placeholder} value={value} onChangeText={onChangeText} placeholderTextColor="#ab8bff" className='flex-1 ml-2 text-white'/>
    </View>
  )
}

export default SearchBar
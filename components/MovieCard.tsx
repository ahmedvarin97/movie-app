import { icons } from '@/constants/icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const MovieCard = ({id, poster_path, title, vote_average, release_date, original_language,adult}:Movie) => {
  return (
    <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity className='w-[28%]'>
            <Image
            source={{
                uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://placehold.co/600x400/1a1a1a/fffff.png'
            }}
            className='w-full h-[120px] rounded-lg'
            resizeMode='cover'
            />
            <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>
            <View className='flex-row items-center justify-between mt-2 mb-2'>
                <View className='flex-row items-center justify-start gap-x-1'>
                    <Image source={icons.star} className='size-4'/>
                    <Text className='text-white text-xs font-bold uppercase'>{Math.round(vote_average)}/10</Text>
                </View>
                <View className='flex-row items-center justify-end'>
                    <Text className='text-light-300 text-xs font-bold uppercase'>{original_language}</Text>
                </View>
            </View>
            <View className='flex-row items-center justify-between'>
                <Text className='text-xs text-light-300 font-medium uppercase'>{release_date?.split('-')[0]}</Text>
                {adult ? (
                    <Text className='text-xs font-medium text-white uppercase bg-red-500 px-2'>Movie</Text>
                ) : null}
            </View>
        </TouchableOpacity>
    </Link>
  )
}

export default MovieCard
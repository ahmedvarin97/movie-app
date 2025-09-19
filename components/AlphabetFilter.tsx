import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  onSelect: (letter: string) => void;
  selectedLetter: string;
}

const AlphabetFilter = ({ onSelect, selectedLetter }: Props) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={alphabet}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            className={`
              px-4 py-2 mx-1 rounded-full
              ${selectedLetter === item ? 'bg-accent' : 'bg-dark-200'}
            `}
          >
            <Text
              className={`
                text-white font-bold
                ${selectedLetter === item ? 'text-white' : 'text-white'}
              `}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 5,
        }}
      />
    </View>
  );
};

export default AlphabetFilter;
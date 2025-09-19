import AlphabetFilter from "@/components/AlphabetFilter";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import "../globals.css";

const LatestMovies = () => {
    const [page, setPage] = useState(1);
    const [selectedLetter, setSelectedLetter] = useState('');
    
    const fetchLatestMovies = useCallback(
      () => fetchMovies({ query: selectedLetter, page }),
      [page, selectedLetter]
    );

    const {data: fetchedData, loading: moviesLoading, error: moviesError} = useFetch(fetchLatestMovies);

    const movies = fetchedData?.results || [];
    const totalPages = fetchedData?.total_pages || 1;
  
    // Sort movies by rating and filter by selected letter for a clean 3-column layout
    const sortedAndFilteredMovies = useMemo(() => {
        if (!movies) return [];
        const filtered = selectedLetter
            ? movies.filter(movie => movie.title.toLowerCase().startsWith(selectedLetter.toLowerCase()))
            : movies;

        return filtered.sort((a: { title: string | any[]; vote_average: number; }, b: { title: string | any[]; vote_average: number; }) => {
            // Push single-character titles to the last
            if (a.title.length === 1 && b.title.length !== 1) {
                return 1;
            }
            if (b.title.length === 1 && a.title.length !== 1) {
                return -1;
            }
            // Otherwise, sort by rating from high to low
            return b.vote_average - a.vote_average;
        }).slice(0, 18);
    }, [movies, selectedLetter]);


    const handleNext = () => {
      const nextPage = page + 1;
      setPage(nextPage);
    };
  
    const handlePrevious = () => {
      if (page > 1) {
        const prevPage = page - 1;
        setPage(prevPage);
      }
    };

    const handleAlphabetSelect = (letter: string) => {
      setSelectedLetter(letter);
      setPage(1); // Reset to page 1 for new search
    };
  
    return (
        <View className="flex-1">
            <Text className="text-lg font-bold mt-5 mb-3 text-white">Latest Movies</Text>
            <View className="bg-dark-200 py-3 rounded-lg mb-5">
              <AlphabetFilter onSelect={handleAlphabetSelect} selectedLetter={selectedLetter} />
            </View>
            {moviesLoading ? (
                <ActivityIndicator size="large" color="#0000ff" className="self-center mt-5" />
            ) : moviesError ? (
                <Text>Error: {moviesError.message}</Text>
            ) : (
                <>
                <FlatList
                    data={sortedAndFilteredMovies}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1 / 3, padding: 5 }}>
                            <MovieCard {...item} />
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={3}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        marginBottom: 10,
                    }}
                    contentContainerStyle={{
                        paddingBottom: 32,
                    }}
                    scrollEnabled={false}
                />
                {totalPages > 1 && (
                <View className="flex-row justify-between items-center mt-5 mb-20">
                    <TouchableOpacity
                        onPress={handlePrevious}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-lg ${page === 1 ? 'bg-dark-200' : 'bg-accent'}`}
                    >
                        <Text className="text-white text-lg">Previous</Text>
                    </TouchableOpacity>
                    <Text className="text-light-100 text-lg">Page {page}</Text>
                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={page === totalPages}
                        className={`px-4 py-2 rounded-lg ${page === totalPages ? 'bg-dark-200' : 'bg-accent'}`}
                    >
                        <Text className="text-white text-lg">Next</Text>
                    </TouchableOpacity>
                </View>
                )}
                </>
            )}
        </View>
    );
};

export default function App() {
  const router = useRouter();
  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useFetch(getTrendingMovie)

  return (
    <View className="flex-1 bg-primary pb-10">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
          <Image source={icons.logo} className="w-12 h-20 mt-20 mb-5 mx-auto"/>
          {
            trendingLoading ? (<ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center"/>) 
            : trendingError ? (<Text>Error: {trendingError.message}</Text>) 
            : (
              <View className="flex-1 mt-5">
                <SearchBar
                  onPress={() => router.push({ pathname: "/search", params: { focus: "true" } })}
                  placeholder = "Search for a movie"
                />
                {
                  trendingMovies && (
                    <View className="mt-10 ">
                      <Text className="text-lg font-bold text-white mt-5 mb-3">Trending Movies</Text>
                    </View>
                  )
                }
                <>
                <FlatList
                  className="mb-4 mt-3"
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View className="w-4"></View>}
                  data={trendingMovies}
                  renderItem={({ item, index }) => (
                    <TrendingCard movie={item} index={index} />
                  )}
                  keyExtractor={(item) => item.movie_id.toString()}
                  contentContainerStyle={{
                    paddingRight: 20,
                    paddingLeft: 5,
                  }}
                />
                <LatestMovies/>
                </>
              </View>
            )
          }
      </ScrollView>
    </View>
  );
}
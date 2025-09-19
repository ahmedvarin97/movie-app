import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import "../globals.css";

const LatestMovies = () => {
    const [page, setPage] = useState(1);
    const {data: movies = [], loading: moviesLoading, error: moviesError, refetch} =  useFetch(
    (params) => fetchMovies({ query: '', page: params.page }),
    true,
    { page }
    );
  
    const handleNext = () => {
      const nextPage = page + 1;
      setPage(nextPage);
      refetch({ page: nextPage });
    };
  
    const handlePrevious = () => {
      if (page > 1) {
        const prevPage = page - 1;
        setPage(prevPage);
        refetch({ page: prevPage });
      }
    };
  
    return (
        <View className="flex-1">
            <Text className="text-lg font-bold mt-5 mb-3 text-white">Latest Movies</Text>
            {moviesLoading ? (
                <ActivityIndicator size="large" color="#0000ff" className="self-center mt-5" />
            ) : moviesError ? (
                <Text>Error: {moviesError.message}</Text>
            ) : (
                <>
                <FlatList
                    data={movies}
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
                    scrollEnabled={false}
                />
                <View className="flex-row justify-between items-center mt-5 mb-20">
                    <TouchableOpacity
                        onPress={handlePrevious}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded-full ${page === 1 ? 'bg-[#0F0D23]' : 'bg-[#AB8BFF]'}`}
                    >
                        <Text className={`text-lg ${page === 1 ? 'text-light-200' : 'text-white'}`}>Previous</Text>
                    </TouchableOpacity>
                    <Text className="text-light-100 font-bold text-sm">Page {page}</Text>
                    <TouchableOpacity
                        onPress={handleNext}
                        className="px-4 py-2 rounded-full bg-[#AB8BFF]"
                    >
                        <Text className="text-white text-lg">Next</Text>
                    </TouchableOpacity>
                </View>
                </>
            )}
        </View>
    );
};

export default function App() {
  const router = useRouter();
  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useFetch(getTrendingMovie);

  return (
    <View className="flex-1 bg-primary pb-10">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
          <Image source={icons.logo} className="w-12 h-20 mt-20 mb-5 mx-auto"/>
          {
            trendingLoading ? (
              <ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center"/>
            ) : trendingError ? (
              <Text>Error: {trendingError?.message}</Text>
            ) : (
              <View className="flex-1 mt-5">
                <SearchBar
                  onPress={() => router.push("/search")}
                  placeholder = "Search for a movie"
                />
                {
                  trendingMovies && (
                    <View className="mt-10 ">
                      <Text className="text-lg font-bold text-white mt-5 mb-3">Trending Movies</Text>
                    </View>
                  )
                }
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
                <LatestMovies />
              </View>
            )
          }
      </ScrollView>
    </View>
  );
}
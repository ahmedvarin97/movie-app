import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";
import "../globals.css";
 

export default function App() {
  const router = useRouter();
  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useFetch(getTrendingMovie)
  const {data: movies = [], loading: moviesLoading, error: moviesError} =  useFetch(
  () => fetchMovies({ query: '' }),
  );




  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{minHeight: "100%", paddingBottom: 10}}>
          <Image source={icons.logo} className="w-12 h-20 mt-20 mb-5 mx-auto"/>
          {
            moviesLoading || trendingLoading ? (<ActivityIndicator size="large" color="#0000ff" className="mt-10 self-center"/> ) 
            : moviesError || trendingError ? (<Text>Error: {moviesError?.message || trendingError?.message}</Text>) 
            : (
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

                <Text className="text-lg font-bold mt-5 mb-3 text-white">Latest Movies</Text>
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
                  contentContainerStyle={{
                    paddingBottom: 32,
                  }}
                  scrollEnabled={false}
                />
                </>
              </View>
            )
          }
          
      </ScrollView>
    </View>
    
  );
}
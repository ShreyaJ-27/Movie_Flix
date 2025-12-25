import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MovieCard from "@/components/MovieCard";
import { icons } from "@/constants/icons";
import { getSavedMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";

const Save = () => {
  const { data: savedMovies, loading, error } = useFetch(getSavedMovies);

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Text className="text-red-500">Error loading saved movies</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-primary flex-1 px-5">
      <View className="mt-10">
        <Text className="text-white text-xl font-bold mb-3">Saved Movies</Text>
        {savedMovies && savedMovies.length > 0 ? (
          <FlatList
            data={savedMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="pb-32"
            scrollEnabled={false}
          />
        ) : (
          <View className="flex justify-center items-center flex-1 flex-col gap-5 mt-20">
            <Image source={icons.save} className="size-10" tintColor="#fff" />
            <Text className="text-gray-500 text-base">No saved movies yet</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Save;
import { Client, Databases, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
  .setEndpoint("https://fra.cloud.appwrite.io/v1")
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", query),
    ]);

    if (result.documents.length > 0) {
      const existingMovie = result.documents[0];
      await database.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const saveMovie = async (movie: Movie) => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.equal("movie_id", movie.id),
    ]);

    if (result.documents.length > 0) {
      // Already saved, unsave
      await database.deleteDocument(DATABASE_ID, SAVED_COLLECTION_ID, result.documents[0].$id);
      return false; // unsaved
    } else {
      await database.createDocument(DATABASE_ID, SAVED_COLLECTION_ID, ID.unique(), {
        movie_id: movie.id,
        title: movie.title,
        poster_url: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
      });
      return true; // saved
    }
  } catch (error) {
    console.error("Error saving movie:", error);
    throw error;
  }
};

export const getSavedMovies = async (): Promise<Movie[] | undefined> => {
  try {
    const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
      Query.limit(20),
      Query.orderDesc("$createdAt"),
    ]);

    return result.documents.map(doc => ({
      id: doc.movie_id,
      title: doc.title,
      poster_path: doc.poster_url.replace("https://image.tmdb.org/t/p/w500", ""),
    })) as Movie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
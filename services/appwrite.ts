import { Client, Databases, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;

const client = new Client()
    .setEndpoint('https://cloud.app.io/v1')
    .setProject(PROJECT_ID)


const database = new Databases(client);

export const updateSearchCount = async(query: string, movie: Movie) => {

    const result = await database.listDocuments(DATABASE_ID,COLLECTION_ID, [
        Query.equal('searchTerm', query)
    ])
    console.log(result);
    
    //check if record of that search already stored
    //if a document found the search count
    //if not create new entry
}
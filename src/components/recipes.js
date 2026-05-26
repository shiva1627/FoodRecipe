import { View, Text, Pressable, Image, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";

export default function Recipe({ categories, foods }) {
  const navigation = useNavigation();

  const renderItem = ({ item, index }) => (
<ArticleCard item={item} index={index} navigation={navigation} />
  );

  return (
    <View style={styles.container}>
      <View testID="recipesDisplay">
        <FlatList
          data={foods}
          numColumns={2}
          keyExtractor={(item, index) => item.idMeal ? item.idMeal.toString() : (item.id ? item.id.toString() : index.toString())}
          renderItem={renderItem}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}
 
const ArticleCard = ({ item, index, navigation }) => {
  return (
    <View
      style={[styles.cardContainer, { paddingLeft: index % 2 === 0 ? 0 : 8, paddingRight: index % 2 === 0 ? 8 : 0 }]} 
      testID="articleDisplay"
    >
      <TouchableOpacity 
        onPress={() => navigation.navigate("RecipeDetail", { ...item })}
        activeOpacity={0.8}
      >
        {/* 1. Correct Image URL Key */}
        <Image 
          source={{ uri: item.recipeImage }} 
          style={styles.articleImage} 
        />
        
        {/* 2. Correct Recipe Name Key */}
        <Text style={styles.articleText} numberOfLines={1}>
          {item.recipeName}
        </Text>

        {/* 3. Correct Recipe Description Key */}
        <Text style={styles.articleDescription} numberOfLines={2}>
          {item.cookingDescription || item.recipeInstructions}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: wp(4), // mx-4 equivalent
    marginTop: hp(2),
    flex: 1,
  },
  title: {
    fontSize: hp(3),
    fontWeight: "600", // font-semibold
    color: "#52525B", // text-neutral-600
    marginBottom: hp(1.5),
  },
  loading: {
    marginTop: hp(20),
  },
  cardContainer: {
    justifyContent: "center",
    marginBottom: hp(1.5),
    flex: 1, // Allows cards to grow and fill space evenly
    paddingHorizontal: wp(1),
  },
  articleImage: {
    width: "100%",
    height: hp(18),
    borderRadius: 35,
    backgroundColor: "rgba(0, 0, 0, 0.05)", // bg-black/5
  },
  articleText: {
    fontSize: hp(1.5),
    fontWeight: "600", // font-semibold
    color: "#52525B", // text-neutral-600
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  articleDescription: {
    fontSize: hp(1.2),
    color: "#6B7280", // gray-500
    marginLeft: wp(2),
    marginTop: hp(0.5),
  },
  row: {
    justifyContent: "space-between", // Align columns evenly
  },
});
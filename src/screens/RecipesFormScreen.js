import { View,Text,TextInput,TouchableOpacity,Image,StyleSheet,} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {widthPercentageToDP as wp,heightPercentageToDP as hp,} from "react-native-responsive-screen";

export default function RecipesFormScreen({ route, navigation }) {
  const { recipeToEdit, recipeIndex, onrecipeEdited } = route.params || {};
  const [title, setTitle] = useState(recipeToEdit ? recipeToEdit.title : "");
  const [image, setImage] = useState(recipeToEdit ? recipeToEdit.image : "");
  const [description, setDescription] = useState(
    recipeToEdit ? recipeToEdit.description : ""
  );

  const saverecipe = async () => {
    // Basic validation to prevent saving completely empty fields
    if (!title.trim() || !image.trim() || !description.trim()) {
      alert("Please fill out all fields before saving.");
      return;
    }

    try {
      // 1. Initialize a new recipe object
      const newrecipe = {
        title: title.trim(),
        image: image.trim(),
        description: description.trim(),
      };

      // 2. Retrieve existing recipes from AsyncStorage
      const existingRecipesData = await AsyncStorage.getItem("customrecipes");
      let recipesArray = [];

      if (existingRecipesData !== null) {
        // Parse the retrieved data into an array if it exists
        recipesArray = JSON.parse(existingRecipesData);
      }

      // 3. Update or add a recipe based on whether recipeToEdit is defined
      if (recipeToEdit !== undefined && recipeIndex !== undefined) {
        // Mode: Editing an existing recipe
        recipesArray[recipeIndex] = newrecipe;
        
        // 4. Handle callbacks: notify parent component about the edit
        if (onrecipeEdited) {
          onrecipeEdited();
        }
      } else {
        // Mode: Adding a brand new recipe
        recipesArray.push(newrecipe);
      }

      // Save the updated array back to local storage
      await AsyncStorage.setItem("customrecipes", JSON.stringify(recipesArray));

      // 5. Navigate back to the previous screen on success
      navigation.goBack();

    } catch (error) {
      // 6. Error handling: wrap code in a try-catch block to log storage issues
      console.error("Failed to save the recipe to AsyncStorage:", error);
      alert("An error occurred while saving your recipe. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        placeholder="Image URL"
        value={image}
        onChangeText={setImage}
        style={styles.input}
      />
      {image ? (
        <Image source={{ uri: image }} style={styles.image} />
      ) : (
        <Text style={styles.imagePlaceholder}>Upload Image URL</Text>
      )}
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={4}
        style={[styles.input, { height: hp(20), textAlignVertical: "top" }]}
      />
      <TouchableOpacity onPress={saverecipe} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save recipe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
  },
  input: {
    marginTop: hp(4),
    borderWidth: 1,
    borderColor: "#ddd",
    padding: wp(.5),
    marginVertical: hp(1),
  },
  image: {
    width: 300,
    height:200,
    margin: wp(2),
  },
  imagePlaceholder: {
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderWidth: 1,
    borderColor: "#ddd",
    textAlign: "center",
    padding: wp(2),
  },
  saveButton: {
    backgroundColor: "#4F75FF",
    padding: wp(.5),
    alignItems: "center",
    borderRadius: 5,
    marginTop: hp(2),
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MyRecipeScreen() {
  const navigation = useNavigation();
  const [recipes, setrecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CHANGED START: Completed full local persistence retrieval stream ---
  const fetchrecipes = async () => {
    try {
      // Fetch Recipes from storage using specified key
      const storedRecipes = await AsyncStorage.getItem("customrecipes");
      
      // Check and Set State if data exists
      if (storedRecipes !== null) {
        setrecipes(JSON.parse(storedRecipes));
      }
    } catch (error) {
      console.error("Error fetching recipes from local storage:", error);
    } finally {
      // Update Loading State to false when process is finished
      setLoading(false);
    }
  };
  // --- CHANGED END ---

  useEffect(() => {
    fetchrecipes();
    
    // Optional: Add navigation listener to refresh screen when user navigates back from the form
    const unsubscribe = navigation.addListener('focus', () => {
      fetchrecipes();
    });
    return unsubscribe;
  }, [navigation]);

  // --- CHANGED START: Redirects to recipe builder screen layout ---
  const handleAddrecipe = () => {
    navigation.navigate("RecipesFormScreen");
  };
  // --- CHANGED END ---

  // --- CHANGED START: Opens detailed view passing recipe object ---
  const handlerecipeClick = (recipe) => {
    navigation.navigate("CustomRecipesScreen", { recipe });
  };
  // --- CHANGED END ---

  // --- CHANGED START: Async function handling data deletions safely ---
  const deleterecipe = async (index) => {
    try {
      // Clone the recipes array using spread operator
      const updatedrecipes = [...recipes];
      
      // Remove the recipe from the cloned array
      updatedrecipes.splice(index, 1);
      
      // Update AsyncStorage with updated array string
      await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedrecipes));
      
      // Update state with new array data
      setrecipes(updatedrecipes);
    } catch (error) {
      // Error handling block
      console.error("Error deleting local recipe entry:", error);
    }
  };
  // --- CHANGED END ---

  // --- CHANGED START: Route navigation for editing state fields ---
  const editrecipe = (recipe, index) => {
    // Navigate to form passing item data and index position tracking parameters
    navigation.navigate("RecipesFormScreen", {
      recipeToEdit: recipe,
      recipeIndex: index,
      onrecipeEdited: fetchrecipes, // Refresh callback hook
    });
  };
  // --- CHANGED END ---

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>{"Back"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleAddrecipe} style={styles.addButton}>
        <Text style={styles.addButtonText}>Add New recipe</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#f59e0b" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {recipes.length === 0 ? (
            <Text style={styles.norecipesText}>No recipes added yet.</Text>
          ) : (
            recipes.map((recipe, index) => (
              <View key={index} style={styles.recipeCard} testID="recipeCard">
                <TouchableOpacity testID="handlerecipeBtn" onPress={() => handlerecipeClick(recipe)}>
                  
                  {/* --- CHANGED START: Render Image dynamically if property path exists --- */}
                  {recipe.image && (
                    <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
                  )}
                  {/* --- CHANGED END --- */}

                  <Text style={styles.recipeTitle}>{recipe.title}</Text>
                  
                  {/* --- CHANGED START: Implemented string truncator function rendering --- */}
                  <Text style={styles.recipeDescription} testID="recipeDescp">
                    {recipe.description && recipe.description.length > 50
                      ? `${recipe.description.substring(0, 50)}...`
                      : recipe.description}
                  </Text>
                  {/* --- CHANGED END --- */}
                </TouchableOpacity>

                {/* Edit and Delete Buttons Container */}
                {/* --- CHANGED START: Built TouchableOpacity edit/delete UI buttons inside container --- */}
                <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                  <TouchableOpacity 
                    style={styles.editButton} 
                    onPress={() => editrecipe(recipe, index)}
                  >
                    <Text style={styles.editButtonText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.deleteButton} 
                    onPress={() => deleterecipe(index)}
                  >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
                {/* --- CHANGED END --- */}
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(4),
    backgroundColor: "#F9FAFB",
  },
  backButton: {
    marginBottom: hp(1.5),
    alignSelf: 'flex-start',
  },
  backButtonText: {
    fontSize: hp(2.2),
    color: "#4F75FF",
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: "#4F75FF",
    padding: wp(1.5),
    alignItems: "center",
    borderRadius: 5,
    width: 200,
    marginBottom: hp(2),
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(2),
  },
  scrollContainer: {
    paddingBottom: hp(2),
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  norecipesText: {
    textAlign: "center",
    fontSize: hp(2),
    color: "#6B7280",
    marginTop: hp(5),
    width: '100%',
  },
  recipeCard: {
    width: wp(44), 
    backgroundColor: "#fff",
    padding: wp(3),
    borderRadius: 8,
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, 
  },
  recipeImage: {
    width: "100%", 
    height: hp(16), 
    borderRadius: 8,
    marginBottom: hp(1),
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  recipeTitle: {
    fontSize: hp(2),
    fontWeight: "600",
    color: "#111827",
    marginBottom: hp(0.5),
  },
  recipeDescription: {
    fontSize: hp(1.6),
    color: "#6B7280",
    marginBottom: hp(1),
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: hp(1),
  },
  editButton: {
    backgroundColor: "#34D399",
    paddingVertical: hp(0.8),
    borderRadius: 5,
    width: '46%', 
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.6),
  },
  deleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: hp(0.8),
    borderRadius: 5,
    width: '46%', 
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: hp(1.6),
  },
});

// import {
//     View,
//     Text,
//     ScrollView,
//     TouchableOpacity,
//     Image,
//     StyleSheet,
//     ActivityIndicator,
//   } from "react-native";
//   import React, { useEffect, useState } from "react";
//   import AsyncStorage from "@react-native-async-storage/async-storage";
//   import { useNavigation } from "@react-navigation/native";
//   import {
//     widthPercentageToDP as wp,
//     heightPercentageToDP as hp,
//   } from "react-native-responsive-screen";
  
//   export default function MyRecipeScreen() {
//     const navigation = useNavigation();
//     const [recipes, setrecipes] = useState([]);
//     const [loading, setLoading] = useState(true);
  
//     useEffect(() => {
//       const fetchrecipes = async () => {
        
//         };
  
//       fetchrecipes();
//     }, []);
  
//     const handleAddrecipe = () => {

//     };
  
//     const handlerecipeClick = (recipe) => {

//     };
//     const deleterecipe = async (index) => {
    
//     };
  
//     const editrecipe = (recipe, index) => {

//     };
  
//     return (
//       <View style={styles.container}>
//         {/* Back Button */}
//         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//           <Text style={styles.backButtonText}>{"Back"}</Text>
//         </TouchableOpacity>
  
//         <TouchableOpacity onPress={handleAddrecipe} style={styles.addButton}>
//           <Text style={styles.addButtonText}>Add New recipe</Text>
//         </TouchableOpacity>
  
//         {loading ? (
//           <ActivityIndicator size="large" color="#f59e0b" />
//         ) : (
//           <ScrollView contentContainerStyle={styles.scrollContainer}>
//             {recipes.length === 0 ? (
//               <Text style={styles.norecipesText}>No recipes added yet.</Text>
//             ) : (
//               recipes.map((recipe, index) => (
//                 <View key={index} style={styles.recipeCard} testID="recipeCard">
//                   <TouchableOpacity testID="handlerecipeBtn" onPress={() => handlerecipeClick(recipe)}>
                  
//                     <Text style={styles.recipeTitle}>{recipe.title}</Text>
//                     <Text style={styles.recipeDescription} testID="recipeDescp">
                  
//                     </Text>
//                   </TouchableOpacity>
  
//                   {/* Edit and Delete Buttons */}
//                   <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                    
                
//                   </View>
//                 </View>
//               ))
//             )}
//           </ScrollView>
//         )}
//       </View>
//     );
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       padding: wp(4),
//       backgroundColor: "#F9FAFB",
//     },
//     backButton: {
//       marginBottom: hp(1.5),
//     },
//     backButtonText: {
//       fontSize: hp(2.2),
//       color: "#4F75FF",
//     },
//     addButton: {
//       backgroundColor: "#4F75FF",
//       padding: wp(.7),
//       alignItems: "center",
//       borderRadius: 5,
//       width:300,
//      marginLeft:500
//       // marginBottom: hp(2),
//     },
//     addButtonText: {
//       color: "#fff",
//       fontWeight: "600",
//       fontSize: hp(2.2),
//     },
//     scrollContainer: {
//       paddingBottom: hp(2),
//       height:'auto',
//       display:'flex',
//       alignItems:'center',
//       justifyContent:'center',
//       flexDirection:'row',
//       flexWrap:'wrap'
//     },
//     norecipesText: {
//       textAlign: "center",
//       fontSize: hp(2),
//       color: "#6B7280",
//       marginTop: hp(5),
//     },
//     recipeCard: {
//       width: 400, // Make recipe card width more compact
//       height: 300, // Adjust the height of the card to fit content
//       backgroundColor: "#fff",
//       padding: wp(3),
//       borderRadius: 8,
//       marginBottom: hp(2),
//       shadowColor: "#000",
//       shadowOpacity: 0.1,
//       shadowRadius: 4,
//       shadowOffset: { width: 0, height: 2 },
//       elevation: 3, // for Android shadow
//     },
//     recipeImage: {
//       width: 300, // Set width for recipe image
//       height: 150, // Adjust height of the image
//       borderRadius: 8,
//       marginBottom: hp(1),
//     },
//     recipeTitle: {
//       fontSize: hp(2),
//       fontWeight: "600",
//       color: "#111827",
//       marginBottom: hp(0.5),
//     },
//     recipeDescription: {
//       fontSize: hp(1.8),
//       color: "#6B7280",
//       marginBottom: hp(1.5),
//     },
//     actionButtonsContainer: {
//       flexDirection: "row",
//       justifyContent: "space-between",
//       marginTop: hp(1),
//     },
//     editButton: {
//       backgroundColor: "#34D399",
//       padding: wp(.5),
//       borderRadius: 5,
//       width: 100, // Adjust width of buttons to be more compact
//       alignItems: "center",
//     },
//     editButtonText: {
//       color: "#fff",
//       fontWeight: "600",
//       fontSize: hp(1.8),
//     },
//     deleteButton: {
//       backgroundColor: "#EF4444",
//       padding: wp(.5),
//       borderRadius: 5,
//       width: 100, // Adjust width of buttons to be more compact
//       alignItems: "center",
//     },
//     deleteButtonText: {
//       color: "#fff",
//       fontWeight: "600",
//       fontSize: hp(1.8),
//     },
//   });
  
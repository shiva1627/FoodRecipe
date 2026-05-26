import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  favoriterecipes: [], // Updated to handle favorite articles
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
   toggleFavorite: (state, action) => {
      const recipeToToggle = action.payload;
      
      // Check if the recipe already exists in favorites by comparing idFood
      const existingIndex = state.favoriterecipes.findIndex(
        (recipe) => recipe.idFood === recipeToToggle.idFood
      );

      if (existingIndex >= 0) {
        // If it exists, remove the item from the list
        state.favoriterecipes.splice(existingIndex, 1);
      } else {
        // If it doesn't exist, add the item to the favorites list
        state.favoriterecipes.push(recipeToToggle);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;

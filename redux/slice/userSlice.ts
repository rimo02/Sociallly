import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (username: string) => {
    const res = await fetch(`/api/users/${username}`);
    return res.json();
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    data: null,
    loading: true,
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
        state.status = "succeeded";
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.status = "failed";
      });
  },
});

export const selectUser = (state: any) => state.user.data;
export default userSlice.reducer;

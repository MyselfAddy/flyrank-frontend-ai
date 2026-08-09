# Application Prompts History

This document contains a log of all user prompts used during the development and iteration of this application.

---

### 1. Unauthenticated Favourite Redirect
> **Prompt:**
> "If I am unauth and click favourite button from the home page, redirect me to the favourites page"

---

### 2. ViewModel Architecture Refactoring
> **Prompt:**
> "move this to viewModel"

---

### 3. User-Scoped Favourites Database Service Refactoring
> **Prompt:**
> "Update the existing favourites service so favourites are stored under the signed-in user's profile.
> 
> Use this Real time DB structure:
> 
> users/{userId}/favourites/{imdbID}
> 
> Update the existing functions so they receive userId:
> 
> - addFavourite(userId: string, movie: Movie)
> - removeFavourite(userId: string, imdbID: string)
> - getFavourites(userId: string)
> 
> Requirements:
> 
> - use userId as the parent user document ID
> - use imdbID as the favourite document ID
> - preserve the existing function behaviour
> - do not use React hooks
> - do not access auth.currentUser inside the service
> - throw a readable error when userId is missing"

---

### 4. Logout Controls Integration
> **Prompt:**
> "add logout button as well and connect it with logout function"

---

### 5. Readme Documentation Generation
> **Prompt:**
> "create me in read me all prompts that we used for this app"

---

### 6. API Key Server Proxy Fix
> **Prompt:**
> "still api key is not working"

---

### 7. Preview Visibility Check
> **Prompt:**
> "i dont know but the preview is not visible"

---

### 8. Application UI/UX & Functional Feature Enhancements
> **Prompt:**
> "by the way , can you make it more and more better than what it is right now ? without ruining any existing thing running"

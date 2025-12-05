# How to Get a FREE Groq API Key (Takes 2 minutes!)

## Step 1: Sign Up
1. Go to: https://console.groq.com/
2. Click "Sign Up" or "Get Started"
3. Sign up with Google/GitHub/Email (FREE, no credit card needed!)

## Step 2: Get Your API Key
1. Once logged in, go to: https://console.groq.com/keys
2. Click "Create API Key"
3. Give it a name (e.g., "AstroNexus")
4. Copy the key (it starts with `gsk_...`)

## Step 3: Add to Your Project
1. Open your `.env` file in the project root
2. Find the line: `VITE_GROQ_API_KEY=your_groq_api_key_here`
3. Replace `your_groq_api_key_here` with your actual key:
   ```
   VITE_GROQ_API_KEY=gsk_your_actual_key_here
   ```
4. Save the file
5. **Restart your development server** (important!)

## Step 4: Use It!
1. In the AI component, select "Groq Mixtral" from the dropdown
2. Ask a question - it should now use real AI!

---

**Note:** Groq offers a generous free tier, so you can use it without worrying about costs!


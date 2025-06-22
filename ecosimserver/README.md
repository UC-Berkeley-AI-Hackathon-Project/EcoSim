# PolicyPulse API Server

This directory contains the backend server for the PolicyPulse project, built with FastAPI and Uvicorn. The server uses Google's Gemini API to generate opposing arguments for a given policy prompt.

## 1. Prerequisites

- Python 3.8+ installed on your system.

## 2. Setup and Installation

These steps should be run from within the `ecosimserver` directory.

### Step 1: Set Up Your API Key

Before you start, you must provide your Google API key.

1.  Create a new file named `.env` in this directory (`ecosimserver/.env`).
2.  Add your API key to this file like so:

    ```env
    GOOGLE_API_KEY="YOUR_API_KEY_HERE"
    ```

    *This file is included in `.gitignore`, so your key will remain private.*

### Step 2: Create a Virtual Environment

A virtual environment is a self-contained directory that holds a specific version of Python plus all the necessary libraries for a project. This keeps your projects isolated.

```bash
python -m venv venv
```

This command creates a new directory named `venv` which contains the virtual environment.

### Step 3: Activate the Virtual Environment (Windows)

To start using the virtual environment, you need to activate it. On Windows, run the following command in your terminal (CMD or PowerShell):

```bash
.\venv\Scripts\activate
```

After running this, you will see `(venv)` at the beginning of your terminal prompt, indicating that the virtual environment is active.

*(For Mac/Linux users, the command is `source venv/bin/activate`)*

### Step 4: Install Dependencies

With your virtual environment active, install all the required Python libraries from the `requirements.txt` file.

```bash
pip install -r requirements.txt
```

This will install FastAPI, Uvicorn, the Google AI library, and other necessary packages into your isolated `venv`.

## 3. Running the Server

Once the setup is complete, you can start the development server.

```bash
python main.py
```

The server will start, and you should see output in your terminal indicating that it is running on `http://0.0.0.0:8000`.

You can now access the API at [http://localhost:8000](http://localhost:8000).

## 4. Testing the API

There are two easy ways to test that the server is working correctly.

### Option A: Interactive Docs (Browser)

1.  Navigate to [http://localhost:8000/docs](http://localhost:8000/docs) in your browser. (RECOMMENDED DO THIS PLS PLS PLS)
2.  Expand the `/api/debate` endpoint.
3.  Click "Try it out", enter a policy prompt, and click "Execute".

### Option B: cURL (Terminal)

Open a new terminal and use the following command:

```bash
curl -X POST http://localhost:8000/api/debate \
-H "Content-Type: application/json" \
-d '{
  "prompt": "Should university education be free?"
}'
```

## 5. Deactivating the Virtual Environment

When you are finished working on the project, you can deactivate the virtual environment to return to your global Python context.

Simply type the following command:

```bash
deactivate
```

The `(venv)` prefix will disappear from your terminal prompt. 
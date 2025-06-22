# PolicyPulse AI Debate Server

A FastAPI backend for the PolicyPulse AI debate application that generates opposing arguments using Google Gemini and provides text-to-speech functionality using VAPI.

## Features

- **AI Debate Generation**: Uses Google Gemini to generate opposing arguments on policy topics
- **Google Search Grounding**: Real-time information retrieval for more accurate arguments
- **Text-to-Speech**: Convert AI responses to natural speech using VAPI
- **Chat Functionality**: Maintain conversation context for follow-up questions
- **CORS Support**: Configured for frontend integration

## Environment Variables

Create a `.env` file in the `ecosimserver` directory with the following variables:

```env
# Google Gemini API Key for AI responses
GOOGLE_API_KEY=your_google_gemini_api_key_here

# VAPI API Key for text-to-speech functionality
VAPI_API_KEY=your_vapi_api_key_here
```

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables (see above)

4. Run the server:
```bash
python main.py
```

The server will start on `http://localhost:8000`

## API Endpoints

### Debate Generation
- `POST /api/debate` - Generate initial debate arguments
- `POST /api/chat` - Continue conversation with context

### Text-to-Speech
- `POST /api/text-to-speech` - Convert text to speech using VAPI

### Health Check
- `GET /api/health` - Server health status

## Text-to-Speech Configuration

The text-to-speech feature uses VAPI with ElevenLabs voices:
- **Pro Advocate**: Uses "nova" voice
- **Con Advocate**: Uses "shimmer" voice

You can customize voices by modifying the `voice_id` parameter in the frontend. 
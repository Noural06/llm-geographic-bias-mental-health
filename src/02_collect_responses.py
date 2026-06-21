 import os
def get_clients():
    
    openai_key = os.getenv("OPENAI_API_KEY")
    gemini_key = os.getenv("GEMINI_API_KEY")
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")

    clients = {
        "openai": OpenAI(api_key=openai_key) if openai_key else None,
        "google": gemini_key,
        "anthropic": anthropic.Anthropic(api_key=anthropic_key) if anthropic_key else None,
    }

    if gemini_key:
        genai.configure(api_key=gemini_key)

    return clients

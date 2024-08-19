from django.shortcuts import render

# Create your views here.
import openai
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

openai.api_key = settings.OPENAI_API_KEY

@csrf_exempt
def ask_question(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_answer = data.get('user_answer')
        
        # Generate refined response using OpenAI's API
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"The user answered: {user_answer}. Please refine this answer as if preparing for an HR interview.",
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7,
        )
        
        refined_answer = response.choices[0].text.strip()
        
        return JsonResponse({'refined_answer': refined_answer})


def index(request):
    return render(request, 'interview/index.html')

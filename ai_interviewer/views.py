from django.shortcuts import render
import openai
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
openai.api_key = settings.OPENAI_API_KEY

def dashboard(request):
    return render(request, 'dashboard.html')

def home(request):
    return render(request, 'base.html')




@csrf_exempt
def question(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_answer = data.get('user_answer')
        topic = data.get('topic', 'General')

        # Example prompt for correcting the answer and giving feedback
        prompt = f"Topic: {topic}\nThe user answered: '{user_answer}'. Please correct the answer if necessary and provide feedback points."

        # Generate AI response
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=200,
            n=1,
            stop=None,
            temperature=0.7,
        )

        corrected_answer = response.choices[0].text.strip()
        feedback_points = "Feedback based on analysis: ..."  # Placeholder for actual feedback generation

        return JsonResponse({
            'corrected_answer': corrected_answer,
            'feedback_points': feedback_points
        })

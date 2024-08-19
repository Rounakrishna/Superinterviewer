from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('ask-question/', ask_question, name='ask_question'),
]

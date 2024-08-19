
from django.contrib import admin
from django.urls import path, include
from .views import *
urlpatterns = [
    path('admin/', admin.site.urls),
    path('interview/', include('interview.urls')),
    path('dashboard/',dashboard,name = 'dashboard'),
    path('',home,name = 'home'),

]

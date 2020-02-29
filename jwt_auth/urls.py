from django.urls import path
from .views import RegisterView, LoginView, UserProfileView, UserChatView

urlpatterns = [
    path('register', RegisterView.as_view()),
    path('login', LoginView.as_view()),
    path('users/<int:pk>/chats/', UserChatView.as_view()),
    path('users/<int:pk>/', UserProfileView.as_view())
]

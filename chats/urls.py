from django.urls import path
from .views import ChatDetailView, MessageListView, MessageDetailView

urlpatterns = [
    path('<int:pk>/', ChatDetailView.as_view()),
    path('<int:pk>/messages/', MessageListView.as_view()),
    path('<int:pk>/messages/<int:message_pk>/', MessageDetailView.as_view())
]

from django.urls import path
from .views import QuestionListView, QuestionDetailView, AnswerListView, AnswerDetailView

urlpatterns = [
    path('', QuestionListView.as_view()),
    path('<int:pk>/', QuestionDetailView.as_view()),
    path('<int:pk>/answers/', AnswerListView.as_view()),
    path('<int:pk>/answers/<int:answer_pk>/', AnswerDetailView.as_view()),
]

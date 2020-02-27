from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Question, Answer
from languages.models import Language
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'username')


class AnswerSerializer(serializers.ModelSerializer):

    class Meta:
        model = Answer
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = '__all__'


class LanguageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Language
        fields = '__all__'


class PopulatedAnswerSerializer(AnswerSerializer):
    owner = UserSerializer()


class PopulatedQuestionSerializer(QuestionSerializer):
    owner = UserSerializer()
    answers = PopulatedAnswerSerializer(many=True)
    languages = LanguageSerializer(many=True)

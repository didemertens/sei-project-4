from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Chat, Message
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class MessageSerializer(serializers.ModelSerializer):
    # owner = UserSerializer()

    class Meta:
        model = Message
        fields = '__all__'


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'


class PopulatedChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)
    receiver = UserSerializer()
    owner = UserSerializer()

    class Meta:
        model = Chat
        fields = ('id', 'owner', 'receiver', 'messages')

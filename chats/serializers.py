from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Chat, Message, Notification
from django.contrib.auth import get_user_model
User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = '__all__'


class UpdateNotificationSerializer(serializers.ModelSerializer):
    notifications = NotificationSerializer(many=True, required=False)

    class Meta:
        model = Chat
        fields = ('notifications', )


class PopulatedChatSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)
    receiver = UserSerializer()
    owner = UserSerializer()
    notifications = NotificationSerializer(many=True)

    class Meta:
        model = Chat
        fields = ('id', 'owner', 'receiver', 'messages',
                  'created_at', 'updated_at', 'notifications')

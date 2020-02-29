from chats.models import Notification
from chats.models import Chat
from languages.models import Language
from rest_framework import serializers
from django.contrib.auth import get_user_model
import django.contrib.auth.password_validation as validations
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError
User = get_user_model()


class LanguageSerializer(serializers.ModelSerializer):

    class Meta:
        model = Language
        fields = '__all__'


class BuddySerializer(serializers.ModelSerializer):
    languages = LanguageSerializer(many=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'image', 'languages')


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'


class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class ChatsSerializer(serializers.ModelSerializer):
    receiver = ChatUserSerializer()
    owner = ChatUserSerializer()

    class Meta:
        model = Chat
        fields = '__all__'


class PopulatedChatsSerializer(serializers.ModelSerializer):
    receiver = ChatUserSerializer()
    owner = ChatUserSerializer()
    notifications = NotificationSerializer(many=True)

    class Meta:
        model = Chat
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirmation = serializers.CharField(write_only=True)

    def validate(self, data):

        password = data.pop('password')
        password_confirmation = data.pop('password_confirmation')

        if password != password_confirmation:
            raise serializers.ValidationError(
                {'password_confirmation': 'Passwords do not match'})

        # ! Uncomment before deployment
        # try:
        #     validations.validate_password(password=password)
        # except ValidationError as err:
        #     raise serializers.ValidationError({'password': err.messages})

        data['password'] = make_password(password)
        return data

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password',
                  'password_confirmation', 'image', 'languages')


class SnippetUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'


class PopulatedUserSerialzer(UserSerializer):
    buddy = BuddySerializer()
    chats_from = PopulatedChatsSerializer(many=True)
    chats_with = PopulatedChatsSerializer(many=True)
    languages = LanguageSerializer(many=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'image',
                  'buddy', 'languages', 'chats_from', 'chats_with', 'unseen_chat')

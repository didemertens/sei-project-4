from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()


class Chat(models.Model):
    owner = models.ForeignKey(
        User, related_name='chats_from', on_delete=models.CASCADE, default='')
    receiver = models.ForeignKey(
        User, related_name='chats_with', on_delete=models.CASCADE, default='')

    def __str__(self):
        return f'Chat from {self.owner} with {self.receiver}'


class Message(models.Model):
    text = models.CharField(max_length=800)
    chat = models.ForeignKey(
        Chat, related_name='messages', null=True, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        User, related_name='messages', null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Message from {self.owner}'

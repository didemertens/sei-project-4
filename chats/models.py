from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()


class Chat(models.Model):
    owner = models.ForeignKey(
        User, related_name='chats_from', null=True, on_delete=models.CASCADE)
    receiver = models.ForeignKey(
        User, related_name='chats_with', null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f'Chat from {self.owner} with {self.receiver}'


class Message(models.Model):
    text = models.CharField(max_length=800)
    chat = models.ForeignKey(
        Chat, related_name='messages', null=True, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        User, related_name='messages', null=True, on_delete=models.CASCADE)

    def __str__(self):
        return f'Message from {self.owner}'

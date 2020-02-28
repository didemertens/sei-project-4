# pylint: disable=no-member
from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()


class Question(models.Model):
    title = models.CharField(max_length=100)
    text = models.TextField()
    owner = models.ForeignKey(
        User, related_name='questions', null=True, on_delete=models.CASCADE)
    languages = models.ManyToManyField(
        'languages.Language', related_name='questions')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Answer(models.Model):
    question = models.ForeignKey(
        Question, related_name='answers', null=True, on_delete=models.CASCADE)
    owner = models.ForeignKey(
        User, related_name='answers', null=True, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Comment {self.id} on {self.question}'

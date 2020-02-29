from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.CharField(max_length=40, unique=True)
    image = models.CharField(max_length=200)
    buddy = models.ForeignKey(
        "User", null=True, blank=True, on_delete=models.SET_NULL)
    languages = models.ManyToManyField(
        'languages.Language', related_name='users', blank=True)
    unseen_chat = models.BooleanField(default=False)

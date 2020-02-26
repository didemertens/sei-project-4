from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    email = models.CharField(max_length=40, unique=True)
    image = models.CharField(max_length=200)
    buddy = models.ForeignKey(
        "User", null=True, blank=True, on_delete=models.SET_NULL)

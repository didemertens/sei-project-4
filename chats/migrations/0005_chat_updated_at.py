# Generated by Django 2.2.9 on 2020-02-28 10:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chats', '0004_auto_20200227_1647'),
    ]

    operations = [
        migrations.AddField(
            model_name='chat',
            name='updated_at',
            field=models.DateTimeField(auto_now=True),
        ),
    ]

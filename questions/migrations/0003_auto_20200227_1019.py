# Generated by Django 2.2.9 on 2020-02-27 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questions', '0002_question_languages'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='languages',
            field=models.ManyToManyField(related_name='questions', to='languages.Language'),
        ),
    ]

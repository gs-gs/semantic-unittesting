# Generated by Django 3.2.21 on 2023-10-12 03:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('contenttester', '0006_add_job_model'),
    ]

    operations = [
        migrations.AlterField(
            model_name='assessment',
            name='prompt',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='assessment',
            name='value',
            field=models.CharField(blank=True, choices=[('Pass', 'Response is valid'), ('Fail', 'Response is invalid'), ('None', 'Unsure of response validity')], default='None', max_length=12, null=True),
        ),
    ]
from django.db import models
from django.contrib.auth.models import User

class Task(models.Model):
    # a task that is optional for a user
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title 

# MY NOTES
# models.ForeignKey(user ... ) so a user can have many task
# on_delete=models.CASCADE - if user is deleted, all tasks is deleted
# nullable


from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/tasks/', include('tasks.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
                    # tbh i dont understand this code but ik this is jwt token :(
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

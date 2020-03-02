# pylint: disable=no-member
import jwt
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework.status import HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_202_ACCEPTED, HTTP_401_UNAUTHORIZED
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .serializers import UserSerializer, PopulatedUserSerialzer, SnippetUserSerializer
User = get_user_model()


class RegisterView(APIView):

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Registration successful'}, status=HTTP_201_CREATED)

        return Response(serializer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class LoginView(APIView):

    def get_user(self, email):
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            raise PermissionDenied({'message': 'Invalid credentials'})

    def post(self, request):

        email = request.data.get('email')
        password = request.data.get('password')

        user = self.get_user(email)
        if not user.check_password(password):
            raise PermissionDenied({'message': 'Invalid credentials'})

        #  Buddy
        if user.buddy == None:
            buddies = User.objects.filter(buddy=None)
            for p in buddies:
                if p.username != user.username:
                    user.buddy = p
                    p.buddy = user
                    p.save()
                    user.save()

        dt = datetime.now() + timedelta(days=7)

        token = jwt.encode({'sub': user.id, 'exp': int(
            dt.strftime('%s'))}, settings.SECRET_KEY, algorithm='HS256')
        return Response({'token': token, 'message': f'Welcome back {user.username}!'})


class UserProfileView(APIView):

    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise PermissionDenied({'message': 'Not Found'})

    def get(self, request, pk):
        user = self.get_user(pk)

        if pk == request.user.id:
            user.unseen_chat = False
            user.save()

        ser_user = PopulatedUserSerialzer(user)
        return Response(ser_user.data)

    def put(self, request, pk):
        user = self.get_user(pk)
        if user.id != request.user.id:
            return Response(status=HTTP_401_UNAUTHORIZED)

        ser_user = SnippetUserSerializer(user, data=request.data, partial=True)
        if ser_user.is_valid():
            ser_user.save()
            serialized_user = UserSerializer(user)
            return Response(serialized_user.data, status=HTTP_202_ACCEPTED)
        return Response(ser_user.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class UserChatView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get_user(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise PermissionDenied({'message': 'Not Found'})

    def get(self, request, pk):
        user = self.get_user(pk)
        ser_user = PopulatedUserSerialzer(user)
        return Response(ser_user.data['unseen_chat'])

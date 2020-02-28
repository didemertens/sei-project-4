# pylint: disable=no-member
from .serializers import ChatSerializer, MessageSerializer, PopulatedChatSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_401_UNAUTHORIZED, HTTP_202_ACCEPTED, HTTP_204_NO_CONTENT
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Chat, Message


class ChatListView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request):
        request.data['owner'] = request.user.id
        chat = ChatSerializer(data=request.data)

        if chat.is_valid():
            chat.save()
            return Response(chat.data, status=HTTP_201_CREATED)
        return Response(chat.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class ChatDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, pk):
        try:
            chat = Chat.objects.get(pk=pk)

            if chat.owner.id != request.user.id and chat.receiver.id != request.user.id:
                return Response(status=HTTP_401_UNAUTHORIZED)

            serialized_chat = PopulatedChatSerializer(chat)
            return Response(serialized_chat.data)
        except Chat.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            chat = Chat.objects.get(pk=pk)

            if chat.owner.id != request.user.id and chat.receiver.id != request.user.id:
                return Response(status=HTTP_401_UNAUTHORIZED)

            chat.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        except Chat.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)


class MessageListView(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        request.data['chat'] = pk
        request.data['owner'] = request.user.id

        message = MessageSerializer(data=request.data)

        if message.is_valid():
            message.save()
            chat = Chat.objects.get(pk=pk)
            chat.save()
            serialized_chat = PopulatedChatSerializer(chat)
            return Response(serialized_chat.data, status=HTTP_201_CREATED)

        return Response(message.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class MessageDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    def delete(self, request, **kwargs):
        try:
            message = Message.objects.get(pk=kwargs['message_pk'])

            if message.owner.id != request.user.id:
                return Response(status=HTTP_401_UNAUTHORIZED)

            message.delete()
            chat = Chat.objects.get(pk=kwargs['pk'])
            ser_chat = PopulatedChatSerializer(chat)
            return Response(ser_chat.data, status=HTTP_202_ACCEPTED)
        except Message.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

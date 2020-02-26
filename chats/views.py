# pylint: disable=no-member
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_401_UNAUTHORIZED, HTTP_202_ACCEPTED
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from .models import Chat, Message
from .serializers import ChatSerializer, MessageSerializer


class ChatDetailView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, pk):
        try:
            chat = Chat.objects.get(pk=pk)

            if chat.owner.id != request.user.id and chat.receiver.id != request.user.id:
                return Response(status=HTTP_401_UNAUTHORIZED)

            serialized_chat = ChatSerializer(chat)
            return Response(serialized_chat.data)
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
            serialized_chat = ChatSerializer(chat)
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
            ser_chat = ChatSerializer(chat)
            return Response(ser_chat.data, status=HTTP_202_ACCEPTED)
        except Message.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)
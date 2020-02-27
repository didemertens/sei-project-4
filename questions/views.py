# pylint: disable=no-member
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_201_CREATED, HTTP_422_UNPROCESSABLE_ENTITY, HTTP_204_NO_CONTENT, HTTP_202_ACCEPTED, HTTP_401_UNAUTHORIZED
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Question, Answer
from .serializers import QuestionSerializer, PopulatedQuestionSerializer, AnswerSerializer


class QuestionListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request):
        questions = Question.objects.all()
        serialized_questions = PopulatedQuestionSerializer(
            questions, many=True)
        return Response(serialized_questions.data)

    def post(self, request):
        request.data['owner'] = request.user.id
        question = QuestionSerializer(data=request.data)

        if question.is_valid():
            question.save()

            question_db = Question.objects.get(pk=question['id'].value)
            question_db_ser = PopulatedQuestionSerializer(question_db)
            return Response(question_db_ser.data, status=HTTP_201_CREATED)
        return Response(question.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class QuestionDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def get(self, _request, pk):
        try:
            question = Question.objects.get(pk=pk)
            serialized_question = PopulatedQuestionSerializer(question)
            return Response(serialized_question.data)
        except Question.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        try:
            question = Question.objects.get(pk=pk)

            if question.owner.id != request.user.id:
                return Response(status=HTTP_401_UNAUTHORIZED)

            question.delete()
            return Response(status=HTTP_204_NO_CONTENT)
        except Question.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)


class AnswerListView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def post(self, request, pk):
        request.data['question'] = pk
        request.data['owner'] = request.user.id

        answer = AnswerSerializer(data=request.data)

        if answer.is_valid():
            answer.save()
            question = Question.objects.get(pk=pk)
            serialized_question = PopulatedQuestionSerializer(question)
            return Response(serialized_question.data, status=HTTP_201_CREATED)

        return Response(answer.errors, status=HTTP_422_UNPROCESSABLE_ENTITY)


class AnswerDetailView(APIView):
    permission_classes = (IsAuthenticatedOrReadOnly, )

    def delete(self, request, **kwargs):
        try:
            answer = Answer.objects.get(pk=kwargs['answer_pk'])

            if answer.owner.id != request.user.id:
                return Response(status=HTTP_401_UNAUTHORIZED)

            answer.delete()
            question = Question.objects.get(pk=kwargs['pk'])
            serialized_question = PopulatedQuestionSerializer(question)
            return Response(serialized_question.data, status=HTTP_202_ACCEPTED)
        except Answer.DoesNotExist:
            return Response({'message': 'Not Found'}, status=HTTP_404_NOT_FOUND)

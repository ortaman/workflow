
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from rest_framework import status
from rest_framework.response import Response

class APIMixin(object):
    """
    Add funcionality:
        To get object or return 404
        To paginate
    """

    model = None
    serializer_list = None
    paginate_by = 10

    def get_object(self, pk):
        try:
            obj =  self.model.objects.get(pk=pk)
            self.check_object_permissions(self.request, obj)
            return obj

        except self.model.DoesNotExist:
            raise Http404


    def get_pagination(self, objects, page, paginate_by):
        """
        Get paginated data.
        """
        paginator = Paginator(objects, paginate_by)

        try:
            objects_list = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            page = 1
            objects_list = paginator.page(page)
        except EmptyPage:
            # If page is out of range, deliver last page of results.
            page = paginator.num_pages
            objects_list = paginator.page(page)

        serializer = self.serializer_list(objects_list, many=True)

        data = {
            'page': page,
            'paginate_by':paginate_by,
            'count': paginator.count,
            'results': serializer.data,
        }

        return data


    def put_vatidations(self, obj, user):

        error = {}
        open_status = ('Pendiente', 'Aceptada', 'Ejecutada')
        close_status = ('Satisfactoria', 'Insatisfactoria')

        if obj.client == user:
            if obj.status in close_status:
                error['detail'] = 'Actualización a una promesa calificada no es permitado'

                return Response(data=error, status=status.HTTP_405_METHOD_NOT_ALLOWED)


        else:
            error['detail'] = 'Usuario no autorizado'

            return Response(data=error, status=status.HTTP_401_UNAUTHORIZED)


    def patch_vatidations(self, obj, user):

        error = {}
        open_status = ('Pendiente', 'Aceptada', 'Ejecutada')
        close_status = ('Satisfactoria', 'Insatisfactoria')

        if obj.producer == user:
            if obj.status in close_status:
                error['detail'] = 'Actualización a una promesa calificada no es permitado'

                return Response(data=error, status=status.HTTP_405_METHOD_NOT_ALLOWED)

        else:
            error['detail'] = 'Usuario no autorizado'

            return Response(data=error, status=status.HTTP_401_UNAUTHORIZED)

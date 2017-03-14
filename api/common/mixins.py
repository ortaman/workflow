
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


class CommonMixin(object):
    """
    Add funcionality:
        To get object or return 404  
        To paginate
    """

    model = None
    serializer_class = None
    paginate_by = 10

    def get_object(self, pk):
        """
        Get object or 404.
        """
        try:
            return self.model.objects.get(pk=pk)
        except self.model.DoesNotExist:
            raise Http404


    def get_pagination(self, objects, page):
        """
        Get paginated data.
        """
        paginator = Paginator(objects, self.paginate_by)

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

        serializer = self.serializer_class(objects_list, many=True)

        data = {
            'page': page,
            'count': paginator.count,  
            'results': serializer.data,
        }

        return data

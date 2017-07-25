
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class MyCustomPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'paginate_by'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'page': self.page.number,
            'paginated_by': self.page.paginator.per_page,
            'count': self.page.paginator.count,
            'results': data
        })

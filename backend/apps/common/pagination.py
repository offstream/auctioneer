from rest_framework import pagination


class CustomPagination(pagination.CursorPagination):
    max_page_size = 1000
    page_size_query_param = "page_size"
    ordering = "-created_at"

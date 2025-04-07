from urllib.parse import urlparse, parse_qs, urlencode

def get_current_page(url):
    parsed_url = urlparse(url)
    query_params = parse_qs(parsed_url.query)
    return int(query_params.get('page', [1])[0])

def get_next_page_url(current_url):
    parsed_url = urlparse(current_url)
    query_params = parse_qs(parsed_url.query)
    current_page = int(query_params.get('page', [1])[0])
    next_page = current_page + 1
    query_params['page'] = str(next_page)
    return parsed_url._replace(query=urlencode(query_params, doseq=True)).geturl()
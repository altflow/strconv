##
# urlencode.py
# 
# This encodes/decodes strings to/from URL encoding
#

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app

import urllib

class UrlEncode(webapp.RequestHandler):
    def post(self):
        text      = self.request.get('text')
        encoding  = self.request.get('encoding')
        operation = self.request.get('operation')
        converted = ''
        
        if operation == 'encode':
            converted = urllib.quote(text.encode(encoding))
        elif operation == 'decode':
            converted = urllib.unquote(text.encode(encoding))
            converted = converted.decode(encoding).encode('utf-8')
        
        self.response.headers['Content-Type'] = 'text/plain'
        self.response.out.write(converted)
        

application = webapp.WSGIApplication([('/urlencode', UrlEncode)], debug=True)

def main():
    run_wsgi_app(application)

if __name__ == "__main__":
    main()

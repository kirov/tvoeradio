from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.db import transaction
from django.utils import simplejson
import urllib

from tvoeradio.radio.models import TopTag, TopArtist


class Command(BaseCommand):

    def lastfm_request(self, method, **kwargs):
        params = {}
        params['api_key'] = settings.LASTFM_API_KEY
        params['format'] = 'json'
        params['method'] = method
        for (k, v) in kwargs.iteritems():
            params[k] = v
        api_url = settings.LASTFM_API_URL
        fetcher = urllib.urlopen(api_url + '?' + urllib.urlencode(params))
        return simplejson.loads(fetcher.read())

    def handle(self, *args, **options):

        @transaction.commit_on_success
        def update_top_tags(self):
            data = self.lastfm_request('chart.getTopTags')
            TopTag.objects.all().delete()
            for tag in data['tags']['tag']:
                TopTag(name=tag['name'], popularity=tag['taggings']).save()
                self.stdout.write('Tag "%s"\n' % tag['name'])

        update_top_tags(self)
